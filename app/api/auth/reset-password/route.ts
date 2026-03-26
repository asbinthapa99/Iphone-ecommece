import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'
import { validatePasswordStrength } from '@/lib/password'

export async function POST(req: NextRequest) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { email, otp, password } = payload as {
    email?: unknown
    otp?: unknown
    password?: unknown
  }

  if (typeof email !== 'string' || typeof otp !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  const otpDigits = otp.replace(/\D/g, '')
  if (otpDigits.length !== 8) {
    return NextResponse.json({ error: 'Code must be 8 digits.' }, { status: 400 })
  }

  const passwordError = validatePasswordStrength(password)
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  if (!emailOk) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Check attempt count before trying to claim
  const existing = await sql`
    SELECT attempts, used, expires_at FROM password_reset_tokens
    WHERE email = ${normalizedEmail} AND otp = ${otpDigits}
    ORDER BY created_at DESC LIMIT 1
  `

  if (existing.length > 0 && existing[0].attempts >= 5) {
    return NextResponse.json({ error: 'Too many attempts. Please request a new code.' }, { status: 429 })
  }

  // Atomic claim — eliminates race condition, only one request can succeed
  const claimed = await sql`
    UPDATE password_reset_tokens
    SET used = TRUE
    WHERE email      = ${normalizedEmail}
      AND otp        = ${otpDigits}
      AND used       = FALSE
      AND expires_at > NOW()
      AND attempts   < 5
    RETURNING id
  `

  if (claimed.length === 0) {
    // Increment failed attempt counter on the token
    await sql`
      UPDATE password_reset_tokens
      SET attempts = attempts + 1
      WHERE email = ${normalizedEmail} AND otp = ${otpDigits} AND used = FALSE
    `
    // Return specific error based on token state
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
    }
    if (existing[0].used) {
      return NextResponse.json({ error: 'This code has already been used.' }, { status: 400 })
    }
    if (new Date(existing[0].expires_at) < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`UPDATE users SET password = ${hash} WHERE email = ${normalizedEmail}`

  return NextResponse.json({ ok: true })
}
