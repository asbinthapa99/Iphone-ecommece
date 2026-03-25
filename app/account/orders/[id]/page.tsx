'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ArrowLeft, Package, MapPin, CreditCard, ShieldCheck } from 'lucide-react'
import { PaymentBadges } from '@/components/ui/PaymentBadges'
import type { Order, OrderStatus, PaymentStatus } from '@/types'

const STATUS_STYLES: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  pending:    { bg: '#fefce8', color: '#a16207', label: 'Pending' },
  confirmed:  { bg: '#dbeafe', color: '#1d4ed8', label: 'Confirmed' },
  processing: { bg: '#ede9fe', color: '#6d28d9', label: 'Processing' },
  shipped:    { bg: '#e0f2fe', color: '#0369a1', label: 'Shipped' },
  delivered:  { bg: '#dcfce7', color: '#15803d', label: 'Delivered' },
  completed:  { bg: '#E1F5EE', color: '#0F6E56', label: 'Completed' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' },
}
const PAYMENT_STYLES: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#fefce8', color: '#a16207', label: 'Unpaid' },
  paid:     { bg: '#E1F5EE', color: '#0F6E56', label: 'Paid' },
  failed:   { bg: '#fee2e2', color: '#dc2626', label: 'Failed' },
  refunded: { bg: '#f3f4f6', color: '#6b7280', label: 'Refunded' },
}

const TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Order placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'processing', label: 'Being processed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'completed', label: 'Completed' },
]
const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, completed: 5, cancelled: -1,
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [user, id])

  if (loading || fetching) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="space-y-3">
          <div className="shimmer rounded-[16px]" style={{ height: 140 }} />
          <div className="shimmer rounded-[16px]" style={{ height: 200 }} />
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8 text-center">
        <p style={{ color: '#888' }}>Order not found.</p>
        <Link href="/account/orders" style={{ color: '#1D9E75', fontSize: 13 }}>← Back to orders</Link>
      </main>
    )
  }

  const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
  const payment = PAYMENT_STYLES[order.paymentStatus] ?? PAYMENT_STYLES.pending
  const currentStep = STATUS_INDEX[order.status] ?? 0

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/account/orders"
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 44, height: 44, border: '0.5px solid #e0e0dc', background: '#fff' }}
        >
          <ArrowLeft size={15} color="#444" />
        </Link>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#060d0a' }}>Order #{order.orderNumber}</h1>
          <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{new Date(order.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex gap-2 mb-4">
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: status.bg, color: status.color }}>{status.label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, background: payment.bg, color: payment.color }}>{payment.label}</span>
      </div>

      {/* Order Timeline */}
      {order.status !== 'cancelled' && (
        <div
          className="rounded-[16px] p-4 mb-4"
          style={{ border: '0.5px solid #ebebeb', background: '#fff' }}
        >
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                right: 12,
                height: 2,
                background: '#f0f0ee',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                height: 2,
                width: `${(currentStep / (TIMELINE.length - 1)) * 100}%`,
                background: '#1D9E75',
                zIndex: 1,
                transition: 'width 0.6s ease',
              }}
            />
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep
              return (
                <div key={step.status} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: done ? '#1D9E75' : '#f0f0ee',
                      border: done ? '2px solid #1D9E75' : '2px solid #e0e0dc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <p style={{ fontSize: 9, color: done ? '#1D9E75' : '#aaa', textAlign: 'center', maxWidth: 48, fontWeight: done ? 600 : 400, lineHeight: 1.3 }}>
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Device */}
      <div
        className="rounded-[16px] p-4 mb-4"
        style={{ border: '0.5px solid #ebebeb', background: '#fff' }}
      >
        <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 10 }}>Device</p>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-[10px] shrink-0"
            style={{ width: 50, height: 50, background: '#f4f4f0' }}
          >
            <Package size={20} color="#888" />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>{order.device.model} {order.device.storage}</p>
            <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Grade {order.device.grade} · NPR {order.amount.toLocaleString()}</p>
            {order.warrantyExtended && (
              <div className="flex items-center gap-1 mt-1.5">
                <ShieldCheck size={10} color="#1D9E75" />
                <span style={{ fontSize: 10, color: '#1D9E75', fontWeight: 600 }}>Extended warranty included</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div
        className="rounded-[16px] p-4 mb-4"
        style={{ border: '0.5px solid #ebebeb', background: '#fff' }}
      >
        <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 10 }}>Delivery</p>
        <div className="flex items-start gap-2">
          <MapPin size={14} color="#aaa" className="shrink-0 mt-0.5" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{order.buyerName}</p>
            <p style={{ fontSize: 12, color: '#888', marginTop: 2, lineHeight: 1.5 }}>{order.deliveryAddress}, {order.city}</p>
            <p style={{ fontSize: 12, color: '#888' }}>{order.buyerPhone}</p>
          </div>
        </div>
        {order.trackingNumber && (
          <div
            className="mt-3 rounded-[8px] p-2.5"
            style={{ background: '#f4faf7', border: '0.5px solid #c8ead9' }}
          >
            <p style={{ fontSize: 10, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tracking</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F6E56', fontFamily: 'monospace', marginTop: 2 }}>{order.trackingNumber}</p>
          </div>
        )}
      </div>

      {/* Payment */}
      <div
        className="rounded-[16px] p-4 mb-5"
        style={{ border: '0.5px solid #ebebeb', background: '#fff' }}
      >
        <p style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 10 }}>Payment</p>
        <div className="flex items-center gap-2">
          <CreditCard size={14} color="#aaa" />
          <p style={{ fontSize: 13, color: '#444' }}>
            {order.paymentMethod === 'esewa' ? 'eSewa' : order.paymentMethod === 'khalti' ? 'Khalti' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
          </p>
        </div>
        {order.paymentRef && (
          <p style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', marginTop: 4 }}>Ref: {order.paymentRef}</p>
        )}
      </div>

      {/* Payment methods */}
      <div
        className="rounded-[12px] p-3 flex items-center justify-center"
        style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}
      >
        <PaymentBadges label={true} showCod={true} compact={true} />
      </div>
    </main>
  )
}
