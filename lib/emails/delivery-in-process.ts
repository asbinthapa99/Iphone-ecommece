import { emailBase, statusBanner, orderRow, ctaButton, trustRow } from './base'
import type { Order } from '@/types'

export function deliveryInProcessEmail(order: Order & { trackingNumber?: string }, siteUrl = 'https://inexanepal.com') {
  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#1a5fb4', '#eff6ff', '🚚', 'Your Order is On Its Way!', `Great news ${order.buyerName.split(' ')[0]}! Your ${order.device.model} has been dispatched and is heading to you.`)}

    <!-- Progress tracker -->
    <tr><td style="padding:28px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${[
            { label: 'Order Placed', done: true },
            { label: 'Payment Confirmed', done: true },
            { label: 'Out for Delivery', done: true, active: true },
            { label: 'Delivered', done: false },
          ].map((step, i, arr) => `
            <td style="text-align:center;vertical-align:top;position:relative;">
              <div style="width:28px;height:28px;border-radius:50%;background:${step.active ? '#1a5fb4' : step.done ? '#1D9E75' : '#e0e0dc'};margin:0 auto 6px;display:flex;align-items:center;justify-content:center;font-size:12px;color:white;font-weight:700;">
                ${step.done && !step.active ? '✓' : step.active ? '▶' : '○'}
              </div>
              <p style="margin:0;font-size:10px;font-weight:${step.active ? '700' : '500'};color:${step.active ? '#1a5fb4' : step.done ? '#1D9E75' : '#aaa'};line-height:1.3;">${step.label}</p>
              ${i < arr.length - 1 ? `<div style="position:absolute;top:14px;left:calc(50% + 14px);right:calc(-50% + 14px);height:2px;background:${step.done ? '#1D9E75' : '#e0e0dc'};"></div>` : ''}
            </td>
          `).join('')}
        </tr>
      </table>
    </td></tr>

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

    ${ctaButton('Track Order', `${siteUrl}/account/orders/${order.id}`)}
    ${trustRow()}
  </table>`

  return {
    subject: `Your ${order.device.model} is on its way! — #${order.orderNumber}`,
    html: emailBase(content, `Your order #${order.orderNumber} has been dispatched!`),
  }
}
