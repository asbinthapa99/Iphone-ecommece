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

  const { name, email, phone, password } = payload as {
    name?: unknown
    email?: unknown
    phone?: unknown
    password?: unknown
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  if (!emailOk) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const passwordError = validatePasswordStrength(password)
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 })
  }

  const normalizedName = typeof name === 'string' ? name.trim() : ''
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : ''
  if (normalizedName.length > 100) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  }
  if (normalizedPhone.length > 25) {
    return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail}`
  if (existing.length > 0) {
    // Return 200 with neutral message — don't reveal whether email is registered
    return NextResponse.json({ ok: true })
  }

  const hash = await bcrypt.hash(password, 12)

  await sql`
    INSERT INTO users (name, email, phone, password, provider)
    VALUES (${normalizedName || null}, ${normalizedEmail}, ${normalizedPhone || null}, ${hash}, 'credentials')
  `

  return NextResponse.json({ ok: true }, { status: 201 })
}
