import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`
  if (existing.length > 0) {
    // Return 200 with neutral message — don't reveal whether email is registered
    return NextResponse.json({ ok: true })
  }

  const hash = await bcrypt.hash(password, 12)

  await sql`
    INSERT INTO users (name, email, phone, password, provider)
    VALUES (${name ?? null}, ${email.toLowerCase().trim()}, ${phone ?? null}, ${hash}, 'credentials')
  `

  return NextResponse.json({ ok: true }, { status: 201 })
}
