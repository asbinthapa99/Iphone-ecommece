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
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)

  const rows = await sql`
    INSERT INTO users (name, email, phone, password, provider)
    VALUES (${name ?? null}, ${email.toLowerCase().trim()}, ${phone ?? null}, ${hash}, 'credentials')
    RETURNING id, name, email
  `

  return NextResponse.json({ user: rows[0] }, { status: 201 })
}
