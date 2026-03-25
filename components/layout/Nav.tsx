'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, ShieldCheck, Globe, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/lib/cart'

const LINKS = [
  { href: '/phones', label: 'Phones' },
  { href: '/gadgets', label: 'Gadgets' },
  { href: '/imei', label: 'Check IMEI' },
  { href: '/sell', label: 'Sell' },
  { href: '#faq', label: 'FAQ' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { count: cartCount } = useCart()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setUserMenuOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const isAdmin = user?.isAdmin === true

  if (pathname.startsWith('/admin')) return null

  return (
    // On mobile, MobileBottomNav replaces the desktop nav entirely
    <div className="hidden md:block">
      <div
        className="pwa-hide fixed left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300"
        style={{ top: scrolled ? 16 : 56 }}
      >
        <nav
          className="pointer-events-auto transition-all duration-500 w-full max-w-5xl rounded-[100px]"
          style={{
            background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
            border: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.4)',
            boxShadow: scrolled 
              ? '0 20px 40px -12px rgba(0,0,0,0.1)' 
              : '0 8px 32px -12px rgba(0,0,0,0.08)',
            transform: scrolled ? 'translateY(0)' : 'translateY(0)',
          }}
        >
          <div
            className="flex items-center justify-between mx-auto"
            style={{ height: 64, paddingLeft: 24, paddingRight: 24 }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" style={{ textDecoration: 'none' }}>
              <div className="w-8 h-8 rounded-full bg-[#06112a] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <Globe size={18} color="#fff" strokeWidth={2} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#000', letterSpacing: '-0.3px', textShadow: '0 2px 10px rgba(255,255,255,0.5)' }}>
                Inexa
              </span>
            </Link>

            {/* Center nav links */}
            <div className="hidden md:flex items-center" style={{ gap: 40 }}>
              {LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: 15,
                      fontWeight: active ? 600 : 500,
                      color: active ? '#000' : '#444',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s ease',
                    }}
                    className="hover:text-black"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center" style={{ gap: 24 }}>
              {/* Cart icon */}
              <Link href="/cart" className="relative flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <ShoppingBag size={18} color="#444" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white"
                    style={{ width: 16, height: 16, background: '#1D9E75', fontSize: 9, fontWeight: 700 }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              {loading ? (
                <div style={{ width: 72, height: 36, borderRadius: 100, background: '#f0f0ee' }} />
              ) : user ? (
                <div style={{ position: 'relative' }} onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen) }}>
                  <button
                    className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{
                      border: '1px solid #e4e4e0',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#000',
                      padding: '6px 16px 6px 6px',
                      borderRadius: 100,
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{ width: 28, height: 28, background: '#000', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}
                    >
                      {(user.name ?? user.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name ?? user.email?.split('@')[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-3 py-1 z-50 animate-fadeDown"
                      style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, width: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link href="/account" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        style={{ fontSize: 14, fontWeight: 500, color: '#333', textDecoration: 'none' }}>
                        <User size={15} className="text-gray-400" /> My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        style={{ fontSize: 14, fontWeight: 500, color: '#333', textDecoration: 'none' }}>
                        <ShieldCheck size={15} className="text-gray-400" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                          style={{ fontSize: 14, color: '#000', fontWeight: 600, textDecoration: 'none', borderTop: '1px solid #f4f4f2' }}>
                          <ShieldCheck size={15} className="text-[#1D9E75]" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { setUserMenuOpen(false); handleSignOut() }}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors"
                        style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid #f4f4f2', textAlign: 'left' }}>
                        <LogOut size={15} className="text-red-400" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    style={{
                      fontSize: 15, fontWeight: 500, color: '#444', textDecoration: 'none',
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    style={{
                      fontSize: 15, fontWeight: 700, color: '#000', textDecoration: 'none',
                    }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right: hamburger */}
            <div className="md:hidden flex items-center gap-4">
              {/* Cart icon mobile */}
              <Link href="/cart" className="relative flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <ShoppingBag size={18} color="#444" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white"
                    style={{ width: 16, height: 16, background: '#1D9E75', fontSize: 9, fontWeight: 700 }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              {!user && !loading && (
                <Link
                  href="/signup"
                  style={{
                    fontSize: 14, fontWeight: 700, textDecoration: 'none',
                    color: '#000',
                  }}
                >
                  Get Started
                </Link>
              )}
              <button
                className="flex items-center justify-center transition-colors"
                style={{
                  width: 36, height: 36, borderRadius: 100, cursor: 'pointer',
                  background: open ? '#f0f0f0' : 'transparent', border: 'none',
                }}
                onClick={() => setOpen(!open)}
              >
                {open ? <X size={20} color="#000" /> : <Menu size={20} color="#000" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {open && (
            <div
              className="md:hidden animate-slideDown overflow-hidden"
              style={{ background: 'transparent', padding: '0 20px 20px' }}
            >
              <div className="pt-2 border-t border-gray-100">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{ display: 'block', fontSize: 16, fontWeight: 500, color: '#000', padding: '12px 4px', textDecoration: 'none' }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid #f0f0ee', marginTop: 8, paddingTop: 8 }}>
                  {user ? (
                    <>
                      <Link href="/account" onClick={() => setOpen(false)}
                        style={{ display: 'block', fontSize: 16, fontWeight: 500, color: '#444', padding: '12px 4px', textDecoration: 'none' }}>
                        My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setOpen(false)}
                        style={{ display: 'block', fontSize: 16, fontWeight: 500, color: '#444', padding: '12px 4px', textDecoration: 'none' }}>
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setOpen(false)}
                          style={{ display: 'block', fontSize: 16, fontWeight: 600, color: '#000', padding: '12px 4px', textDecoration: 'none' }}>
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { setOpen(false); handleSignOut() }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#dc2626', padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setOpen(false)}
                      style={{ display: 'block', fontSize: 16, fontWeight: 600, color: '#555', padding: '12px 4px', textDecoration: 'none' }}>
                      Login to existing account
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Spacer for floating nav */}
      <div style={{ height: 90 }} />
    </div>
  )
}
