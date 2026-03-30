import { emailBase, statusBanner, orderRow, ctaButton, trustRow, qrCodeBlock, progressTracker } from './base'
import type { Order } from '@/types'

export function paymentSuccessEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const payLabel: Record<string, string> = {
    esewa: 'eSewa', khalti: 'Khalti', cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer',
  }

  const orderUrl = `${siteUrl}/account/orders/${order.id}`

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#0F6E56', '#f0faf6', '✅', 'Payment Received!', `We've confirmed your payment of NPR ${order.amount.toLocaleString()} for your ${order.device.model}.`)}

    ${progressTracker('confirmed')}

    <!-- Payment confirmation badge -->
    <tr><td style="padding:20px 32px 0;" align="center">
      <table cellpadding="0" cellspacing="0" style="background:#E1F5EE;border-radius:100px;padding:8px 20px;">
        <tr>
          <td style="font-size:12px;font-weight:700;color:#0F6E56;letter-spacing:0.03em;">
            🔐 &nbsp; PAYMENT VERIFIED &nbsp;·&nbsp; ${payLabel[order.paymentMethod] ?? order.paymentMethod.toUpperCase()}
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Device card -->
    <tr><td style="padding:20px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:14px;">
        <tr>
          <td style="padding:16px;vertical-align:middle;">
            <p style="margin:0 0 2px;font-size:15px;font-weight:800;color:#060d0a;">${order.device.model} ${order.device.storage}</p>
            <p style="margin:0;font-size:12px;color:#888;">Grade ${order.device.grade} · Order #${order.orderNumber}</p>
          </td>
          <td style="padding:16px;text-align:right;vertical-align:middle;">
            <p style="margin:0 0 2px;font-size:16px;font-weight:800;color:#0F6E56;">NPR ${order.amount.toLocaleString()}</p>
            <p style="margin:0;font-size:11px;color:#1D9E75;font-weight:600;">PAID</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Transaction details -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Order Number', `#${order.orderNumber}`)}
        ${orderRow('Payment Method', payLabel[order.paymentMethod] ?? order.paymentMethod)}
        ${orderRow('Amount Paid', `NPR ${order.amount.toLocaleString()}`)}
        ${orderRow('Payment Status', '✅ Confirmed', true)}
      </table>
    </td></tr>

    <!-- What's next -->
    <tr><td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="12" cellspacing="0" style="background:#f4faf7;border:1px solid #c8ead9;border-radius:12px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0F6E56;">What happens next?</p>
          <p style="margin:0 0 6px;font-size:12px;color:#444;line-height:1.6;">📦 &nbsp;Your device is being prepared for dispatch.</p>
          <p style="margin:0 0 6px;font-size:12px;color:#444;line-height:1.6;">📲 &nbsp;You'll get a call to confirm delivery time.</p>
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">🚚 &nbsp;Expected delivery: <strong>within 24 hours in KTM</strong>.</p>
        </td></tr>
      </table>
    </td></tr>

    ${qrCodeBlock(orderUrl)}
    ${ctaButton('View Order Details', orderUrl)}
    ${trustRow()}
  </table>`

  return {
    subject: `Payment Confirmed — NPR ${order.amount.toLocaleString()} | Inexa Nepal`,
    html: emailBase(content, `Payment of NPR ${order.amount.toLocaleString()} confirmed for order #${order.orderNumber}`),
  }
}
