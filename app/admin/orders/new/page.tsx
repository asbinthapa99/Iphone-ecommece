'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react'
import { MOCK_DEVICES } from '@/lib/mock-data'
import type { PaymentMethod } from '@/types'

export default function AdminNewOrderPage() {
  const router = useRouter()
  const [deviceId, setDeviceId] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending')
  const [warrantyExtended, setWarrantyExtended] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const availableDevices = MOCK_DEVICES.filter((d) => d.status === 'available')
  const selectedDevice = MOCK_DEVICES.find((d) => d.id === deviceId)
  const total = selectedDevice ? selectedDevice.price + (warrantyExtended ? 1500 : 0) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deviceId) { setError('Please select a device.'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, buyerName, buyerPhone, buyerEmail, deliveryAddress: address, city, paymentMethod, warrantyExtended, notes }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed'); return }
      router.push('/admin/orders')
    } catch { setError('Network error.') }
    setSubmitting(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '0.5px solid #e0e0dc', fontSize: 13, color: '#060d0a',
    background: '#fafaf8', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600, color: '#888',
    marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 36, height: 36, border: '0.5px solid #e0e0dc', background: '#fff' }}
        >
          <ArrowLeft size={15} color="#444" />
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>
          Create Manual Order
        </h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-[10px] p-3" style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}>
          <AlertCircle size={14} color="#dc2626" />
          <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Device selection */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>Select Device *</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableDevices.map((d) => (
              <label
                key={d.id}
                className="flex items-center gap-3 rounded-[10px] p-3 cursor-pointer"
                style={{
                  border: `1px solid ${deviceId === d.id ? '#1D9E75' : '#ebebeb'}`,
                  background: deviceId === d.id ? '#f4faf7' : '#fafaf8',
                }}
              >
                <input
                  type="radio"
                  name="device"
                  value={d.id}
                  checked={deviceId === d.id}
                  onChange={() => setDeviceId(d.id)}
                  style={{ accentColor: '#1D9E75' }}
                />
                <div className="flex-1">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{d.model} {d.storage}</p>
                  <p style={{ fontSize: 11, color: '#888' }}>Grade {d.grade} · {d.batteryHealth}% battery</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>NPR {d.price.toLocaleString()}</p>
              </label>
            ))}
          </div>
          {selectedDevice && (
            <div className="mt-3 p-2.5 rounded-[8px] flex items-center gap-2" style={{ background: '#E1F5EE', border: '0.5px solid #c8ead9' }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={warrantyExtended}
                  onChange={(e) => setWarrantyExtended(e.target.checked)}
                  style={{ accentColor: '#1D9E75' }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F6E56' }}>
                  Add Extended Warranty (+NPR 1,500)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Buyer info */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>Buyer Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Full Name *', value: buyerName, set: setBuyerName, type: 'text', placeholder: 'Ram Sharma', required: true },
              { label: 'Phone *', value: buyerPhone, set: setBuyerPhone, type: 'tel', placeholder: '98XXXXXXXX', required: true },
              { label: 'Email', value: buyerEmail, set: setBuyerEmail, type: 'email', placeholder: 'ram@example.com', required: false },
            ].map(({ label, value, set, type, placeholder, required }) => (
              <div key={label} className={label === 'Full Name *' ? 'sm:col-span-2' : ''}>
                <label style={labelStyle}>{label}</label>
                <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} required={required} style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label style={labelStyle}>Delivery Address *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ward, area, landmark" required style={inputStyle}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>Payment</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="cod">Cash on Delivery</option>
                <option value="esewa">eSewa</option>
                <option value="khalti">Khalti</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as 'pending' | 'paid')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="pending">Pending (Unpaid)</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label style={labelStyle}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal admin notes..." rows={2}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'} />
          </div>
        </div>

        {/* Summary */}
        {selectedDevice && (
          <div className="rounded-[14px] p-4" style={{ background: '#f4faf7', border: '0.5px solid #c8ead9' }}>
            <div className="flex justify-between text-sm mb-1.5" style={{ color: '#666' }}>
              <span>{selectedDevice.model} {selectedDevice.storage}</span>
              <span>NPR {selectedDevice.price.toLocaleString()}</span>
            </div>
            {warrantyExtended && (
              <div className="flex justify-between text-sm mb-1.5" style={{ color: '#666' }}>
                <span>Extended Warranty</span><span>NPR 1,500</span>
              </div>
            )}
            <div className="flex justify-between font-bold" style={{ color: '#060d0a', fontSize: 15, borderTop: '0.5px solid #c8ead9', paddingTop: 8, marginTop: 4 }}>
              <span>Total</span><span>NPR {total.toLocaleString()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !deviceId}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px]"
          style={{
            background: !deviceId || submitting ? '#f0f0ee' : '#060d0a',
            color: !deviceId || submitting ? '#aaa' : '#fff',
            fontSize: 14, fontWeight: 700, border: 'none', cursor: deviceId ? 'pointer' : 'not-allowed',
          }}
        >
          {submitting ? 'Creating…' : <><span>Create Order</span> <ArrowRight size={15} /></>}
        </button>
      </form>
    </div>
  )
}
