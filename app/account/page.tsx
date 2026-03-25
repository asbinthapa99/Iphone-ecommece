'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/lib/cart'
import {
  Package, Phone, Mail, LogOut, ChevronRight,
  ShieldCheck, Clock, Edit2, Heart, ShoppingBag,
  Smartphone, Star, MapPin, X, Check, User,
} from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { count: cartCount, total: cartTotal } = useCart()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.phone) setPhone(data.phone)
          if (data.address) setAddress(data.address)
          if (data.city) setCity(data.city)
          if (data.name && !user.name) setName(data.name)
        })
        .catch(console.error)
    }
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, city })
      })
    } catch (e) {
      console.error(e)
    } finally {
      setEditing(false)
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-lg px-4">
          <div className="shimmer rounded-[20px]" style={{ height: 160 }} />
          <div className="shimmer rounded-[16px]" style={{ height: 80 }} />
          <div className="shimmer rounded-[16px]" style={{ height: 220 }} />
        </div>
      </main>
    )
  }

  const initials = (user.name ?? user.email ?? 'U').slice(0, 2).toUpperCase()
  const displayName = name || user.name || user.email?.split('@')[0] || 'User'
  const [imgError, setImgError] = useState(false)

  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-28">

      {/* ── Profile Hero ── */}
      <div
        className="rounded-[20px] p-5 mb-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #060d0a 0%, #0f2419 100%)' }}
      >
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="absolute top-4 right-4 flex items-center justify-center rounded-[8px]"
            style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}
          >
            <Edit2 size={13} color="rgba(255,255,255,0.7)" />
          </button>
        )}

        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="rounded-full shrink-0"
              style={{ width: 56, height: 56, objectFit: 'cover', border: '2px solid #1D9E75' }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 56, height: 56, background: '#1D9E75', fontSize: 20, fontWeight: 700, color: '#fff' }}
            >
              {initials}
            </div>
          )}

          {!editing ? (
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
                {displayName}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{user.email}</p>
              <span
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(29,158,117,0.2)', fontSize: 10, fontWeight: 600, color: '#1D9E75' }}
              >
                <ShieldCheck size={9} /> Verified Customer
              </span>
            </div>
          ) : (
            <div className="flex-1 space-y-2">
              {[
                { label: 'Name', value: name, set: setName, type: 'text', placeholder: 'Your name' },
                { label: 'Phone', value: phone, set: setPhone, type: 'tel', placeholder: '+977 98XXXXXXXX' },
                { label: 'Delivery Address', value: address, set: setAddress, type: 'text', placeholder: 'Street, Area, Landmark' },
                { label: 'City', value: city, set: setCity, type: 'text', placeholder: 'Kathmandu, Pokhara, etc.' },
              ].map(({ label, value, set, type, placeholder }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.2)', fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.08)', outline: 'none' }}
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px]"
                  style={{ background: '#1D9E75', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  <Check size={11} /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px]"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 12, border: 'none', cursor: 'pointer' }}
                >
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Orders', value: '0', href: '/account/orders', color: '#060d0a' },
          { label: 'In Cart', value: String(cartCount), href: '/cart', color: '#1D9E75' },
          { label: 'Saved', value: '0', href: '/account/wishlist', color: '#f59e0b' },
        ].map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center justify-center py-4 rounded-[14px] hover:shadow-sm transition-shadow"
            style={{ background: '#fff', border: '0.5px solid #ebebeb', textDecoration: 'none' }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: '-0.8px', lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 11, color: '#888', marginTop: 4, fontWeight: 500 }}>{label}</span>
          </Link>
        ))}
      </div>

      {/* ── Cart preview (if non-empty) ── */}
      {cartCount > 0 && (
        <Link
          href="/cart"
          className="flex items-center justify-between px-4 py-4 rounded-[16px] mb-4 hover:opacity-90 transition-opacity"
          style={{ background: '#E1F5EE', border: '0.5px solid #b6e8cf', textDecoration: 'none' }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} color="#0F6E56" />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0F6E56' }}>
                {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
              </p>
              <p style={{ fontSize: 11, color: '#1D9E75', marginTop: 1 }}>
                Total: NPR {cartTotal.toLocaleString()} · Tap to review
              </p>
            </div>
          </div>
          <ChevronRight size={16} color="#0F6E56" />
        </Link>
      )}

      {/* ── Quick actions ── */}
      <div className="rounded-[16px] mb-4 overflow-hidden" style={{ border: '0.5px solid #ebebeb' }}>
        {[
          {
            href: '/phones',
            icon: Smartphone,
            label: 'Browse Phones',
            sub: 'Shop verified iPhones & gadgets',
            accent: false,
          },
          {
            href: '/cart',
            icon: ShoppingBag,
            label: 'My Cart',
            sub: cartCount > 0
              ? `${cartCount} item${cartCount !== 1 ? 's' : ''} · NPR ${cartTotal.toLocaleString()}`
              : 'Your cart is empty',
            accent: cartCount > 0,
          },
          {
            href: '/account/orders',
            icon: Package,
            label: 'My Orders',
            sub: 'Track & view your purchases',
            accent: false,
          },
          {
            href: '/account/wishlist',
            icon: Heart,
            label: 'Saved Phones',
            sub: 'Your wishlist',
            accent: false,
          },
          {
            href: '/sell',
            icon: Clock,
            label: 'Sell Your Device',
            sub: 'Get an instant trade-in quote',
            accent: false,
          },
          {
            href: '/imei',
            icon: ShieldCheck,
            label: 'IMEI Checker',
            sub: 'Verify any device for free',
            accent: false,
          },
        ].map(({ href, icon: Icon, label, sub, accent }, i, arr) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
            style={{
              borderBottom: i < arr.length - 1 ? '0.5px solid #f0f0ee' : 'none',
              background: '#fff',
              textDecoration: 'none',
            }}
          >
            <div
              className="flex items-center justify-center rounded-[10px] shrink-0"
              style={{ width: 36, height: 36, background: accent ? '#E1F5EE' : '#f4f4f0' }}
            >
              <Icon size={16} color={accent ? '#0F6E56' : '#444'} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{label}</p>
              <p style={{ fontSize: 11, color: accent ? '#1D9E75' : '#888', marginTop: 1 }} className="truncate">
                {sub}
              </p>
            </div>
            <ChevronRight size={14} color="#ccc" />
          </Link>
        ))}
      </div>

      {/* ── Profile info ── */}
      <div className="rounded-[16px] mb-4 overflow-hidden" style={{ border: '0.5px solid #ebebeb' }}>
        {[
          { icon: Mail, label: 'Email', value: user.email ?? '—' },
          { icon: Phone, label: 'Phone', value: phone || 'Not set — tap edit ✎ to add' },
          { icon: MapPin, label: 'Delivery address', value: address ? `${address}${city ? `, ${city}` : ''}` : 'Not set — tap edit ✎ to add' },
          { icon: Star, label: 'Member since', value: new Date().toLocaleDateString('en-NP', { month: 'long', year: 'numeric' }) },
          { icon: User, label: 'Login method', value: 'Google Account' },
        ].map(({ icon: Icon, label, value }, i, arr) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: i < arr.length - 1 ? '0.5px solid #f0f0ee' : 'none', background: '#fff' }}
          >
            <Icon size={14} color="#aaa" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {label}
              </p>
              <p style={{ fontSize: 13, color: '#060d0a', marginTop: 1 }} className="truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sign out ── */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 rounded-[14px] py-3 hover:bg-red-50 transition-colors"
        style={{ background: '#fff', border: '0.5px solid #e8e8e4', fontSize: 13, fontWeight: 500, color: '#dc2626', cursor: 'pointer' }}
      >
        <LogOut size={14} />
        Sign out
      </button>
    </main>
  )
}
