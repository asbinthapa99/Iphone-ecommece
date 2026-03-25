'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Users, RefreshCw,
  Settings, ChevronRight, LogOut
} from 'lucide-react'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/tradein', icon: RefreshCw, label: 'Trade-ins' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f4f4f0' }}>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex lg:w-56 xl:w-60 flex-col fixed inset-y-0 left-0 z-30"
        style={{ background: '#060d0a' }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', height: 64 }}
        >
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 34, height: 34, background: '#1D9E75' }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>Ix</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1 }}>
              Inexa Nepal
            </p>
            <p style={{ fontSize: 10, color: '#555', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
            const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 transition-colors"
                style={{
                  color: isActive ? '#1D9E75' : '#888',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'rgba(29,158,117,0.12)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'transparent'
                    el.style.color = '#888'
                  }
                }}
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom — view store & logout */}
        <div
          className="px-4 py-4 flex flex-col gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Link
            href="/"
            className="flex items-center justify-between text-xs hover:text-white transition-colors"
            style={{ color: '#555', textDecoration: 'none' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View Store</span>
            <ChevronRight size={12} />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center justify-between text-xs hover:text-red-400 transition-colors w-full bg-transparent border-none p-0 cursor-pointer"
            style={{ color: '#555' }}
          >
            <span>Log out</span>
            <LogOut size={12} />
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col lg:pl-56 xl:pl-60">
        {/* Top header */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6"
          style={{
            height: 56,
            background: '#fff',
            borderBottom: '0.5px solid #f0f0ee',
            boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex items-center gap-3">
            <AdminMobileNav userName="Admin" userRole="admin" />
            <Link
              href="/admin"
              style={{ fontWeight: 700, color: '#060d0a', fontSize: 14, textDecoration: 'none' }}
              className="hidden sm:block"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1"
              style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}
            >
              View Store <ChevronRight size={11} />
            </Link>

            {/* Admin avatar */}
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 32, height: 32, background: '#060d0a', fontSize: 12, fontWeight: 700, color: '#1D9E75' }}
            >
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
