import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { Resend } from 'resend'
import { resetOtpEmail } from '@/lib/emails/reset-otp'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })

  const users = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`
  // Always return success to prevent email enumeration
  if (users.length === 0) {
    return NextResponse.json({ ok: true })
  }

  const otp = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  // Invalidate any existing tokens for this email
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE email = ${email.toLowerCase().trim()}`

  await sql`
    INSERT INTO password_reset_tokens (email, otp, expires_at)
    VALUES (${email.toLowerCase().trim()}, ${otp}, ${expiresAt})
  `

  const { subject, html } = resetOtpEmail(otp, email)

  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_your')) {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'Inexa Nepal <orders@inexanepal.com>',
      to: email,
      subject,
      html,
    })
  }

  return NextResponse.json({ ok: true })
}
