'use client'

import { useState } from 'react'
import type { OrderStatus } from '@/types'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  pending:    { bg: '#fefce8', color: '#a16207' },
  confirmed:  { bg: '#dbeafe', color: '#1d4ed8' },
  processing: { bg: '#ede9fe', color: '#6d28d9' },
  shipped:    { bg: '#e0f2fe', color: '#0369a1' },
  delivered:  { bg: '#dcfce7', color: '#15803d' },
  completed:  { bg: '#E1F5EE', color: '#0F6E56' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
}

interface Props {
  orderId: string
  currentStatus: OrderStatus
}

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [saving, setSaving] = useState(false)

  const handleChange = async (newStatus: OrderStatus) => {
    setSaving(true)
    setStatus(newStatus)
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch {}
    setSaving(false)
  }

  const colors = STATUS_COLORS[status]

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      style={{
        padding: '4px 8px',
        borderRadius: 8,
        border: `1px solid ${colors.color}30`,
        background: colors.bg,
        color: colors.color,
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
