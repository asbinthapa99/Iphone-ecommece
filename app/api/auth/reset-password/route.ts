import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email, otp, password } = await req.json()

  if (!email || !otp || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Check attempt count before trying to claim
  const existing = await sql`
    SELECT attempts, used, expires_at FROM password_reset_tokens
    WHERE email = ${normalizedEmail} AND otp = ${otp}
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
      AND otp        = ${otp}
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
      WHERE email = ${normalizedEmail} AND otp = ${otp} AND used = FALSE
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
