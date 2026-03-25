'use client'

import { useState } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'

export function NewsletterBanner() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
  }

  return (
    <section style={{ borderTop: '1px solid #ebebeb', background: '#fafaf8' }}>
      <div className="max-w-2xl mx-auto px-5 py-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: '#E1F5EE' }}>
            <Bell size={20} color="#0F6E56" />
          </div>
        </div>
        <h2 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.5px', marginBottom: 8 }}>
          New iPhones drop every week
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>
          Be first to know when a new Grade A device hits the store. No spam, unsubscribe any time.
        </p>

        {done ? (
          <div className="flex items-center justify-center gap-2" style={{ color: '#0F6E56' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>You&apos;re subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid #e0e0dc',
                fontSize: 14,
                color: '#060d0a',
                outline: 'none',
                background: '#fff',
              }}
            />
            <button
              type="submit"
              style={{ padding: '11px 18px', borderRadius: 10, background: '#060d0a', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Notify me
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
