import { NextRequest, NextResponse } from 'next/server'
import { sql, initUsersTable } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

function generateOtp() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 9000 + 1000)
}

export async function POST(req: NextRequest) {
  await initUsersTable()
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }
  const rawEmail = (payload as { email?: unknown }).email
  if (typeof rawEmail !== 'string') return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  const email = rawEmail.toLowerCase().trim()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })

  const users = await sql`SELECT id FROM users WHERE email = ${email}`
  // Always return success to prevent email enumeration
  if (users.length === 0) {
    return NextResponse.json({ ok: true })
  }

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  // Invalidate any existing tokens for this email
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE email = ${email}`

  await sql`
    INSERT INTO password_reset_tokens (email, otp, expires_at)
    VALUES (${email}, ${otp}, ${expiresAt})
  `

  // Use unified email utility
  await sendPasswordResetEmail(email, otp)

  return NextResponse.json({ ok: true })
}
