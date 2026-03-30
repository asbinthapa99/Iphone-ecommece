import { emailBase, statusBanner, orderRow, ctaButton, trustRow, qrCodeBlock, progressTracker } from './base'
import type { Order } from '@/types'

export function orderProcessingEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const orderUrl = `${siteUrl}/account/orders/${order.id}`

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#6d28d9', '#f5f3ff', '⚙️', 'Your Order is Being Prepared', `Hi ${order.buyerName.split(' ')[0]}! Your ${order.device.model} is now being inspected and prepared for delivery.`)}

    ${progressTracker('processing')}

    <!-- Device card -->
    <tr><td style="padding:20px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:14px;">
        <tr>
          <td style="padding:16px;vertical-align:middle;">
            <p style="margin:0 0 2px;font-size:15px;font-weight:800;color:#060d0a;">${order.device.model} ${order.device.storage}</p>
            <p style="margin:0;font-size:12px;color:#888;">Grade ${order.device.grade} · Order #${order.orderNumber}</p>
          </td>
          <td style="padding:16px;text-align:right;vertical-align:middle;">
            <p style="margin:0;font-size:16px;font-weight:800;color:#060d0a;">NPR ${order.amount.toLocaleString()}</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- What we're doing -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="12" cellspacing="0" style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#6d28d9;">Currently in progress</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;line-height:1.6;">🔍 &nbsp;Final quality inspection</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;line-height:1.6;">🔋 &nbsp;Battery health verification</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;line-height:1.6;">📱 &nbsp;Device cleaning & packaging</p>
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">📦 &nbsp;Preparing for dispatch</p>
        </td></tr>
      </table>
    </td></tr>

    ${qrCodeBlock(orderUrl)}
    ${ctaButton('Track Your Order', orderUrl)}
    ${trustRow()}
  </table>`

  return {
    subject: `Your Order is Being Prepared — #${order.orderNumber} | Inexa Nepal`,
    html: emailBase(content, `Your ${order.device.model} is being prepared for delivery`),
  }
}
