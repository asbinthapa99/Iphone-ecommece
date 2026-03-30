import type { Order } from '@/types'
import { orderPlacedEmail } from './emails/order-placed'
import { orderConfirmedEmail } from './emails/order-confirmed'
import { orderProcessingEmail } from './emails/order-processing'
import { paymentSuccessEmail } from './emails/payment-success'
import { deliveryInProcessEmail } from './emails/delivery-in-process'
import { deliveredEmail } from './emails/delivered'
import { resetOtpEmail as getResetOtpEmail } from './emails/reset-otp'
import { welcomeEmail as getWelcomeEmail } from './emails/welcome'
import { adminNewOrderEmail } from './emails/admin-new-order'
import { orderCancelledEmail } from './emails/order-cancelled'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export type EmailSendResult =
  | { ok: true }
  | { ok: false; error: string }

/** Strip HTML tags to produce a plain-text fallback (improves spam scoring) */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Core email sender using Brevo's REST API.
 * Sends both HTML and plain-text versions to avoid spam filters.
 */
async function send(to: string, subject: string, htmlContent: string): Promise<EmailSendResult> {
  const apiKey = process.env.BREVO_SMTP_KEY
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME ?? 'Inexa Nepal'

  if (!apiKey || !fromEmail) {
    console.warn(`[email] Missing BREVO_SMTP_KEY or BREVO_FROM_EMAIL — email not sent.`)
    console.log(`[email] To: ${to} | Subject: ${subject}`)
    return { ok: false, error: 'Missing BREVO email configuration' }
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: to }],
        replyTo: { email: fromEmail, name: fromName },
        subject,
        htmlContent,
        textContent: htmlToText(htmlContent),
        headers: {
          'X-Mailer': 'Inexa Nepal Transactional',
          'X-Entity-Ref-ID': `${Date.now()}-${to.replace(/[^a-z0-9]/gi, '')}`,
        },
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
      console.error('[email] Brevo API failure:', { status: res.status, error: errorData })
      const detail = typeof errorData === 'object' && errorData && 'message' in errorData
        ? String(errorData.message)
        : res.statusText
      return { ok: false, error: `Brevo rejected email (${res.status}): ${detail}` }
    }
    return { ok: true }
  } catch (err) {
    console.error('[email] Request failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown request failure'
    return { ok: false, error: `Email request failed: ${message}` }
  }
}

export async function sendOrderConfirmed(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = orderConfirmedEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendPaymentSuccess(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = paymentSuccessEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendDeliveryInProcess(order: Order & { trackingNumber?: string }): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = deliveryInProcessEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendDelivered(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = deliveredEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendPasswordResetEmail(email: string, otp: string): Promise<EmailSendResult> {
  const { subject, html } = getResetOtpEmail(otp, email)
  return send(email.toLowerCase().trim(), subject, html)
}

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<EmailSendResult> {
  const normalized = email.toLowerCase().trim()
  const { subject, html } = getWelcomeEmail(name ?? null, SITE_URL)
  return send(normalized, subject, html)
}

export async function sendAdminNewOrder(order: Order): Promise<EmailSendResult> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return { ok: false, error: 'Missing ADMIN_EMAIL configuration' }
  const { subject, html } = adminNewOrderEmail(order, SITE_URL)
  return send(adminEmail, subject, html)
}

export async function sendOrderCancelled(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = orderCancelledEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendOrderPlaced(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = orderPlacedEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}

export async function sendOrderProcessing(order: Order): Promise<EmailSendResult> {
  if (!order.buyerEmail) return { ok: false, error: 'Missing buyer email' }
  const { subject, html } = orderProcessingEmail(order, SITE_URL)
  return send(order.buyerEmail, subject, html)
}
