import type { Order } from '@/types'
import { orderConfirmedEmail } from './emails/order-confirmed'
import { paymentSuccessEmail } from './emails/payment-success'
import { deliveryInProcessEmail } from './emails/delivery-in-process'
import { deliveredEmail } from './emails/delivered'
import { resetOtpEmail as getResetOtpEmail } from './emails/reset-otp'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

/**
 * Core email sender using Brevo's REST API. 
 * Replaces older SMTP logic which can be unreliable in edge functions.
 */
async function send(to: string, subject: string, htmlContent: string) {
  const apiKey = process.env.BREVO_SMTP_KEY // Brevo uses the same key for SMTP and API v3
  const fromEmail = process.env.BREVO_FROM_EMAIL
  const fromName = process.env.BREVO_FROM_NAME ?? 'Inexa Nepal'

  if (!apiKey || !fromEmail) {
    console.warn(`[email] Missing BREVO_SMTP_KEY or BREVO_FROM_EMAIL. Logging to console instead.`)
    console.log(`[email] To: ${to} | Subject: ${subject}`)
    return
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
        subject,
        htmlContent,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
      console.error('[email] Brevo API failure:', {
        status: res.status,
        error: errorData,
      })
      throw new Error(`Email delivery failed: ${res.statusText}`)
    }
  } catch (err) {
    console.error('[email] Request failed:', err)
  }
}

export async function sendOrderConfirmed(order: Order) {
  if (!order.buyerEmail) return
  const { subject, html } = orderConfirmedEmail(order, SITE_URL)
  await send(order.buyerEmail, subject, html)
}

export async function sendPaymentSuccess(order: Order) {
  if (!order.buyerEmail) return
  const { subject, html } = paymentSuccessEmail(order, SITE_URL)
  await send(order.buyerEmail, subject, html)
}

export async function sendDeliveryInProcess(order: Order & { trackingNumber?: string }) {
  if (!order.buyerEmail) return
  const { subject, html } = deliveryInProcessEmail(order, SITE_URL)
  await send(order.buyerEmail, subject, html)
}

export async function sendDelivered(order: Order) {
  if (!order.buyerEmail) return
  const { subject, html } = deliveredEmail(order, SITE_URL)
  await send(order.buyerEmail, subject, html)
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  const { subject, html } = getResetOtpEmail(otp, email)
  await send(email.toLowerCase().trim(), subject, html)
}
