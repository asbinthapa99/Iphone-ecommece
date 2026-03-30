import { emailBase, statusBanner, ctaButton, qrCodeBlock, progressTracker } from './base'
import type { Order } from '@/types'

export function deliveredEmail(order: Order, siteUrl = 'https://inexanepal.com') {
  const orderUrl = `${siteUrl}/account/orders/${order.id}`

  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    ${statusBanner('#0F6E56', '#f0faf6', '🎊', 'Delivered Successfully!', `Your ${order.device.model} has been delivered. We hope you love it!`)}

    ${progressTracker('delivered')}

    <!-- Warranty reminder -->
    <tr><td style="padding:24px 32px 0;">
      <table width="100%" cellpadding="14" cellspacing="0" style="background:#f0faf6;border:1px solid #c8ead9;border-radius:14px;">
        <tr><td>
          <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#0F6E56;">🛡️ Your ${order.warrantyExtended ? '6-Month Extended' : '3-Month'} Warranty is Active</p>
          <p style="margin:0 0 10px;font-size:12px;color:#444;line-height:1.6;">
            Your warranty started today. If you experience any issue with the device, contact us immediately — we've got you covered.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:24px;font-size:12px;color:#444;">📅 &nbsp;Started: <strong>${new Date().toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></td>
              <td style="font-size:12px;color:#444;">📅 &nbsp;Expires: <strong>${new Date(Date.now() + (order.warrantyExtended ? 180 : 90) * 24 * 60 * 60 * 1000).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- Rate your experience -->
    <tr><td style="padding:24px 32px 0;" align="center">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#060d0a;">How was your experience?</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          ${['😞', '😐', '😊', '😃', '🤩'].map((emoji, i) => `
            <td style="padding:0 6px;">
              <a href="${siteUrl}/review/${order.id}?rating=${i + 1}" style="display:block;width:40px;height:40px;border-radius:50%;background:#f4f4f0;border:1px solid #e8e8e4;text-align:center;line-height:40px;font-size:20px;text-decoration:none;">${emoji}</a>
            </td>
          `).join('')}
        </tr>
      </table>
      <p style="margin:10px 0 0;font-size:11px;color:#aaa;">Tap to rate your experience</p>
    </td></tr>

    <!-- Device care tips -->
    <tr><td style="padding:20px 32px 0;">
      <table width="100%" cellpadding="10" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:12px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#333;">Quick setup tips for your ${order.device.model}</p>
          <p style="margin:0 0 4px;font-size:12px;color:#666;">⚡ &nbsp;Charge to 100% before first use</p>
          <p style="margin:0 0 4px;font-size:12px;color:#666;">🔒 &nbsp;Set up Face ID / Touch ID immediately</p>
          <p style="margin:0;font-size:12px;color:#666;">☁️ &nbsp;Sign in to iCloud to restore your apps</p>
        </td></tr>
      </table>
    </td></tr>

    <!-- Refer a friend -->
    <tr><td style="padding:20px 32px 8px;" align="center">
      <p style="margin:0 0 6px;font-size:13px;color:#888;">Know someone looking for a verified iPhone?</p>
      <a href="${siteUrl}/phones" style="font-size:13px;font-weight:700;color:#1D9E75;text-decoration:none;">Share Inexa Nepal →</a>
    </td></tr>

    ${qrCodeBlock(orderUrl, 'Scan for order & warranty details')}
    ${ctaButton('View Order & Warranty', orderUrl)}

    <!-- Footer trust row -->
    <tr><td style="padding:20px 32px;background:#f9f9f7;border-top:1px solid #f0f0ee;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;font-size:11px;color:#888;font-weight:600;">🛡️ Warranty Active</td>
          <td style="text-align:center;font-size:11px;color:#888;font-weight:600;">✅ IMEI Verified</td>
          <td style="text-align:center;font-size:11px;color:#888;font-weight:600;">💬 24/7 Support</td>
        </tr>
      </table>
    </td></tr>
  </table>`

  return {
    subject: `Delivered! Your ${order.device.model} has arrived 🎉 — #${order.orderNumber}`,
    html: emailBase(content, `Your order #${order.orderNumber} has been delivered!`),
  }
}
