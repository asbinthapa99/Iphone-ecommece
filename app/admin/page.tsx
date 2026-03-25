import Link from 'next/link'
import { MOCK_DEVICES } from '@/lib/mock-data'
import type { ProductCategory } from '@/types'
import {
  Package, TrendingUp, DollarSign, ShieldCheck,
  Plus, ArrowRight, ShoppingBag, RefreshCw, Users, Settings,
} from 'lucide-react'

// ── Data helpers ──────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  iphone: 'iPhone', macbook: 'MacBook', ipad: 'iPad', airpods: 'AirPods',
  android: 'Android', windows: 'Windows', console: 'Console', other: 'Other',
}

function buildStats() {
  const total = MOCK_DEVICES.length
  const available = MOCK_DEVICES.filter((d) => d.status === 'available').length
  const sold = MOCK_DEVICES.filter((d) => d.status === 'sold').length
  const gradeA = MOCK_DEVICES.filter((d) => d.grade === 'A').length
  const revenue = MOCK_DEVICES.filter((d) => d.status === 'sold').reduce((s, d) => s + d.price, 0)
  const avgPrice = total > 0 ? Math.round(MOCK_DEVICES.reduce((s, d) => s + d.price, 0) / total) : 0

  const byCategory = Object.entries(CATEGORY_LABELS).map(([cat, label]) => ({
    category: cat as ProductCategory,
    label,
    count: MOCK_DEVICES.filter((d) => d.category === cat).length,
    available: MOCK_DEVICES.filter((d) => d.category === cat && d.status === 'available').length,
  })).filter((c) => c.count > 0)

  return { total, available, sold, gradeA, revenue, avgPrice, byCategory }
}

const QUICK_ACTIONS = [
  { href: '/admin/products/new', label: 'Add Product', icon: Plus, bg: '#060d0a', fg: '#1D9E75' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, bg: '#1D9E75', fg: '#fff' },
  { href: '/admin/tradein', label: 'Trade-ins', icon: RefreshCw, bg: '#FAEEDA', fg: '#633806' },
  { href: '/admin/users', label: 'Users', icon: Users, bg: '#f0f0ee', fg: '#444' },
  { href: '/admin/products', label: 'All Products', icon: Package, bg: '#f0f0ee', fg: '#444' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, bg: '#f0f0ee', fg: '#444' },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { total, available, sold, gradeA, revenue, avgPrice, byCategory } = buildStats()

  const topStats = [
    { label: 'Total Inventory', value: total, icon: Package, color: '#060d0a', sub: 'all products' },
    { label: 'Available', value: available, icon: TrendingUp, color: '#1D9E75', sub: 'ready to sell' },
    { label: 'Sold', value: sold, icon: DollarSign, color: '#633806', sub: 'all time' },
    { label: 'Grade A', value: gradeA, icon: ShieldCheck, color: '#1D9E75', sub: 'top condition' },
  ]

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Inexa Nepal admin panel</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-[8px]"
          style={{ background: '#060d0a', color: '#1D9E75', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
        >
          <Plus size={12} /> Add Product
        </Link>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {topStats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <Icon size={14} color={color} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.8px', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Avg price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-[14px] p-4 flex items-center gap-3" style={{ background: '#f4faf7', border: '0.5px solid #c8ead9' }}>
          <DollarSign size={20} color="#0F6E56" />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Revenue</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.6px' }}>NPR {revenue > 0 ? revenue.toLocaleString() : '—'}</p>
          </div>
        </div>
        <div className="rounded-[14px] p-4 flex items-center gap-3" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
          <TrendingUp size={20} color="#444" />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg. Listing Price</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.6px' }}>NPR {avgPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, bg, fg }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-2 rounded-[14px] py-4"
              style={{ background: '#fff', border: '0.5px solid #ebebeb', textDecoration: 'none' }}
            >
              <div className="flex items-center justify-center rounded-[10px]" style={{ width: 36, height: 36, background: bg }}>
                <Icon size={16} color={fg} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#444', textAlign: 'center' }}>{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>Inventory by Category</p>
          <Link href="/admin/products" className="flex items-center gap-1" style={{ fontSize: 11, color: '#1D9E75', textDecoration: 'none' }}>
            Manage all <ArrowRight size={10} />
          </Link>
        </div>
        <div className="rounded-[14px] overflow-hidden" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          {byCategory.map((cat, i) => (
            <div
              key={cat.category}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < byCategory.length - 1 ? '0.5px solid #f0f0ee' : 'none' }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a', flex: 1 }}>{cat.label}</p>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 11, color: '#888' }}>{cat.available} available</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', minWidth: 28, textAlign: 'right' }}>{cat.count}</span>
              </div>
              {/* Mini progress bar */}
              <div style={{ width: 60, height: 4, background: '#f0f0ee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(cat.available / cat.count) * 100}%`, height: '100%', background: '#1D9E75', borderRadius: 4 }} />
              </div>
              <Link
                href={`/admin/products?category=${cat.category}`}
                style={{ fontSize: 11, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}
              >
                →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent listings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>Recent listings</p>
          <Link href="/admin/products" className="flex items-center gap-1" style={{ fontSize: 11, color: '#1D9E75', textDecoration: 'none' }}>
            View all <ArrowRight size={10} />
          </Link>
        </div>
        <div className="rounded-[14px] overflow-hidden" style={{ border: '0.5px solid #ebebeb' }}>
          <div className="sm:hidden divide-y" style={{ borderColor: '#f0f0ee' }}>
            {MOCK_DEVICES.slice(0, 5).map((device) => (
              <div key={device.id} className="flex items-center justify-between px-4 py-3" style={{ background: '#fff' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{device.model} {device.storage}</p>
                  <p style={{ fontSize: 11, color: '#888' }}>{CATEGORY_LABELS[device.category]} · Grade {device.grade}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>NPR {device.price.toLocaleString()}</p>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                    background: device.status === 'available' ? '#E1F5EE' : '#f0f0ee',
                    color: device.status === 'available' ? '#0F6E56' : '#888',
                  }}>{device.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm" style={{ background: '#fff' }}>
              <thead>
                <tr style={{ background: '#fafaf8', borderBottom: '0.5px solid #f0f0ee' }}>
                  {['Category', 'Product', 'Grade', 'Status', 'Price', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_DEVICES.slice(0, 8).map((device, i) => (
                  <tr key={device.id} style={{ borderBottom: i < 7 ? '0.5px solid #f4f4f0' : 'none' }}>
                    <td className="px-4 py-3">
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: '#f0f0ee', color: '#666' }}>
                        {CATEGORY_LABELS[device.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{device.model}</p>
                      <p style={{ fontSize: 11, color: '#888' }}>{device.storage} · {device.color}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                        background: device.grade === 'A' ? '#060d0a' : device.grade === 'B' ? '#FAEEDA' : '#f0f0ee',
                        color: device.grade === 'A' ? '#1D9E75' : device.grade === 'B' ? '#633806' : '#888',
                      }}>
                        Grade {device.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                        background: device.status === 'available' ? '#E1F5EE' : '#f0f0ee',
                        color: device.status === 'available' ? '#0F6E56' : '#888',
                      }}>{device.status}</span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>NPR {device.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${device.id}/edit`}
                        style={{ fontSize: 11, fontWeight: 600, color: '#1D9E75', textDecoration: 'none', padding: '4px 10px', border: '0.5px solid #c8ead9', borderRadius: 6 }}
                      >Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
