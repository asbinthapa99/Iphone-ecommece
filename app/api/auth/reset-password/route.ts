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

  const tokens = await sql`
    SELECT id, expires_at, used FROM password_reset_tokens
    WHERE email = ${email.toLowerCase().trim()} AND otp = ${otp}
    ORDER BY created_at DESC LIMIT 1
  `

  if (tokens.length === 0) {
    return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
  }

  const token = tokens[0]

  if (token.used) {
    return NextResponse.json({ error: 'This code has already been used.' }, { status: 400 })
  }
  if (new Date(token.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)

  await sql`UPDATE users SET password = ${hash} WHERE email = ${email.toLowerCase().trim()}`
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE id = ${token.id}`

  return NextResponse.json({ ok: true })
}
