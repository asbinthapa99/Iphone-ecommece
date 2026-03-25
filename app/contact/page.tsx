'use client'

import { useState } from 'react'
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

const CONTACT_INFO = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+977 980-000-0000', href: 'https://wa.me/9779800000000', cta: 'Chat now' },
  { icon: Mail, label: 'Email', value: 'hello@inexanepal.com', href: 'mailto:hello@inexanepal.com', cta: 'Send email' },
  { icon: MapPin, label: 'Store', value: 'New Baneshwor, Kathmandu', href: '#', cta: 'Get directions' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat · 10am–7pm NPT', href: null, cta: null },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #ebebeb', background: '#fafaf8' }}>
        <div className="max-w-4xl mx-auto px-5 py-10 sm:py-14 text-center">
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Get in Touch</p>
          <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 10 }}>We&apos;re here to help</h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>Questions about a phone, warranty, IMEI, or delivery? Reach us any way you like.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10 sm:py-14">
        <div className="grid sm:grid-cols-2 gap-8">

          {/* Contact cards */}
          <div className="flex flex-col gap-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href, cta }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-[14px]" style={{ border: '1px solid #ebebeb', background: '#fafaf8' }}>
                <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 42, height: 42, background: '#E1F5EE' }}>
                  <Icon size={18} color="#0F6E56" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#060d0a', marginTop: 2 }}>{value}</p>
                </div>
                {href && cta && (
                  <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {cta} →
                  </a>
                )}
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/9779800000000?text=Hi%2C%20I%20have%20a%20question%20about%20Inexa%20Nepal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-[12px] py-3"
              style={{ background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <div className="rounded-[16px] p-5 sm:p-6" style={{ border: '1px solid #ebebeb' }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
                <CheckCircle2 size={40} color="#1D9E75" />
                <p style={{ fontSize: 18, fontWeight: 700, color: '#060d0a' }}>Message sent!</p>
                <p style={{ fontSize: 13, color: '#888' }}>We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p style={{ fontSize: 16, fontWeight: 700, color: '#060d0a', marginBottom: 4 }}>Send a message</p>
                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Aarav Sharma' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@email.com' },
                  { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Question about iPhone 14 Pro' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e0e0dc', fontSize: 14, color: '#060d0a', outline: 'none', background: '#fff' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e0e0dc', fontSize: 14, color: '#060d0a', outline: 'none', background: '#fff', resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2"
                  style={{ padding: '12px', borderRadius: 12, background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
