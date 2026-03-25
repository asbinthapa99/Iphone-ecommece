import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: `By accessing or using Inexa Nepal's platform (inexanepal.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our service. These terms apply to all users — buyers, sellers, and visitors.`,
  },
  {
    title: 'Device Listings & Accuracy',
    body: `All devices listed on Inexa Nepal are physically inspected by our team before listing. We verify IMEI status, battery health, and physical condition. While we strive for accuracy, minor variations in condition grading are possible. Photos are representative — contact us for additional images before purchase.`,
  },
  {
    title: 'Buying — Order & Payment',
    body: `Orders are confirmed upon successful payment. Prices are in Nepali Rupees (NPR) and include the Inexa warranty. Payment must be completed via eSewa, Khalti, or Cash on Delivery (COD). COD is available in Kathmandu and Pokhara only. We reserve the right to cancel orders if a device is no longer available, in which case a full refund is issued within 24 hours.`,
  },
  {
    title: 'Warranty',
    body: `All devices come with a 6-month Inexa warranty covering hardware defects arising from normal use. Warranty does not cover: physical damage caused by the buyer, water/liquid damage, unauthorized repairs, theft, or loss. Extended warranty (+6 months) is available for NPR 1,500 at checkout.`,
  },
  {
    title: 'Returns & Refunds',
    body: `You may return a device within 3 days of delivery if it has an undisclosed defect. The device must be in original condition with all accessories. Contact us via WhatsApp within 3 days. Refunds are processed within 3–5 business days via the original payment method. Devices showing physical damage not present at delivery are not eligible for return.`,
  },
  {
    title: 'Selling / Trade-in',
    body: `Trade-in quotes are valid for 48 hours. Payment to sellers is made after physical inspection confirms the device matches the description provided. Inexa reserves the right to adjust the quoted price if the actual condition differs materially from what was described. Devices that are iCloud-locked, blacklisted, or have undisclosed damage will not be purchased.`,
  },
  {
    title: 'IMEI Checker Tool',
    body: `The IMEI checker is provided as a free public utility. Results are based on available NTA Nepal data and may not reflect real-time blacklist status. Inexa Nepal is not liable for decisions made solely based on IMEI checker results. For definitive verification, consult your carrier.`,
  },
  {
    title: 'Account Responsibilities',
    body: `You are responsible for maintaining the security of your account credentials. Do not share your password. Notify us immediately if you suspect unauthorized account access. You must provide accurate information when creating an account. Accounts found to be fraudulent will be terminated.`,
  },
  {
    title: 'Limitation of Liability',
    body: `Inexa Nepal's liability is limited to the purchase price of the device in question. We are not liable for indirect, incidental, or consequential damages. Our services are provided "as is" with no additional warranties beyond those explicitly stated.`,
  },
  {
    title: 'Governing Law',
    body: `These terms are governed by the laws of Nepal. Any disputes shall be resolved in the courts of Kathmandu. For informal dispute resolution, contact us at hello@inexanepal.com — we resolve most issues within 48 hours.`,
  },
]

export default function TermsPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ background: '#fafaf8', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Last updated: March 2025 · Inexa Nepal Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 32 }}>
          Please read these terms carefully before using Inexa Nepal. These terms govern your use of our
          marketplace, including buying, selling, and using our IMEI verification tool.
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
          <Link href="/privacy" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy →</Link>
          <Link href="/refund" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Refund Policy →</Link>
          <Link href="/contact" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Contact Us →</Link>
        </div>
      </div>
    </main>
  )
}
