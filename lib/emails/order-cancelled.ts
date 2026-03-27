import { emailBase, statusBanner, orderRow, ctaButton, trustRow } from './base'
import type { Order } from '@/types'

export function orderCancelledEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#dc2626', '#fff5f5', '❌', 'Order Cancelled', `Hi ${order.buyerName.split(' ')[0]}, your order #${order.orderNumber} has been cancelled.`)}

    <!-- Order details -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Order Number', `#${order.orderNumber}`)}
        ${orderRow('Device', `${order.device.model} ${order.device.storage}`)}
        ${orderRow('Amount', `NPR ${order.amount.toLocaleString()}`, true)}
      </table>
    </td></tr>

    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="10" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
        <tr><td style="font-size:12px;color:#666;line-height:1.7;">
          If a payment was made, a refund will be processed within 3–5 business days.<br/>
          Questions? Reply to this email or WhatsApp us — we're happy to help.
        </td></tr>
      </table>
    </td></tr>

    ${ctaButton('Browse Other Phones', `${siteUrl}/phones`)}
    ${trustRow()}
  </table>`

  return {
    subject: `Order Cancelled — #${order.orderNumber} | Inexa Nepal`,
    html: emailBase(content, `Your order #${order.orderNumber} has been cancelled`),
  }
}
