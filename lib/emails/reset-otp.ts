import { emailBase } from './base'

export function resetOtpEmail(otp: string, email: string) {
  const content = `
  <table width="100%" cellpadding="0" cellspacing="0">
    <!-- Header -->
    <tr><td style="background:#f9f9f7;padding:28px 32px 24px;text-align:center;border-bottom:1px solid #f0f0ee;">
      <div style="font-size:36px;margin-bottom:12px;">🔐</div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#060d0a;letter-spacing:-0.5px;">Reset your password</h1>
      <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">Use the code below to reset your Inexa Nepal password.</p>
    </td></tr>

    <!-- OTP code -->
    <tr><td style="padding:32px;" align="center">
      <p style="margin:0 0 16px;font-size:13px;color:#888;">Your one-time password (valid for 10 minutes)</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          ${otp.split('').map(digit => `
            <td style="padding:0 5px;">
              <div style="width:48px;height:60px;background:#f4f4f0;border:2px solid #e0e0dc;border-radius:12px;text-align:center;line-height:60px;font-size:28px;font-weight:900;color:#060d0a;font-family:monospace;">
                ${digit}
              </div>
            </td>
          `).join('')}
        </tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#aaa;">Never share this code with anyone.</p>
    </td></tr>

    <!-- Security note -->
    <tr><td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="12" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;">
        <tr><td style="font-size:12px;color:#92400e;line-height:1.6;">
          ⚠️ &nbsp;If you didn't request a password reset, ignore this email. Your account is safe.
        </td></tr>
      </table>
    </td></tr>

    <!-- Footer -->
    <tr><td style="padding:16px 32px 24px;border-top:1px solid #f4f4f2;" align="center">
      <p style="margin:0;font-size:12px;color:#aaa;">This code expires in <strong>10 minutes</strong>. Request a new one if needed.</p>
    </td></tr>
  </table>`

  return {
    subject: `Your Inexa Nepal password reset code: ${otp}`,
    html: emailBase(content, `Your password reset code is ${otp}`),
  }
}
