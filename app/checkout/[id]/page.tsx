'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { MOCK_DEVICES } from '@/lib/mock-data'
import {
  ShieldCheck, ArrowLeft, ArrowRight, Loader2,
  MapPin, Phone, Mail, User, StickyNote, CheckCircle2, Truck, Lock,
} from 'lucide-react'
import type { PaymentMethod } from '@/types'

// ── Payment options ───────────────────────────────────────────────────────────

const PAYMENT_OPTIONS: {
  id: PaymentMethod
  label: string
  sub: string
  bg: string
  border: string
  activeBg: string
  icon: React.ReactNode
}[] = [
  {
    id: 'esewa',
    label: 'eSewa',
    sub: 'Coming soon',
    bg: '#fafafa',
    border: '#e0e0dc',
    activeBg: '#f0faf6',
    icon: (
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: '#60bb44', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>eS</span>
      </div>
    ),
  },
  {
    id: 'khalti',
    label: 'Khalti',
    sub: 'Digital wallet payment',
    bg: '#fafafa',
    border: '#e0e0dc',
    activeBg: '#f9f5ff',
    icon: (
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: '#5c2d91', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Kh</span>
      </div>
    ),
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    sub: 'Kathmandu & Pokhara only',
    bg: '#fafafa',
    border: '#e0e0dc',
    activeBg: '#fafaf6',
    icon: (
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16 }}>💵</span>
      </div>
    ),
  },
]

// ── Form input style helpers ──────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px 11px 42px',
  borderRadius: 10, border: '1px solid #e8e8e4',
  fontSize: 14, color: '#060d0a', background: '#fafaf8',
  outline: 'none', transition: 'border-color 0.15s, background 0.15s',
}

const inpPlain: React.CSSProperties = {
  ...inp, paddingLeft: 14,
}

