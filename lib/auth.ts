import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.')
        }

        const rows = await sql`
          SELECT id, name, email, password, provider
          FROM users
          WHERE email = ${credentials.email.toLowerCase().trim()}
        `

        if (rows.length === 0) {
          throw new Error('No account found with this email. Please sign up first.')
        }

        const user = rows[0]

        if (user.provider !== 'credentials' || !user.password) {
          throw new Error('This account uses Google sign-in. Please continue with Google.')
        }

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) {
          throw new Error('Incorrect password. Please try again.')
        }

        // Admin role is determined server-side only via env var — never exposed to client
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
        const isAdmin = !!adminEmail && user.email.toLowerCase() === adminEmail

        return { id: user.id, name: user.name, email: user.email, isAdmin }
      },
    }),
  ],

  callbacks: {
    session({ session, token }) {
      if (session.user) {
        const u = session.user as { id?: string; isAdmin?: boolean }
        u.id = token.sub ?? token.email ?? ''
        u.isAdmin = (token.isAdmin as boolean) ?? false
      }
      return session
    },
    jwt({ token, user, account }) {
      if (account) token.provider = account.provider
      // Persist isAdmin from authorize() into the JWT (Credentials sign-in)
      if (user) token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false
      // Also grant admin for Google OAuth if signed-in email matches ADMIN_EMAIL
      if (account?.provider === 'google' && token.email) {
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()
        if (adminEmail && token.email.toLowerCase() === adminEmail) token.isAdmin = true
      }
      return token
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
}
