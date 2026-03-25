'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { ArrowLeft, Package, ChevronRight } from 'lucide-react'
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

export default function MyOrdersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/account/orders')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders ?? [])
        }
      } catch {
        // ignore
      } finally {
        setFetching(false)
      }
    }
    fetchOrders()
  }, [user])

  if (loading || fetching) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[14px] shimmer" style={{ height: 88 }} />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/account"
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 44, height: 44, border: '0.5px solid #e0e0dc', background: '#fff' }}
        >
          <ArrowLeft size={15} color="#444" />
        </Link>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>
            My Orders
          </h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{orders.length} orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center rounded-[16px] py-14"
          style={{ border: '0.5px solid #ebebeb', background: '#fafaf8' }}
        >
          <Package size={32} color="#ddd" className="mx-auto mb-3" />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>No orders yet</p>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Your purchases will appear here</p>
          <Link
            href="/phones"
            className="inline-block mt-4 px-4 py-2 rounded-[8px]"
            style={{ background: '#060d0a', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
          >
            Browse phones
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
            const payment = PAYMENT_STYLES[order.paymentStatus] ?? PAYMENT_STYLES.pending
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center gap-3 px-4 py-4 rounded-[16px]"
                style={{ border: '0.5px solid #ebebeb', background: '#fff', textDecoration: 'none' }}
              >
                <div
                  className="flex items-center justify-center rounded-[10px] shrink-0"
                  style={{ width: 44, height: 44, background: '#f4f4f0' }}
                >
                  <Package size={18} color="#888" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>
                    {order.device.model} {order.device.storage}
                  </p>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                    #{order.orderNumber} · NPR {order.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                    <span
                      style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: payment.bg, color: payment.color }}
                    >
                      {payment.label}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} color="#ccc" />
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
