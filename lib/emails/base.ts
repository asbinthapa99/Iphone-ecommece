// Shared email base — inline CSS only (email clients strip <style> tags)

export const BRAND = {
  dark: '#060d0a',
  green: '#1D9E75',
  greenLight: '#E1F5EE',
  greenDark: '#0F6E56',
  border: '#e8e8e4',
  muted: '#888888',
  bg: '#f4f4f0',
}

export function emailBase(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${previewText}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f2eeef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;color:#f2eeef;">${previewText}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2eeef;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Logo header -->
        <tr><td style="padding-bottom:24px;" align="center">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#060d0a;border-radius:12px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                <span style="font-size:17px;font-weight:900;color:#1D9E75;letter-spacing:-0.5px;">Ix</span>
              </td>
              <td style="padding-left:10px;">
                <span style="font-size:20px;font-weight:800;color:#060d0a;letter-spacing:-0.5px;">Inexa Nepal</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:24px;border:1px solid #e8e8e4;overflow:hidden;box-shadow:0 10px 28px rgba(20,20,20,0.07);">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 8px 8px;" align="center">
          <p style="margin:0 0 8px;font-size:12px;color:#aaa;">You received this email because you placed an order on Inexa Nepal.</p>
          <p style="margin:0;font-size:12px;color:#aaa;">
            Questions? Reply to this email or WhatsApp us at <span style="color:#1D9E75;">+977 98XXXXXXXX</span>
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#ccc;">© ${new Date().getFullYear()} Inexa Nepal · Kathmandu, Nepal</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function statusBanner(color: string, bg: string, icon: string, title: string, sub: string) {
  return `
  <tr><td style="padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:32px 24px 30px;background:#060d0a;background-image:linear-gradient(135deg,#231018 0%,#6f1d3f 55%,#bc3c63 100%);">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
          <tr>
            <td style="padding:6px 14px;border-radius:999px;background:rgba(255,255,255,0.18);font-size:11px;color:#fff;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
              Official Communication
            </td>
          </tr>
        </table>
        <p style="margin:0 0 6px;font-size:40px;line-height:1;font-weight:800;color:#ffffff;letter-spacing:-0.8px;">Inexa Nepal</p>
        <p style="margin:0;font-size:14px;color:#f5e7ee;line-height:1.5;">Verified Pre-owned Devices · Kathmandu, Nepal</p>
      </td></tr>

      <tr><td align="center" style="padding:24px 32px;background:${bg};border-top:1px solid rgba(255,255,255,0.12);border-bottom:1px solid #f0f0ee;">
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
          <tr>
            <td style="padding:8px 18px;border-radius:999px;background:#fff;border:1px solid ${color}35;font-size:13px;color:${color};font-weight:700;letter-spacing:0.01em;">
              ${icon}&nbsp;${title}
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.7;font-weight:500;">${sub}</p>
      </td></tr>
    </table>
  </td></tr>`
}

export function orderRow(label: string, value: string, last = false) {
  return `
  <tr>
    <td style="padding:10px 0;font-size:13px;color:#888;${last ? '' : 'border-bottom:1px solid #f4f4f2;'}">${label}</td>
    <td style="padding:10px 0;font-size:13px;font-weight:700;color:#060d0a;text-align:right;${last ? '' : 'border-bottom:1px solid #f4f4f2;'}">${value}</td>
  </tr>`
}

export function ctaButton(text: string, url: string) {
  return `
  <tr><td style="padding:0 32px 28px;" align="center">
    <a href="${url}" style="display:inline-block;background:#060d0a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:-0.2px;">
      ${text} →
    </a>
  </td></tr>`
}

export function trustRow() {
  return `
  <tr><td style="padding:20px 32px;background:#f9f9f7;border-top:1px solid #f0f0ee;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        ${['🛡️ 3-mo Warranty', '✅ IMEI Verified', '🚚 Free KTM Delivery'].map(item => `
          <td style="text-align:center;font-size:11px;color:#888;font-weight:600;">${item}</td>
        `).join('')}
      </tr>
    </table>
  </td></tr>`
}
