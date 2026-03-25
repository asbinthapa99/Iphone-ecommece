'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

const COOKIE_KEY = 'inexa_cookie_consent'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY)
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = (choice: 'accepted' | 'declined') => {
    setCookie(COOKIE_KEY, choice, COOKIE_MAX_AGE)
    setLeaving(true)
    setTimeout(() => setVisible(false), 350)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center px-4 pb-4 md:pb-6 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
    >
      <div
        className="pointer-events-auto w-full max-w-2xl rounded-[18px] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          background: '#060d0a',
          boxShadow: '0 8px 40px rgba(0,0,0,0.28)',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: leaving ? 0 : 1,
          transform: leaving ? 'translateY(16px)' : 'translateY(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {/* Icon + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="shrink-0 flex items-center justify-center rounded-[10px] mt-0.5"
            style={{ width: 34, height: 34, background: 'rgba(29,158,117,0.18)' }}
          >
            <Cookie size={16} color="#1D9E75" />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
              We use cookies
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              We use essential cookies to keep you signed in and remember your cart.{' '}
              <Link
                href="/privacy"
                style={{ color: '#1D9E75', textDecoration: 'underline', textUnderlineOffset: 2 }}
              >
                Privacy policy
              </Link>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dismiss('declined')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px]"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Decline
          </button>
          <button
            onClick={() => dismiss('accepted')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px]"
            style={{
              background: '#1D9E75',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Accept all
          </button>
          <button
            onClick={() => dismiss('declined')}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
