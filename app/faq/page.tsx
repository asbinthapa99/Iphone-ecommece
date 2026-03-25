'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

const FAQS = [
  {
    category: 'Buying',
    items: [
      { q: 'What does Grade A, B, C mean?', a: 'Grade A means like-new condition — no visible scratches, battery above 85%, all functions perfect. Grade B has minor cosmetic wear but fully functional. Grade C is a budget option with visible wear, priced accordingly.' },
      { q: 'How is the IMEI verified?', a: 'We check every device against the NTA Nepal database to confirm it\'s not blacklisted, stolen, or iCloud locked. The IMEI result is shown on every listing page.' },
      { q: 'Is iCloud lock checked?', a: 'Yes, every phone is confirmed to be iCloud-free before listing. If a phone ever had an iCloud issue, it is not listed for sale.' },
      { q: 'Can I inspect the phone before buying?', a: 'Yes! Visit our store in New Baneshwor, Kathmandu. You can inspect any device in person. Call or WhatsApp to confirm availability before visiting.' },
      { q: 'What storage sizes are available?', a: 'Each listing shows the exact storage. We carry 32GB, 64GB, 128GB, 256GB, and 512GB variants depending on model availability.' },
    ],
  },
  {
    category: 'Delivery & Payment',
    items: [
      { q: 'Do you deliver outside Kathmandu?', a: 'Yes. We deliver to Pokhara, Chitwan, Biratnagar, and other major cities via courier (1–3 business days). COD is available in Kathmandu and Pokhara only.' },
      { q: 'What payment methods do you accept?', a: 'We accept eSewa, Khalti, and Cash on Delivery (COD). COD is available for Kathmandu and Pokhara. For other cities, digital payment is required before dispatch.' },
      { q: 'How long does delivery take?', a: 'Same-day delivery is available in Kathmandu valley (orders before 12pm). Pokhara: 1 day. Other cities: 2–3 business days.' },
      { q: 'Is the delivery free?', a: 'Free delivery within Kathmandu valley. Delivery charges apply for other cities and are shown at checkout.' },
    ],
  },
  {
    category: 'Warranty & Returns',
    items: [
      { q: 'What does the 6-month warranty cover?', a: 'The Inexa warranty covers hardware defects and issues that arise from normal use — screen faults, charging port issues, camera failures. It does NOT cover physical damage or water damage after purchase.' },
      { q: 'Can I return a phone?', a: 'Yes, within 3 days of delivery if the phone has a defect that wasn\'t disclosed. The phone must be in original condition. Contact us via WhatsApp within 3 days of receiving the device.' },
      { q: 'Can I extend the warranty?', a: 'Yes. During checkout you can add extended warranty (+6 months) for NPR 1,500.' },
      { q: 'What happens if my phone develops a fault?', a: 'Contact us on WhatsApp or visit our store. We will diagnose the issue and either repair or replace the device within the warranty period.' },
    ],
  },
  {
    category: 'Selling / Trade-in',
    items: [
      { q: 'Can I sell my iPhone to Inexa?', a: 'Yes! Use our Sell page to get an instant quote. The price is based on model, storage, battery health, and condition. If you accept, bring the phone to our store or arrange a pickup.' },
      { q: 'How is my phone\'s value calculated?', a: 'We start with the base resale value for your model, then adjust based on the condition you report (Excellent / Good / Fair) and battery health. The quote is instant and binding for 48 hours.' },
      { q: 'How do I get paid?', a: 'We pay via eSewa, Khalti, or bank transfer within 24 hours of device inspection and handover.' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #f0f0ee' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
        style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', gap: 12 }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#060d0a', lineHeight: 1.4 }}>{q}</span>
        {open ? <ChevronUp size={16} color="#888" className="shrink-0" /> : <ChevronDown size={16} color="#888" className="shrink-0" />}
      </button>
      {open && (
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7, paddingBottom: 14 }}>{a}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fafaf8', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14 text-center">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Help Center</p>
          <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 10 }}>Frequently Asked Questions</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Everything you need to know about buying, selling, and warranties.</p>
        </div>
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
        <div className="flex flex-col gap-10">
          {FAQS.map(({ category, items }) => (
            <div key={category}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{category}</p>
              <div className="rounded-[14px] px-1" style={{ border: '1px solid #ebebeb' }}>
                <div style={{ padding: '0 16px' }}>
                  {items.map(({ q, a }) => (
                    <FAQItem key={q} q={q} a={a} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 rounded-[16px] p-6 text-center" style={{ background: '#060d0a' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Still have questions?</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Our team replies within 1 hour on WhatsApp.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
              style={{ background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}>
              WhatsApp Us
            </a>
            <Link href="/contact"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, fontWeight: 500, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
