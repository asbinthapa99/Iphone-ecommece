import { emailBase, ctaButton, trustRow } from './base'

export function welcomeEmail(name: string | null | undefined, siteUrl = 'https://inexanepal.com') {
  const firstName = (name ?? '').trim().split(' ')[0] || 'there'

  const content = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#f9f9f7;padding:28px 32px 24px;text-align:center;border-bottom:1px solid #f0f0ee;">
          <div style="font-size:36px;margin-bottom:12px;">🎉</div>
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#060d0a;letter-spacing:-0.5px;">
            Welcome to Inexa Nepal
          </h1>
          <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">
            Hi ${firstName}, your account is ready. You can now track orders, warranty, and reviews.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding:28px 32px 6px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:14px;">
            <tr>
              <td style="padding:16px 18px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:800;color:#060d0a;">What you can do now</p>
                <p style="margin:0 0 6px;font-size:13px;color:#555;">• Browse verified iPhones and gadgets</p>
                <p style="margin:0 0 6px;font-size:13px;color:#555;">• Place orders with COD, eSewa, or Khalti</p>
                <p style="margin:0;font-size:13px;color:#555;">• Track your order and warranty from your account</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      ${ctaButton('Go to My Account', `${siteUrl}/account`)}
      ${trustRow()}
    </table>
  `

  return {
    subject: 'Welcome to Inexa Nepal 🎉',
    html: emailBase(content, 'Your Inexa Nepal account is ready.'),
  }
}
