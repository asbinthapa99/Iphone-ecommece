import { emailBase, statusBanner, orderRow, ctaButton, trustRow, qrCodeBlock, progressTracker } from './base'
import type { Order } from '@/types'

export function deliveryInProcessEmail(order: Order & { trackingNumber?: string }, siteUrl = 'https://inexanepal.com') {
  const orderUrl = `${siteUrl}/account/orders/${order.id}`

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#1a5fb4', '#eff6ff', '🚚', 'Your Order is On Its Way!', `Great news ${order.buyerName.split(' ')[0]}! Your ${order.device.model} has been dispatched and is heading to you.`)}

    ${progressTracker('shipped')}

    <!-- Delivery info -->
    <tr><td style="padding:24px 32px 0;">
      <table width="100%" cellpadding="12" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1a5fb4;">Delivery Information</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;">📍 &nbsp;<strong>Delivering to:</strong> ${order.deliveryAddress}, ${order.city}</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;">📲 &nbsp;Our delivery agent will call before arrival.</p>
          ${order.trackingNumber ? `<p style="margin:4px 0 0;font-size:12px;color:#444;">🔍 &nbsp;<strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
        </td></tr>
      </table>
    </td></tr>

    <!-- Order summary -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Device', `${order.device.model} ${order.device.storage}`)}
        ${orderRow('Order Number', `#${order.orderNumber}`)}
        ${orderRow('Payment Method', order.paymentMethod === 'cod' ? '💵 Cash on Delivery — have cash ready' : '✅ Pre-paid', true)}
      </table>
    </td></tr>

    ${order.paymentMethod === 'cod' ? `
    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="10" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
        <tr><td style="font-size:12px;color:#92400e;line-height:1.6;">
          💵 <strong>Reminder:</strong> Please have <strong>NPR ${order.amount.toLocaleString()}</strong> in cash ready for the delivery agent.
        </td></tr>
      </table>
    </td></tr>` : ''}

    ${qrCodeBlock(orderUrl)}
    ${ctaButton('Track Order', orderUrl)}
    ${trustRow()}
  </table>`

  return {
    subject: `Your ${order.device.model} is on its way! — #${order.orderNumber}`,
    html: emailBase(content, `Your order #${order.orderNumber} has been dispatched!`),
  }
}
