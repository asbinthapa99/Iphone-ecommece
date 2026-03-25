import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, MessageCircle } from 'lucide-react'

const ELIGIBLE = [
  'Undisclosed hardware defect (screen, camera, charging port, etc.)',
  'Device arrives physically damaged in transit',
  'Wrong model or storage delivered',
  'IMEI does not match the listing',
  'iCloud lock present (not disclosed in listing)',
]

const NOT_ELIGIBLE = [
  'Physical damage caused by the buyer after delivery',
  'Water or liquid damage after delivery',
  'Change of mind after unboxing',
  'Beyond 3 days from delivery date',
  'Device modified or repaired by a third party',
]

const STEPS = [
  { step: '01', title: 'Contact us within 3 days', desc: 'WhatsApp or email us with your order number and photos of the issue.' },
  { step: '02', title: 'We review your claim', desc: 'Our team reviews within 24 hours and approves eligible returns.' },
  { step: '03', title: 'Return the device', desc: 'Drop off at our store or we arrange a pickup in Kathmandu.' },
  { step: '04', title: 'Refund processed', desc: 'Refund issued to your original payment method within 3–5 business days.' },
]

export default function RefundPage() {
  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fafaf8', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 8 }}>Refund & Return Policy</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Last updated: March 2025 · 3-day return window</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10 sm:py-14">

        {/* Summary banner */}
        <div className="rounded-[14px] p-5 mb-10 flex gap-3" style={{ background: '#E1F5EE', border: '1px solid #b6e4d0' }}>
          <Clock size={18} color="#0F6E56" className="shrink-0 mt-0.5" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0F6E56', marginBottom: 4 }}>3-day return window</p>
            <p style={{ fontSize: 13, color: '#2d7a5f', lineHeight: 1.6 }}>
              All eligible returns must be initiated within 3 calendar days of delivery.
              Refunds are processed within 3–5 business days via your original payment method.
            </p>
          </div>
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="rounded-[14px] p-5" style={{ border: '1px solid #ebebeb' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>✅ Eligible for return</p>
            <div className="flex flex-col gap-2.5">
              {ELIGIBLE.map((item) => (
                <div key={item} className="flex gap-2">
                  <CheckCircle2 size={14} color="#1D9E75" className="shrink-0 mt-0.5" />
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[14px] p-5" style={{ border: '1px solid #ebebeb' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>❌ Not eligible for return</p>
            <div className="flex flex-col gap-2.5">
              {NOT_ELIGIBLE.map((item) => (
                <div key={item} className="flex gap-2">
                  <XCircle size={14} color="#ef4444" className="shrink-0 mt-0.5" />
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.4px', marginBottom: 16 }}>How to Return</h2>
        <div className="flex flex-col gap-4 mb-10">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 p-4 rounded-[12px]" style={{ border: '1px solid #ebebeb' }}>
              <div className="flex items-center justify-center rounded-[8px] shrink-0" style={{ width: 36, height: 36, background: '#060d0a' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1D9E75' }}>{step}</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 13, color: '#777', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Warranty note */}
        <div className="rounded-[14px] p-5 mb-10" style={{ background: '#fafaf8', border: '1px solid #ebebeb' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 6 }}>Warranty vs Return</p>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>
            The 3-day return window covers issues present at the time of delivery.
            For issues that arise after 3 days, your <strong>6-month Inexa warranty</strong> applies —
            we will repair or replace the device at no charge for covered defects.
            Extended warranty (+6 months) can be added at checkout for NPR 1,500.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-[14px] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ background: '#060d0a' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Need to start a return?</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Contact us within 3 days of delivery.</p>
          </div>
          <a
            href="https://wa.me/9779800000000?text=Hi%2C%20I%20need%20to%20return%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 shrink-0"
            style={{ background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 700, padding: '10px 18px', borderRadius: 10, textDecoration: 'none' }}
          >
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/terms" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Terms of Service →</Link>
          <Link href="/privacy" style={{ fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy →</Link>
        </div>
      </div>
    </main>
  )
}
