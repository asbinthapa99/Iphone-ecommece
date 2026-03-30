import { emailBase, statusBanner, orderRow, ctaButton, trustRow, qrCodeBlock, progressTracker } from './base'
import type { Order } from '@/types'

export function orderPlacedEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const payLabel: Record<string, string> = {
    esewa: 'eSewa', khalti: 'Khalti', cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer', qr: 'Scan & Pay (QR)',
  }

  const orderUrl = `${siteUrl}/account/orders/${order.id}`

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#92400e', '#fffbeb', '📦', 'Order Received!', `Thanks ${order.buyerName.split(' ')[0]}! We've received your order and it's being reviewed by our team.`)}

    ${progressTracker('placed')}

    <!-- Device card -->
    <tr><td style="padding:20px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:14px;overflow:hidden;">
        <tr>
          <td style="padding:16px;vertical-align:middle;">
            <p style="margin:0 0 2px;font-size:15px;font-weight:800;color:#060d0a;">${order.device.model} ${order.device.storage}</p>
            <p style="margin:0;font-size:12px;color:#888;">Grade ${order.device.grade} · ${order.warrantyExtended ? '6-month extended' : '3-month'} warranty</p>
          </td>
          <td style="padding:16px;text-align:right;vertical-align:middle;">
            <p style="margin:0;font-size:16px;font-weight:800;color:#060d0a;">NPR ${order.device.price.toLocaleString()}</p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- Order details -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Order Number', `#${order.orderNumber}`)}
        ${orderRow('Payment Method', payLabel[order.paymentMethod] ?? order.paymentMethod)}
        ${orderRow('Delivery to', `${order.deliveryAddress}, ${order.city}`)}
        ${order.warrantyExtended ? orderRow('Extended Warranty', '+NPR 1,500') : ''}
        ${orderRow('Total Amount', `NPR ${order.amount.toLocaleString()}`, true)}
      </table>
    </td></tr>

    <!-- What happens next -->
    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="12" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#92400e;">What happens next?</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;line-height:1.6;">1️⃣ &nbsp;Our team will review and confirm your order</p>
          <p style="margin:0 0 4px;font-size:12px;color:#444;line-height:1.6;">2️⃣ &nbsp;You'll receive a confirmation email once approved</p>
          <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">3️⃣ &nbsp;Your device will be prepared and dispatched</p>
        </td></tr>
      </table>
    </td></tr>

    ${qrCodeBlock(orderUrl)}
    ${ctaButton('Track Your Order', orderUrl)}
    ${trustRow()}
  </table>`

  return {
    subject: `Order Received — #${order.orderNumber} | Inexa Nepal`,
    html: emailBase(content, `We've received your order #${order.orderNumber}!`),
  }
}
