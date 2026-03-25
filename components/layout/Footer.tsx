import Link from 'next/link'

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.88a8.22 8.22 0 0 0 4.82 1.55V7A4.85 4.85 0 0 1 19.59 6.69z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.41 18.627 0 12 0S0 5.41 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

const SOCIAL = [
  { label: 'TikTok', href: 'https://tiktok.com/@inexanepal', icon: TikTokIcon },
  { label: 'Instagram', href: 'https://instagram.com/inexanepal', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com/inexanepal', icon: FacebookIcon },
  { label: 'WhatsApp', href: 'https://wa.me/9779800000000', icon: WhatsAppIcon },
]

const LINKS = {
  Shop: [
    { label: 'Browse iPhones', href: '/phones' },
    { label: 'iPhone 15', href: '/phones?model=iPhone+15' },
    { label: 'iPhone 14', href: '/phones?model=iPhone+14' },
    { label: 'iPhone 13', href: '/phones?model=iPhone+13' },
    { label: 'Grade A Phones', href: '/phones?grade=A' },
  ],
  Services: [
    { label: 'Sell Your iPhone', href: '/sell' },
    { label: 'IMEI Check', href: '/imei' },
    { label: 'FAQ', href: '/faq' },
    { label: 'How it works', href: '/#how' },
  ],
  Company: [
    { label: 'About Inexa', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
}

export function Footer() {
  return (
    <footer className="hidden md:block" style={{ background: '#060d0a', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 32, marginBottom: 48 }}>

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: '#1D9E75' }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>Ix</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                Inexa Nepal
              </span>
            </div>

            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
              Nepal&apos;s first verified second-hand iPhone marketplace. Every phone inspected. Every price honest.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="footer-social flex items-center justify-center rounded-full"
                  style={{
                    width: 34,
                    height: 34,
                    background: 'rgba(255,255,255,0.08)',
                    color: '#aaa',
                    textDecoration: 'none',
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#555',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                }}
              >
                {category}
              </p>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {items.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="footer-link"
                    style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p style={{ fontSize: 12, color: '#555' }}>
            © 2024 Inexa Nepal Pvt. Ltd. · Kathmandu, Nepal · All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Refund Policy', href: '/refund' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  fontSize: 11,
                  color: '#555',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                className="footer-link"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
