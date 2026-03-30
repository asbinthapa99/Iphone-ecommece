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

/* ─── Social links (update with your real URLs) ─── */
const SOCIALS = {
  whatsapp: '+9779849407541',
  instagram: 'https://instagram.com/inexanepal',
  facebook: 'https://facebook.com/inexanepal',
  tiktok: 'https://tiktok.com/@inexanepal',
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
          ${socialRow()}
          <p style="margin:12px 0 6px;font-size:12px;color:#aaa;">You received this email because you placed an order on Inexa Nepal.</p>
          <p style="margin:0;font-size:12px;color:#aaa;">
            Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/${SOCIALS.whatsapp}" style="color:#1D9E75;text-decoration:none;font-weight:600;">${SOCIALS.whatsapp}</a>
          </p>
          <p style="margin:12px 0 0;font-size:11px;color:#ccc;">© ${new Date().getFullYear()} Inexa Nepal · Kathmandu, Nepal</p>
          <p style="margin:6px 0 0;"><a href="mailto:unsubscribe@inexanepal.com?subject=Unsubscribe" style="font-size:10px;color:#ccc;text-decoration:underline;">Unsubscribe from emails</a></p>
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
        ${['🛡️ Up to 6-mo Warranty', '✅ IMEI Verified', '🚚 Free KTM Delivery'].map(item => `
          <td style="text-align:center;font-size:11px;color:#888;font-weight:600;">${item}</td>
        `).join('')}
      </tr>
    </table>
  </td></tr>`
}

/**
 * QR code block — renders a scannable QR code linking to the order tracking page.
 * Uses the free goqr.me API (no account needed, works in all email clients).
 */
export function qrCodeBlock(orderUrl: string, label = 'Scan to track your order') {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(orderUrl)}&bgcolor=FAFAF8&color=060D0A&margin=8`
  return `
  <tr><td style="padding:0 32px 24px;" align="center">
    <table cellpadding="0" cellspacing="0" style="background:#fafaf8;border:1px solid #ebebeb;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:16px 24px 10px;" align="center">
        <img src="${qrSrc}" alt="Order QR Code" width="120" height="120" style="display:block;border-radius:8px;border:1px solid #ebebeb;" />
      </td></tr>
      <tr><td style="padding:0 24px 14px;" align="center">
        <p style="margin:0;font-size:11px;color:#888;font-weight:600;">${label}</p>
      </td></tr>
    </table>
  </td></tr>`
}

/**
 * Order progress tracker — visual stepper bar showing order status.
 */
export function progressTracker(
  currentStep: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered',
) {
  const steps = [
    { key: 'placed',     label: 'Order Placed' },
    { key: 'confirmed',  label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped',    label: 'Shipped' },
    { key: 'delivered',  label: 'Delivered' },
  ]

  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return `
  <tr><td style="padding:24px 32px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        ${steps.map((step, i, arr) => {
          const done = i <= currentIndex
          const active = i === currentIndex
          const dotColor = active ? '#1D9E75' : done ? '#1D9E75' : '#e0e0dc'
          const textColor = active ? '#0F6E56' : done ? '#1D9E75' : '#aaa'
          const fontWeight = active ? '700' : '500'
          const dotContent = done ? '✓' : `${i + 1}`

          return `
            <td style="text-align:center;vertical-align:top;position:relative;width:${100 / arr.length}%;">
              <div style="width:26px;height:26px;border-radius:50%;background:${dotColor};margin:0 auto 5px;text-align:center;line-height:26px;font-size:11px;color:white;font-weight:700;">${dotContent}</div>
              <p style="margin:0;font-size:9px;font-weight:${fontWeight};color:${textColor};line-height:1.3;">${step.label}</p>
              ${i < arr.length - 1 ? `<div style="position:absolute;top:13px;left:calc(50% + 13px);right:calc(-50% + 13px);height:2px;background:${done && i < currentIndex ? '#1D9E75' : '#e0e0dc'};"></div>` : ''}
            </td>`
        }).join('')}
      </tr>
    </table>
  </td></tr>`
}

/**
 * Social links row — Instagram, Facebook, TikTok, WhatsApp.
 * Uses text+emoji fallback since some email clients don't render image icons.
 */
function socialRow() {
  const links = [
    { emoji: '💬', label: 'WhatsApp', url: `https://wa.me/${SOCIALS.whatsapp}` },
    { emoji: '📸', label: 'Instagram', url: SOCIALS.instagram },
    { emoji: '📘', label: 'Facebook', url: SOCIALS.facebook },
    { emoji: '🎵', label: 'TikTok', url: SOCIALS.tiktok },
  ]

  return `
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr>
      ${links.map((link) => `
        <td style="padding:0 8px;">
          <a href="${link.url}" target="_blank" style="display:inline-block;padding:6px 12px;border-radius:8px;background:#f4f4f0;text-decoration:none;font-size:11px;color:#666;font-weight:600;">
            ${link.emoji}&nbsp;${link.label}
          </a>
        </td>
      `).join('')}
    </tr>
  </table>`
}
