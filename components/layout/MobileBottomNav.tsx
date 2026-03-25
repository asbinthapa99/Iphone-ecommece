'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ScanLine, Plus, User, Laptop } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useCallback, useEffect } from 'react'
import { haptic } from '@/lib/haptic'

const TABS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/phones', icon: Search, label: 'Phones' },
  { href: '/gadgets', icon: Laptop, label: 'Gadgets' },
  { href: '/imei', icon: ScanLine, label: 'IMEI' },
  { href: '/sell', icon: Plus, label: 'Sell' },
  { href: '/account', icon: User, label: 'Account' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [tappedTab, setTappedTab] = useState<string | null>(null)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  // Generic keyboard detection via visualViewport — works on any page/input
  // No hardcoding needed: when keyboard opens, viewport height shrinks significantly
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const THRESHOLD = 0.75 // keyboard is open when viewport is < 75% of screen height

    const onResize = () => {
      const ratio = vv.height / window.screen.height
      setKeyboardOpen(ratio < THRESHOLD)
    }

    vv.addEventListener('resize', onResize)
    return () => vv.removeEventListener('resize', onResize)
  }, [])

  const handleTap = useCallback((href: string) => {
    setTappedTab(href)
    setTimeout(() => setTappedTab(null), 180)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'saturate(200%) blur(32px)',
        WebkitBackdropFilter: 'saturate(200%) blur(32px)',
        borderTop: '0.5px solid rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft:   'env(safe-area-inset-left,  0px)',
        paddingRight:  'env(safe-area-inset-right, 0px)',
        transform: keyboardOpen
          ? 'translateY(120%)' // slide off-screen when keyboard is open
          : 'translateZ(0)',
        transition: 'transform 0.22s cubic-bezier(0.32,0,0.67,0)',
        willChange: 'transform',
      }}
    >
      <div className="flex items-center" style={{ height: 62 }}>
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          const isAccount = href === '/account'
          const dest = isAccount && !user ? '/login' : href
          const isTapped = tappedTab === href

          return (
            <Link
              key={href}
              href={dest}
              onClick={() => handleTap(href)}
              className="flex flex-col items-center justify-center flex-1 relative h-full"
              style={{ textDecoration: 'none', gap: 3, WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active indicator dot */}
              {active && (
                <span style={{
                  position: 'absolute',
                  top: 6,
                  width: 4, height: 4, borderRadius: '50%',
                  background: '#1D9E75',
                }} />
              )}

              {/* Icon with tap spring */}
              <div style={{
                position: 'relative',
                transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                transform: isTapped ? 'scale(0.78)' : active ? 'scale(1.08)' : 'scale(1)',
                marginTop: 4,
              }}>
                <Icon
                  size={22}
                  strokeWidth={active ? 2.3 : 1.5}
                  color={active ? '#1D9E75' : '#aaa'}
                />
                {isAccount && user && (
                  <span style={{
                    position: 'absolute', top: -1, right: -3,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#1D9E75', border: '1.5px solid #fff',
                  }} />
                )}
              </div>

              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 400,
                letterSpacing: '0.01em',
                color: active ? '#1D9E75' : '#aaa',
                transition: 'color 0.15s ease, font-weight 0.15s ease',
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
