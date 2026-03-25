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

// Demo orders for UI
const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1', orderNumber: 'INX001', buyerName: 'Ram Sharma', buyerPhone: '9841234567',
    buyerEmail: 'ram@example.com', deliveryAddress: 'Thamel, Ward 26', city: 'Kathmandu',
    paymentMethod: 'esewa', paymentStatus: 'paid', amount: 43500, warrantyExtended: false,
    status: 'confirmed', device: { deviceId: '3', model: 'iPhone 13', storage: '128GB', grade: 'B', price: 43500 },
    createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'ord-2', orderNumber: 'INX002', buyerName: 'Sita Thapa', buyerPhone: '9800000001',
    buyerEmail: 'sita@example.com', deliveryAddress: 'Lazimpat, Ward 2', city: 'Kathmandu',
    paymentMethod: 'khalti', paymentStatus: 'paid', amount: 68000, warrantyExtended: true,
    status: 'shipped', device: { deviceId: '2', model: 'iPhone 14', storage: '128GB', grade: 'A', price: 68000 },
    createdAt: '2024-01-19T09:00:00Z', updatedAt: '2024-01-19T12:00:00Z',
  },
  {
    id: 'ord-3', orderNumber: 'INX003', buyerName: 'Hari Bahadur', buyerPhone: '9855555555',
    deliveryAddress: 'Lakeside, Ward 5', city: 'Pokhara',
    paymentMethod: 'cod', paymentStatus: 'pending', amount: 29000, warrantyExtended: false,
    status: 'pending', device: { deviceId: '5', model: 'iPhone 12', storage: '64GB', grade: 'B', price: 29000 },
    createdAt: '2024-01-18T08:00:00Z', updatedAt: '2024-01-18T08:00:00Z',
  },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

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

      {paged.length === 0 ? (
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
