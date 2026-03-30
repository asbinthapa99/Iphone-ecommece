'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Package, MapPin, CreditCard,
  Truck, Save, MessageCircle,
} from 'lucide-react'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'
import { EmailNotificationToast, type NotificationEntry } from '@/components/admin/EmailNotificationToast'
import type { Order, OrderStatus, PaymentStatus } from '@/types'

const PAYMENT_COLORS: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#fefce8', color: '#a16207', label: 'Unpaid' },
  paid:     { bg: '#E1F5EE', color: '#0F6E56', label: 'Paid' },
  failed:   { bg: '#fee2e2', color: '#dc2626', label: 'Failed' },
  refunded: { bg: '#f3f4f6', color: '#6b7280', label: 'Refunded' },
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailToast, setEmailToast] = useState<{ notifications: NotificationEntry[]; recipientEmail?: string } | null>(null)
  const saveLockRef = useRef(false)

  useEffect(() => {
    const run = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.error ?? 'Failed to load order')
        }
        const loadedOrder = data.order as Order
        setOrder(loadedOrder)
        setTracking(loadedOrder.trackingNumber ?? '')
        setAdminNotes(loadedOrder.notes ?? '')
        setStatus(loadedOrder.status as OrderStatus)
        setPaymentStatus(loadedOrder.paymentStatus)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const handleSave = async () => {
    if (!order || saving || saveLockRef.current) return
    saveLockRef.current = true
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber: tracking, notes: adminNotes, paymentStatus }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to update order')
      }
      if (data.order) {
        const nextOrder = data.order as Order
        setOrder(nextOrder)
        setStatus(nextOrder.status as OrderStatus)
      }

      const notifications = (data.notifications ?? {}) as Record<string, { attempted?: boolean; sent?: boolean; error?: string }>
      const attemptedNotifications = Object.entries(notifications).filter(([, n]) => n?.attempted)
      if (attemptedNotifications.length > 0) {
        const toastEntries: NotificationEntry[] = attemptedNotifications.map(([key, n]) => ({
          key,
          attempted: !!n.attempted,
          sent: !!n.sent,
          error: n.error,
        }))
        setEmailToast({ notifications: toastEntries, recipientEmail: order?.buyerEmail })
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update order')
    } finally {
      setSaving(false)
      saveLockRef.current = false
    }
  }

  if (loading) {
    return <div className="text-[13px]" style={{ color: '#888' }}>Loading order...</div>
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px]" style={{ color: '#888' }}>{error ?? 'Order not found.'}</p>
        <Link href="/admin/orders" className="text-[12px] mt-2 block" style={{ color: '#1D9E75' }}>
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 36, height: 36, border: '0.5px solid #e0e0dc', background: '#fff' }}
        >
          <ArrowLeft size={15} color="#444" />
        </Link>
        <div className="flex-1">
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>
            Order #{order.orderNumber}
          </h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
            {new Date(order.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          style={{ padding: '7px 14px', borderRadius: 8, border: '0.5px solid #e0e0dc', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#444' }}
          className="hidden sm:block"
        >
          Print
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="rounded-[14px] p-4" style={{ background: '#fff5f5', border: '0.5px solid #fecaca' }}>
              <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
            </div>
          )}
          {/* Order info */}
          <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 14 }}>Order Info</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ['Customer', order.buyerName],
                ['Phone', order.buyerPhone],
                ['Email', order.buyerEmail ?? '—'],
                ['Payment', order.paymentMethod === 'esewa' ? 'eSewa' : order.paymentMethod === 'khalti' ? 'Khalti' : order.paymentMethod === 'cod' ? 'COD' : 'Bank'],
                ['City', order.city],
                ['Warranty', order.warrantyExtended ? 'Extended (12mo)' : 'Standard (6mo)'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#060d0a', marginTop: 2 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Device */}
          <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <div className="px-4 py-3" style={{ borderBottom: '0.5px solid #f0f0ee' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Device</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center rounded-[10px] shrink-0" style={{ width: 48, height: 48, background: '#f4f4f0' }}>
                <Package size={20} color="#888" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>{order.device.model} {order.device.storage}</p>
                <p style={{ fontSize: 12, color: '#888' }}>Grade {order.device.grade}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#060d0a' }}>NPR {order.device.price.toLocaleString()}</p>
            </div>
            <div className="px-4 pb-3" style={{ borderTop: '0.5px solid #f0f0ee' }}>
              {[
                ['Device', `NPR ${order.device.price.toLocaleString()}`],
                ...(order.warrantyExtended ? [['Extended Warranty', 'NPR 1,500']] : []),
                ['Total', `NPR ${order.amount.toLocaleString()}`],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className="flex justify-between py-2"
                  style={{
                    borderTop: i > 0 ? '0.5px solid #f4f4f0' : undefined,
                    fontWeight: i === arr.length - 1 ? 700 : 400,
                    color: i === arr.length - 1 ? '#060d0a' : '#888',
                    fontSize: i === arr.length - 1 ? 14 : 12,
                  }}
                >
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={13} color="#1D9E75" />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Delivery Address</p>
            </div>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
              {order.buyerName}<br />
              {order.deliveryAddress}<br />
              {order.city}, Nepal
            </p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{order.buyerPhone}</p>
          </div>

          {/* Customer notes */}
          {order.notes && (
            <div className="rounded-[14px] p-4" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Customer Notes</p>
              <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right panel — actions */}
        <div className="space-y-4">
          {/* Status control */}
          <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginBottom: 12 }}>Order Status</p>
            <OrderStatusSelect
              orderId={order.id}
              currentStatus={status}
              autoSave={false}
              disabled={saving}
              onStatusChange={setStatus}
            />

            <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a', marginTop: 14, marginBottom: 8 }}>Payment Status</p>
            <div className="flex items-center gap-2 flex-wrap">
              {(['pending', 'paid', 'failed', 'refunded'] as PaymentStatus[]).map((ps) => (
                <button
                  key={ps}
                  onClick={() => setPaymentStatus(ps)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: `1px solid ${paymentStatus === ps ? PAYMENT_COLORS[ps].color + '50' : '#e0e0dc'}`,
                    background: paymentStatus === ps ? PAYMENT_COLORS[ps].bg : '#fff',
                    color: paymentStatus === ps ? PAYMENT_COLORS[ps].color : '#888',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {PAYMENT_COLORS[ps].label}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking */}
          <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <div className="flex items-center gap-2 mb-3">
              <Truck size={13} color="#1D9E75" />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Tracking Number</p>
            </div>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. NP123456789"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '0.5px solid #e0e0dc',
                fontSize: 13,
                fontFamily: 'monospace',
                color: '#060d0a',
                background: '#fafaf8',
                outline: 'none',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'}
            />
          </div>

          {/* Admin notes */}
          <div className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={13} color="#1D9E75" />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#060d0a' }}>Admin Notes</p>
            </div>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '0.5px solid #e0e0dc',
                fontSize: 13,
                color: '#060d0a',
                background: '#fafaf8',
                outline: 'none',
                resize: 'none',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px]"
            style={{
              background: saved ? '#1D9E75' : '#060d0a',
              color: saved ? '#060d0a' : '#fff',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${order.buyerPhone}?text=${encodeURIComponent(`Hi ${order.buyerName}! Your Inexa order #${order.orderNumber} has been confirmed. We will deliver to ${order.city} soon.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px]"
            style={{ background: '#f4f4f0', color: '#444', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
          >
            <MessageCircle size={13} />
            Message customer
          </a>
        </div>
      </div>
      {/* Email notification toast */}
      {emailToast && (
        <EmailNotificationToast
          notifications={emailToast.notifications}
          recipientEmail={emailToast.recipientEmail}
          onClose={() => setEmailToast(null)}
        />
      )}
    </div>
  )
}
