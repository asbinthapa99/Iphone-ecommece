import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { initUsersTable, sql } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'
import { isPrimaryAdminEmail } from '@/lib/admin-emails'
import { rateLimit } from '@/lib/rate-limit'

async function resolveIsAdmin(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim()

  await initUsersTable()

  if (isPrimaryAdminEmail(normalizedEmail)) {
    await sql`UPDATE users SET is_admin = TRUE WHERE LOWER(email) = ${normalizedEmail}`
    return true
  }
  return false
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        // Rate limit: 10 attempts per 5 minutes per IP
        const ip =
          (req?.headers?.['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ??
          (req?.headers?.['x-real-ip'] as string | undefined) ??
          'unknown'
        const { allowed } = await rateLimit(`login:${ip}`, 10, 5 * 60 * 1000)
        if (!allowed) {
          throw new Error('Too many login attempts. Please wait 5 minutes and try again.')
        }

        await initUsersTable()
        const rows = await sql`
          SELECT id, name, email, password, provider, is_admin
          FROM users
          WHERE email = ${credentials.email.toLowerCase().trim()}
        `

        if (rows.length === 0) {
          throw new Error('No account found with this email. Please sign up first.')
        }

        const user = rows[0]

        if (!user.password) {
          throw new Error('This account uses Google sign-in. Please continue with Google.')
        }

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) {
          throw new Error('Incorrect password. Please try again.')
        }

        const isAdmin = await resolveIsAdmin(user.email)

        return { id: user.id, name: user.name, email: user.email, isAdmin }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await initUsersTable()
          const email = user.email.toLowerCase().trim()
          const name = user.name?.trim() || null
          const existingRows = await sql`SELECT id FROM users WHERE LOWER(email) = ${email} LIMIT 1`
          const isFirstGoogleSignup = existingRows.length === 0
          const isAdminByEnv = isPrimaryAdminEmail(email)
          await sql`
            INSERT INTO users (name, email, provider, password, phone, is_admin)
            VALUES (${name}, ${email}, 'google', NULL, NULL, ${isAdminByEnv})
            ON CONFLICT (email) DO UPDATE
            SET
              name = COALESCE(EXCLUDED.name, users.name),
              is_admin = users.is_admin OR EXCLUDED.is_admin,
              provider = CASE
                WHEN users.password IS NOT NULL THEN users.provider
                ELSE 'google'
              END
          `
          if (isFirstGoogleSignup) {
            sendWelcomeEmail(email, name).catch(console.error)
          }
        } catch {
          // Never block sign-in if profile persistence fails.
        }
      }
      return true
    },
    session({ session, token }) {
      if (session.user) {
        const u = session.user as { id?: string; isAdmin?: boolean }
        u.id = token.sub ?? token.email ?? ''
        u.isAdmin = (token.isAdmin as boolean) ?? false
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account) token.provider = account.provider
      // Persist isAdmin from authorize() into the JWT (Credentials sign-in)
      if (user) token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false
      // Re-check admin status from DB/env to avoid stale JWT role claims.
      if (token.email) {
        token.isAdmin = await resolveIsAdmin(token.email)
      }
      return token
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
}
