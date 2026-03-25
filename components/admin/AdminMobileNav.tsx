'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LayoutDashboard, Package, ShoppingBag, Users, RefreshCw, Settings, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/tradein', icon: RefreshCw, label: 'Trade-ins' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

interface Props {
  userName: string
  userRole: string
}

export function AdminMobileNav({ userName, userRole }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center justify-center rounded-[10px]"
        style={{ width: 36, height: 36, border: '0.5px solid #e0e0dc', background: '#fff', cursor: 'pointer' }}
      >
        <Menu size={16} color="#444" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 lg:hidden flex flex-col"
        style={{
          width: 260,
          background: '#060d0a',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 32, height: 32, background: '#1D9E75' }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>Ix</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>Inexa Nepal</p>
              <p style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} color="#888" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5"
              style={{ color: '#ccc', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div
          className="px-4 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 32, height: 32, background: '#1a2820', color: '#1D9E75', fontSize: 12, fontWeight: 700 }}
            >
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 pr-2">
              <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1 }} className="truncate">{userName}</p>
              <p style={{ fontSize: 10, color: '#666', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{userRole}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-white/5 rounded-[10px] transition-colors bg-transparent border-none cursor-pointer shrink-0"
          >
            <LogOut size={16} color="#dc2626" />
          </button>
        </div>
      </div>
    </>
  )
}
