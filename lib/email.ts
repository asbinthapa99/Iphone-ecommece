import { Resend } from 'resend'
import type { Order } from '@/types'
import { orderConfirmedEmail } from './emails/order-confirmed'
import { paymentSuccessEmail } from './emails/payment-success'
import { deliveryInProcessEmail } from './emails/delivery-in-process'
import { deliveredEmail } from './emails/delivered'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'Inexa Nepal <orders@inexanepal.com>'
const SITE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_your')) {
    // Dev mode — just log instead of sending
    console.log(`[email] To: ${to} | Subject: ${subject}`)
    return
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[email] Failed to send:', err)
  }
}

export async function sendOrderConfirmed(order: Order) {
  const to = order.buyerEmail
  if (!to) return
  const { subject, html } = orderConfirmedEmail(order, SITE_URL)
  await send(to, subject, html)
}

export async function sendPaymentSuccess(order: Order) {
  const to = order.buyerEmail
  if (!to) return
  const { subject, html } = paymentSuccessEmail(order, SITE_URL)
  await send(to, subject, html)
}

export async function sendDeliveryInProcess(order: Order & { trackingNumber?: string }) {
  const to = order.buyerEmail
  if (!to) return
  const { subject, html } = deliveryInProcessEmail(order, SITE_URL)
  await send(to, subject, html)
}

export async function sendDelivered(order: Order) {
  const to = order.buyerEmail
  if (!to) return
  const { subject, html } = deliveredEmail(order, SITE_URL)
  await send(to, subject, html)
}
