import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { isPrimaryAdminEmail } from '@/lib/admin-emails'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isPrimaryAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const apiKey = process.env.BREVO_SMTP_KEY
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME ?? 'Inexa Nepal'

  // Show what env vars are present (masked)
  const debug = {
    BREVO_SMTP_KEY: apiKey ? `${apiKey.slice(0, 12)}...` : 'MISSING',
    BREVO_FROM_EMAIL: fromEmail ?? 'MISSING',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? 'MISSING',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'MISSING',
  }

  if (!apiKey || !fromEmail) {
    return NextResponse.json({ error: 'Missing env vars', debug })
  }

  // Attempt to send a test email to the admin
  const to = process.env.ADMIN_EMAIL ?? session.user.email

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to }],
      subject: 'Inexa Nepal — Email test',
      htmlContent: '<p>This is a test email from Inexa Nepal. If you see this, emails are working!</p>',
    }),
  })

  const body = await res.json().catch(() => ({}))

  return NextResponse.json({
    status: res.status,
    ok: res.ok,
    brevoResponse: body,
    sentTo: to,
    debug,
  })
}
