'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Search, Plus, Filter } from 'lucide-react'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'
import type { Order, OrderStatus, PaymentStatus } from '@/types'

const PAYMENT_COLORS: Record<PaymentStatus, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#fefce8', color: '#a16207', label: 'Unpaid' },
  paid:     { bg: '#E1F5EE', color: '#0F6E56', label: 'Paid' },
  failed:   { bg: '#fee2e2', color: '#dc2626', label: 'Failed' },
  refunded: { bg: '#f3f4f6', color: '#6b7280', label: 'Refunded' },
}

const STATUS_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/orders?limit=200', { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.error ?? 'Failed to load orders')
        }
        setOrders(Array.isArray(data.orders) ? data.orders : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.buyerName.toLowerCase().includes(q) ||
      o.buyerPhone.includes(q) ||
      o.device.model.toLowerCase().includes(q)
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const PAGE_SIZE = 10
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Orders</h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{filtered.length} orders</p>
        </div>
        <Link
          href="/admin/orders/new"
          className="flex items-center gap-1.5 px-3 py-2 rounded-[8px]"
          style={{ background: '#060d0a', color: '#1D9E75', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
        >
          <Plus size={12} /> New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div
          className="flex items-center gap-2 rounded-[10px] px-3 flex-1"
          style={{ border: '0.5px solid #e0e0dc', background: '#fff', minWidth: 180 }}
        >
          <Search size={13} color="#aaa" />
          <input
            type="text"
            placeholder="Search orders, customers…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            style={{ flex: 1, padding: '8px 0', fontSize: 13, border: 'none', outline: 'none', background: 'transparent', color: '#060d0a' }}
          />
        </div>
        <div
          className="flex items-center gap-1.5 rounded-[10px] px-3"
          style={{ border: '0.5px solid #e0e0dc', background: '#fff' }}
        >
          <Filter size={12} color="#aaa" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ padding: '8px 4px', fontSize: 12, border: 'none', outline: 'none', background: 'transparent', color: '#444', cursor: 'pointer' }}
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div
          className="text-center rounded-[16px] py-16"
          style={{ background: '#fff', border: '0.5px solid #ebebeb' }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{error}</p>
        </div>
      ) : loading ? (
        <div
          className="text-center rounded-[16px] py-16"
          style={{ background: '#fff', border: '0.5px solid #ebebeb' }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>Loading orders...</p>
        </div>
      ) : paged.length === 0 ? (
        <div
          className="text-center rounded-[16px] py-16"
          style={{ background: '#fff', border: '0.5px solid #ebebeb' }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: '#888' }}>No orders found</p>
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
            {search || statusFilter ? 'Try adjusting your filters.' : 'Orders will appear here.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="sm:hidden space-y-3">
            {paged.map((order) => {
              const payment = PAYMENT_COLORS[order.paymentStatus]
              return (
                <div
                  key={order.id}
                  className="rounded-[14px] p-4"
                  style={{ background: '#fff', border: '0.5px solid #ebebeb' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75', textDecoration: 'none' }}
                      >
                        #{order.orderNumber}
                      </Link>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{order.buyerName} · {order.buyerPhone}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>NPR {order.amount.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: '#aaa' }}>{new Date(order.createdAt).toLocaleDateString('en-NP')}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#444', marginBottom: 8 }}>
                    {order.device.model} {order.device.storage} · Grade {order.device.grade}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status as OrderStatus} />
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: payment.bg, color: payment.color }}>
                      {payment.label}
                    </span>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]"
                      style={{ border: '0.5px solid #e0e0dc', fontSize: 11, color: '#444', textDecoration: 'none' }}
                    >
                      <Eye size={12} /> View
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop: table */}
          <div
            className="hidden sm:block rounded-[14px] overflow-hidden"
            style={{ background: '#fff', border: '0.5px solid #ebebeb' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#fafaf8', borderBottom: '0.5px solid #f0f0ee' }}>
                    {['Order', 'Customer', 'Device', 'Date', 'Status', 'Payment', 'Amount', ''].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left" style={{ fontSize: 10, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((order, i) => {
                    const payment = PAYMENT_COLORS[order.paymentStatus]
                    return (
                      <tr key={order.id} style={{ borderBottom: i < paged.length - 1 ? '0.5px solid #f4f4f0' : 'none' }}>
                        <td className="px-4 py-3">
                          <Link href={`/admin/orders/${order.id}`} style={{ fontSize: 12, fontWeight: 700, color: '#1D9E75', textDecoration: 'none' }}>
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#060d0a' }}>{order.buyerName}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>{order.buyerPhone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p style={{ fontSize: 12, color: '#444' }}>{order.device.model} {order.device.storage}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>Grade {order.device.grade}</p>
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-NP')}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusSelect orderId={order.id} currentStatus={order.status as OrderStatus} />
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: payment.bg, color: payment.color }}>
                            {payment.label}
                          </span>
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>
                          NPR {order.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]"
                            style={{ border: '0.5px solid #e0e0dc', fontSize: 11, color: '#444', textDecoration: 'none' }}
                          >
                            <Eye size={12} /> View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => setPage(page - 1)}
                  style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #e0e0dc', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#444' }}
                >
                  Previous
                </button>
              )}
              <span style={{ fontSize: 12, color: '#888' }}>Page {page} of {totalPages}</span>
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  style={{ padding: '7px 16px', borderRadius: 8, border: '0.5px solid #e0e0dc', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#444' }}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