function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', display: 'flex', alignItems: 'center',
      }}>
        {icon}
      </span>
      {children}
    </div>
  )
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, color: '#999',
  marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em',
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()

  const device = MOCK_DEVICES.find((d) => d.id === id)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa')
  const [warrantyExtended, setWarrantyExtended] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setEmail(user.email ?? '')
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

  if (!device) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <p style={{ color: '#888' }}>Device not found.</p>
        <Link href="/phones" style={{ color: '#1D9E75', fontSize: 13 }}>← Browse phones</Link>
      </main>
    )
  }

  const total = device.price + (warrantyExtended ? 1500 : 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: device.id,
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
          deliveryAddress: address,
          city,
          paymentMethod,
          warrantyExtended,
          notes,
          userId: user?.id,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to place order.'); return }

      if (paymentMethod === 'esewa') {
        const esewaRes = await fetch('/api/payment/esewa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.order.id, amount: total }),
        })
        const esewaData = await esewaRes.json()
        if (esewaData.formUrl) { window.location.href = esewaData.formUrl; return }
      } else if (paymentMethod === 'khalti') {
        const khaltiRes = await fetch('/api/payment/khalti/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.order.id, amount: total }),
        })
        const khaltiData = await khaltiRes.json()
        if (khaltiData.paymentUrl) { window.location.href = khaltiData.paymentUrl; return }
      }

      router.push(`/order/${data.order.id}/confirmation`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#1D9E75'
    e.currentTarget.style.background = '#fff'
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#e8e8e4'
    e.currentTarget.style.background = '#fafaf8'
  }

  return (
    <main className="min-h-screen" style={{ background: '#f7f7f5' }}>

      {/* ── Top bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href={`/phones/${device.id}`}
            className="flex items-center justify-center rounded-[10px] hover:bg-gray-50 transition-colors"
            style={{ width: 36, height: 36, border: '1px solid #e8e8e4', background: '#fff', flexShrink: 0 }}
          >
            <ArrowLeft size={14} color="#444" />
          </Link>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>
              Checkout
            </span>
            <span style={{ fontSize: 11, color: '#bbb' }}>·</span>
            <span style={{ fontSize: 12, color: '#999' }}>Secure & encrypted</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Lock size={11} color="#1D9E75" />
            <span style={{ fontSize: 11, color: '#1D9E75', fontWeight: 600 }}>SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-[1fr_340px] gap-5 items-start">

            {/* ── LEFT: Form ── */}
            <div className="space-y-4">

              {/* Section 01 — Delivery */}
              <div className="rounded-[18px] overflow-hidden" style={{ background: '#fff', border: '1px solid #ebebeb' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #f4f4f2' }}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center text-[11px] font-black rounded-full"
                      style={{ width: 24, height: 24, background: '#060d0a', color: '#fff', flexShrink: 0 }}
                    >
                      01
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.3px' }}>
                      Delivery Details
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <FieldWrap icon={<User size={14} color="#bbb" />}>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Ram Sharma" required style={inp}
                        onFocus={focusIn} onBlur={focusOut}
                      />
                    </FieldWrap>
                  </div>

                  {/* Phone + Email side by side on md+ */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label style={lbl}>Phone *</label>
                      <FieldWrap icon={<Phone size={14} color="#bbb" />}>
                        <input
                          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="98XXXXXXXX" required style={inp}
                          onFocus={focusIn} onBlur={focusOut}
                        />
                      </FieldWrap>
                    </div>
                    <div>
                      <label style={lbl}>Email (for invoice)</label>
                      <FieldWrap icon={<Mail size={14} color="#bbb" />}>
                        <input
                          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com" style={inp}
                          onFocus={focusIn} onBlur={focusOut}
                        />
                      </FieldWrap>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={lbl}>Delivery Address *</label>
                    <FieldWrap icon={<MapPin size={14} color="#bbb" />}>
                      <input
                        type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                        placeholder="Thamel, near..." required style={inp}
                        onFocus={focusIn} onBlur={focusOut}
                      />
                    </FieldWrap>
                  </div>

                  {/* City */}
                  <div>
                    <label style={lbl}>City *</label>
                    <select
                      value={city} onChange={(e) => setCity(e.target.value)}
                      style={{ ...inpPlain, cursor: 'pointer' }}
                      onFocus={focusIn} onBlur={focusOut}
                    >
                      {['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Other'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={lbl}>Order Notes (optional)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 13, top: 12, pointerEvents: 'none' }}>
                        <StickyNote size={14} color="#bbb" />
                      </span>
                      <textarea
                        value={notes} onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for delivery..."
                        rows={2}
                        style={{ ...inp, resize: 'none' }}
                        onFocus={focusIn} onBlur={focusOut}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 02 — Payment */}
              <div className="rounded-[18px] overflow-hidden" style={{ background: '#fff', border: '1px solid #ebebeb' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #f4f4f2' }}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center text-[11px] font-black rounded-full"
                      style={{ width: 24, height: 24, background: '#060d0a', color: '#fff', flexShrink: 0 }}
                    >
                      02
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.3px' }}>
                      Payment Method
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-2.5">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const active = paymentMethod === opt.id
                    const isEsewa = opt.id === 'esewa'
                    const activeColors: Record<PaymentMethod, string> = {
                      esewa: '#1D9E75',
                      khalti: '#5c2d91',
                      cod: '#444',
                      bank_transfer: '#2563eb',
                    }
                    const color = activeColors[opt.id]
                    return (
                      <div key={opt.id}>
                        <div
                          onClick={() => setPaymentMethod(opt.id)}
                          className="flex items-center gap-3 rounded-[12px] p-3.5 cursor-pointer transition-all duration-150"
                          style={{
                            border: `1.5px solid ${active ? color : '#e8e8e4'}`,
                            background: active ? opt.activeBg : opt.bg,
                            opacity: isEsewa ? 0.7 : 1,
                          }}
                        >
                          {opt.icon}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>{opt.label}</p>
                              {isEsewa && (
                                <span style={{
                                  fontSize: 9, fontWeight: 700, color: '#92400e',
                                  background: '#fef3c7', border: '1px solid #fde68a',
                                  borderRadius: 4, padding: '1px 5px', letterSpacing: '0.05em',
                                  textTransform: 'uppercase',
                                }}>
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: '#999', marginTop: 1 }}>{opt.sub}</p>
                          </div>
                          <div
                            style={{
                              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                              border: `2px solid ${active ? color : '#ddd'}`,
                              background: active ? color : '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                        </div>

                        {/* eSewa selected — show notice */}
                        {isEsewa && active && (
                          <div
                            className="flex items-start gap-2 rounded-[10px] px-3.5 py-3 mt-1.5"
                            style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
                          >
                            <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
                            <div>
                              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>
                                eSewa integration coming soon
                              </p>
                              <p style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>
                                Please select Khalti or Cash on Delivery to complete your order.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Section 03 — Warranty upsell */}
              <div className="rounded-[18px] overflow-hidden" style={{ background: '#fff', border: '1px solid #ebebeb' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #f4f4f2' }}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center text-[11px] font-black rounded-full"
                      style={{ width: 24, height: 24, background: '#060d0a', color: '#fff', flexShrink: 0 }}
                    >
                      03
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.3px' }}>
                      Protection Plan
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-2.5">
                  {/* Standard (always included) */}
                  <div
                    className="flex items-center gap-3 rounded-[12px] p-3.5"
                    style={{ background: '#f7f7f5', border: '1px solid #ebebeb' }}
                  >
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 10, background: '#E1F5EE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={18} color="#0F6E56" />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>6-Month Inexa Warranty</p>
                      <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>Included free with every device</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1D9E75' }}>FREE</span>
                  </div>

                  {/* Extended */}
                  <div
                    onClick={() => setWarrantyExtended(!warrantyExtended)}
                    className="flex items-center gap-3 rounded-[12px] p-3.5 cursor-pointer transition-all duration-150"
                    style={{
                      border: `1.5px solid ${warrantyExtended ? '#1D9E75' : '#e8e8e4'}`,
                      background: warrantyExtended ? '#f0faf6' : '#fafaf8',
                    }}
                  >
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: warrantyExtended ? '#1D9E75' : '#f0f0ee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'background 0.15s',
                      }}
                    >
                      <ShieldCheck size={18} color={warrantyExtended ? '#fff' : '#aaa'} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>6-Month Extended Warranty</p>
                      <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>Double the coverage · Full parts & labour</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>+NPR 1,500</span>
                      <div
                        style={{
                          width: 18, height: 18, borderRadius: 5,
                          border: `2px solid ${warrantyExtended ? '#1D9E75' : '#ddd'}`,
                          background: warrantyExtended ? '#1D9E75' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {warrantyExtended && <div style={{ width: 7, height: 7, borderRadius: 2, background: '#fff' }} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sticky Order Summary ── */}
            <div className="md:sticky md:top-6 space-y-4">

              {/* Device card */}
              <div className="rounded-[18px] overflow-hidden" style={{ background: '#fff', border: '1px solid #ebebeb' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #f4f4f2' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Your order
                  </p>
                </div>

                {/* Device row */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #f4f4f2' }}>
                  <div
                    className="flex items-center justify-center rounded-[12px] shrink-0"
                    style={{ width: 60, height: 60, background: '#f4f4f0' }}
                  >
                    {device.photos[0] ? (
                      <Image
                        src={device.photos[0]} alt={device.model}
                        width={44} height={44} className="object-contain"
                        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                        unoptimized
                      />
                    ) : (
                      <span style={{ fontSize: 28 }}>📱</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.3px' }}>
                      {device.model}
                    </p>
                    <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      {device.storage} · {device.color}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span
                        style={{
                          fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                          background: '#E1F5EE', color: '#0F6E56',
                        }}
                      >
                        Grade {device.grade}
                      </span>
                      <span
                        style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                          background: '#f0f4ff', color: '#3b5bdb',
                        }}
                      >
                        {device.batteryHealth}% battery
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 13, color: '#666' }}>{device.model} {device.storage}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>
                      NPR {device.price.toLocaleString()}
                    </span>
                  </div>
                  {warrantyExtended && (
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: 13, color: '#666' }}>Extended Warranty</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>NPR 1,500</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center" style={{ paddingTop: 10, borderTop: '1px solid #f0f0ee' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#060d0a' }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.5px' }}>
                      NPR {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Trust bullets */}
                <div className="px-4 pb-4 space-y-1.5">
                  {[
                    { icon: ShieldCheck, text: '6-month Inexa warranty included' },
                    { icon: CheckCircle2, text: 'IMEI verified · NTA Nepal database' },
                    { icon: Truck, text: 'Free delivery in KTM & Pokhara' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon size={12} color="#1D9E75" />
                      <span style={{ fontSize: 11, color: '#666' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="rounded-[12px] px-4 py-3"
                  style={{ background: '#fff5f5', border: '1px solid #fca5a5' }}
                >
                  <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-[14px] transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  padding: '15px',
                  background: submitting ? '#ccc' : '#060d0a',
                  color: '#fff', fontSize: 15, fontWeight: 800,
                  border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  letterSpacing: '-0.3px',
                }}
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Placing order…</>
                ) : (
                  <>
                    Place order · NPR {total.toLocaleString()}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center" style={{ fontSize: 11, color: '#bbb' }}>
                By placing your order you agree to our{' '}
                <Link href="/terms" style={{ color: '#888', textDecoration: 'underline' }}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: '#888', textDecoration: 'underline' }}>Privacy Policy</Link>
              </p>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}
