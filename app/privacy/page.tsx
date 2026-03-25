import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: `We collect information you provide directly when you create an account, place an order, or contact us. This includes your name, email address, phone number, and delivery address. We also collect device information for IMEI verification and order records. We do not store payment credentials — all payment processing is handled by eSewa and Khalti.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We use your information to process orders, verify device IMEIs, send order confirmations via WhatsApp or email, provide customer support, and improve our service. We do not sell your personal information to third parties. We may send you notifications about new arrivals if you subscribe to our newsletter — you can unsubscribe at any time.`,
  },
  {
    title: 'IMEI Data',
    body: `IMEI numbers you enter through our checker tool are verified against the NTA Nepal database. We store IMEI records associated with devices listed for sale on our platform. We do not share individual IMEI data with third parties except where required by Nepali law enforcement.`,
  },
  {
    title: 'Data Security',
    body: `We use industry-standard encryption (HTTPS/TLS) for all data transmission. Our database is hosted on Supabase with row-level security policies. Passwords are never stored in plain text. We recommend using a strong, unique password for your Inexa account.`,
  },
  {
    title: 'Cookies',
    body: `We use essential cookies to keep you signed in and remember your cart. We do not use advertising trackers or third-party analytics cookies. You can accept or decline optional cookies via the banner shown on your first visit. Essential cookies (session, cart) cannot be disabled as the site requires them to function. You can clear all cookies at any time via your browser settings.`,
  },
  {
    title: 'Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time. To request data deletion, contact us at hello@inexanepal.com. We will process your request within 30 days. You may also update your name and phone number directly from your Account settings page.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the service after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact',
    body: `For privacy-related questions, email us at hello@inexanepal.com or WhatsApp us at +977 980-000-0000. Our physical address is New Baneshwor, Kathmandu, Nepal.`,
  },
]

export default function PrivacyPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: '#fafaf8', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Last updated: March 2025 · Inexa Nepal Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 32 }}>
          At Inexa Nepal, we take your privacy seriously. This policy explains what data we collect,
          why we collect it, and how we protect it. By using our platform, you agree to this policy.
        </p>

        <div className="flex flex-col gap-8">
          {SECTIONS.map(({ title, body }, i) => (
            <div key={title}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#060d0a', marginBottom: 8 }}>
                {i + 1}. {title}
              </h2>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75 }}>{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/terms" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Terms of Service →</Link>
          <Link href="/refund" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Refund Policy →</Link>
          <Link href="/contact" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Contact Us →</Link>
        </div>
      </div>
    </main>
  )
}
