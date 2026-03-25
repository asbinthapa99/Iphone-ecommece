import { emailBase, statusBanner, orderRow, ctaButton, trustRow } from './base'
import type { Order } from '@/types'

export function orderConfirmedEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const payLabel: Record<string, string> = {
    esewa: 'eSewa', khalti: 'Khalti', cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer',
  }

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#0F6E56', '#f0faf6', '🎉', 'Order Confirmed!', `Thanks ${order.buyerName.split(' ')[0]}! We've received your order and our team will prepare it right away.`)}

    <!-- Device card -->
    <tr><td style="padding:24px 32px 0;">
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

    <!-- COD note -->
    ${order.paymentMethod === 'cod' ? `
    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="8" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
        <tr><td style="font-size:12px;color:#92400e;line-height:1.6;">
          💵 <strong>Cash on Delivery:</strong> Please keep NPR ${order.amount.toLocaleString()} ready at the time of delivery.
        </td></tr>
      </table>
    </td></tr>` : ''}

    ${ctaButton('Track Your Order', `${siteUrl}/account/orders/${order.id}`)}
    ${trustRow()}
  </table>`

  return {
    subject: `Order Confirmed — #${order.orderNumber} | Inexa Nepal`,
    html: emailBase(content, `Your order #${order.orderNumber} is confirmed!`),
  }
}
