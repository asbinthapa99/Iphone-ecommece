import nodemailer from 'nodemailer'
import type { Order } from '@/types'
import { orderConfirmedEmail } from './emails/order-confirmed'
import { paymentSuccessEmail } from './emails/payment-success'
import { deliveryInProcessEmail } from './emails/delivery-in-process'
import { deliveredEmail } from './emails/delivered'

const SITE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_FROM_EMAIL,
      pass: process.env.BREVO_SMTP_KEY,
    },
  })
}

async function send(to: string, subject: string, html: string) {
  if (!process.env.BREVO_SMTP_KEY) {
    console.log(`[email] To: ${to} | Subject: ${subject}`)
    return
  }
  try {
    const transporter = createTransport()
    await transporter.sendMail({
      from: `"${process.env.BREVO_FROM_NAME ?? 'Inexa Nepal'}" <${process.env.BREVO_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
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
