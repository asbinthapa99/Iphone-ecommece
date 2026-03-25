import { NextRequest, NextResponse } from 'next/server'
import { sql, initUsersTable } from '@/lib/db'
import { resetOtpEmail } from '@/lib/emails/reset-otp'

function generateOtp() {
  // 8 cryptographically random digits — 100x harder to brute force than 6
  return crypto.getRandomValues(new Uint32Array(1))[0] % 90000000 + 10000000 + ''
}

export async function POST(req: NextRequest) {
  await initUsersTable()
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

  if (process.env.BREVO_SMTP_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_SMTP_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_FROM_NAME ?? 'Inexa Nepal',
            email: process.env.BREVO_FROM_EMAIL,
          },
          to: [{ email }],
          subject,
          htmlContent: html,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('[forgot-password] Brevo error:', err)
        return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 500 })
      }
    } catch (err) {
      console.error('[forgot-password] Email send failed:', err)
      return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 500 })
    }
  } else {
    console.warn('[forgot-password] BREVO_SMTP_KEY not set — email not sent')
  }

  return NextResponse.json({ ok: true })
}
