'use client'

import { useState } from 'react'
import { Search, User, ShieldCheck, Crown, Users } from 'lucide-react'

interface DemoUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin' | 'super_admin'
  orders: number
  joinedAt: string
}

const DEMO_USERS: DemoUser[] = [
  { id: '1', name: 'Ram Sharma', email: 'ram@example.com', phone: '9841234567', role: 'customer', orders: 2, joinedAt: '2024-01-15' },
  { id: '2', name: 'Sita Thapa', email: 'sita@example.com', phone: '9800000001', role: 'customer', orders: 1, joinedAt: '2024-01-14' },
  { id: '3', name: 'Admin User', email: 'admin@inexa.com.np', role: 'admin', orders: 0, joinedAt: '2024-01-01' },
  { id: '4', name: 'Hari Bahadur', email: 'hari@example.com', phone: '9855555555', role: 'customer', orders: 1, joinedAt: '2024-01-12' },
  { id: '5', name: 'Gita KC', email: 'gita@example.com', phone: '9800000002', role: 'customer', orders: 0, joinedAt: '2024-01-10' },
]

const ROLE_CONFIG = {
  customer:    { label: 'Customer', bg: '#f0f0ee', color: '#444', icon: User },
  admin:       { label: 'Admin', bg: '#E1F5EE', color: '#0F6E56', icon: ShieldCheck },
  super_admin: { label: 'Super Admin', bg: '#ede9fe', color: '#6d28d9', icon: Crown },
}

export default function AdminUsersPage() {
  const [users] = useState<DemoUser[]>(DEMO_USERS)
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone ?? '').includes(q)
  })

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Users</h1>
        <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{filtered.length} users</p>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-[10px] px-3"
        style={{ border: '0.5px solid #e0e0dc', background: '#fff', maxWidth: 360 }}
      >
        <Search size={13} color="#aaa" />
        <input
          type="text"
          placeholder="Search by name, email, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 0', fontSize: 13, border: 'none', outline: 'none', background: 'transparent', color: '#060d0a' }}
        />
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((user) => {
          const role = ROLE_CONFIG[user.role]
          const RoleIcon = role.icon
          const initials = user.name.slice(0, 2).toUpperCase()
          return (
            <div key={user.id} className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 40, height: 40, background: '#f4f4f0', fontSize: 14, fontWeight: 700, color: '#444' }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }} className="truncate">{user.name}</p>
                  <p style={{ fontSize: 11, color: '#888' }} className="truncate">{user.email}</p>
                </div>
                <span
                  className="flex items-center gap-1 shrink-0"
                  style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: role.bg, color: role.color }}
                >
                  <RoleIcon size={10} />{role.label}
                </span>
              </div>
              <div className="flex items-center gap-4" style={{ fontSize: 11, color: '#888' }}>
                {user.phone && <span>{user.phone}</span>}
                <span><strong style={{ color: '#060d0a' }}>{user.orders}</strong> orders</span>
                <span>Joined {new Date(user.joinedAt).toLocaleDateString('en-NP', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#fafaf8', borderBottom: '0.5px solid #f0f0ee' }}>
                {['User', 'Phone', 'Joined', 'Orders', 'Role'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const role = ROLE_CONFIG[user.role]
                const RoleIcon = role.icon
                return (
                  <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f4f4f0' : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center rounded-full shrink-0"
                          style={{ width: 32, height: 32, background: '#f4f4f0', fontSize: 11, fontWeight: 700, color: '#444' }}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{user.name}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 12, color: '#444' }}>{user.phone ?? '—'}</td>
                    <td className="px-4 py-3" style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                      {new Date(user.joinedAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: '#060d0a', textAlign: 'center' }}>
                      {user.orders}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1"
                        style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: role.bg, color: role.color }}
                      >
                        <RoleIcon size={10} />{role.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center rounded-[14px] py-14" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <Users size={28} color="#ddd" className="mx-auto mb-3" />
          <p style={{ fontSize: 14, color: '#888' }}>No users found</p>
        </div>
      )}
    </div>
  )
}
