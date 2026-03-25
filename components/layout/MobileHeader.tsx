'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

// Page titles for inner routes
const PAGE_TITLES: Record<string, string> = {
  '/phones':           'All iPhones',
  '/gadgets':          'Shop Gadgets',
  '/imei':             'IMEI Checker',
  '/sell':             'Sell Your Phone',
  '/cart':             'My Cart',
  '/account':          'My Account',
  '/account/orders':   'My Orders',
  '/account/wishlist': 'Saved Phones',
  '/checkout':         'Checkout',
  '/login':            'Sign In',
  '/signup':           'Create Account',
  '/forgot-password':  'Reset Password',
  '/contact':          'Contact Us',
  '/about':            'About Inexa',
  '/faq':              'FAQ',
  '/privacy':          'Privacy Policy',
  '/terms':            'Terms',
  '/refund':           'Refund Policy',
}

// Pages that show the header (inner pages only)
const INNER_PAGES = Object.keys(PAGE_TITLES)

export function MobileHeader() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on home, admin, or desktop
  if (pathname === '/' || pathname.startsWith('/admin')) return null

  // Match exact or prefix (e.g. /phones/123)
  const matchKey = INNER_PAGES.find(k => pathname === k || pathname.startsWith(k + '/'))
  if (!matchKey) return null

  const title = PAGE_TITLES[matchKey] ?? ''

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 md:hidden flex items-center"
      style={{
        height: 52,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'saturate(200%) blur(24px)',
        WebkitBackdropFilter: 'saturate(200%) blur(24px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
      }}
    >
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center"
        style={{
          width: 44, height: 44,
          marginLeft: 4,
          background: 'none', border: 'none',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Back"
      >
        <ChevronLeft size={26} strokeWidth={2.2} color="#1D9E75" />
      </button>

      <span
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 16,
          fontWeight: 600,
          color: '#060d0a',
          letterSpacing: '-0.3px',
          pointerEvents: 'none',
        }}
      >
        {title}
      </span>
    </header>
  )
}
