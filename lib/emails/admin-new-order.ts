import { emailBase, statusBanner, orderRow, ctaButton } from './base'
import type { Order } from '@/types'

export function adminNewOrderEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const payLabel: Record<string, string> = {
    esewa: 'eSewa', khalti: 'Khalti', cod: 'Cash on Delivery',
    bank_transfer: 'Bank Transfer', qr: 'Scan & Pay (QR)',
  }

  const isQr = order.paymentMethod === 'qr'

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#92400e', '#fffbeb', '🔔', 'New Order Received', `A new order has been placed and is waiting for your review.`)}

    <!-- Order details -->
    <tr><td style="padding:20px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Order Number', `#${order.orderNumber}`)}
        ${orderRow('Customer', order.buyerName)}
        ${orderRow('Phone', order.buyerPhone)}
        ${orderRow('Device', `${order.device.model} ${order.device.storage} · Grade ${order.device.grade}`)}
        ${orderRow('Payment Method', payLabel[order.paymentMethod] ?? order.paymentMethod)}
        ${isQr && order.paymentRef ? orderRow('Transaction ID', order.paymentRef) : ''}
        ${orderRow('Delivery to', `${order.deliveryAddress}, ${order.city}`)}
        ${orderRow('Amount', `NPR ${order.amount.toLocaleString()}`, true)}
      </table>
    </td></tr>

    ${isQr ? `
    <tr><td style="padding:0 32px 20px;">
      <table width="100%" cellpadding="10" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;">
        <tr><td style="font-size:12px;color:#92400e;line-height:1.6;">
          ⚠️ <strong>QR Payment — manual verification required.</strong><br/>
          The customer has submitted transaction ID: <strong style="font-family:monospace;">${order.paymentRef ?? '—'}</strong><br/>
          Please verify in your eSewa/Khalti/bank dashboard, then mark the payment as paid in the admin panel.
        </td></tr>
      </table>
    </td></tr>` : ''}

    ${ctaButton('Review Order in Admin', `${siteUrl}/admin/orders/${order.id}`)}
  </table>`

  return {
    subject: `New Order #${order.orderNumber} — ${order.device.model} (${payLabel[order.paymentMethod] ?? order.paymentMethod})`,
    html: emailBase(content, `New order #${order.orderNumber} from ${order.buyerName}`),
  }
}
