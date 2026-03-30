'use client'

import { useEffect, useState } from 'react'
import type { OrderStatus } from '@/types'
import { EmailNotificationToast, type NotificationEntry } from '@/components/admin/EmailNotificationToast'

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
  autoSave?: boolean
  disabled?: boolean
  onStatusChange?: (status: OrderStatus) => void
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
  autoSave = true,
  disabled = false,
  onStatusChange,
}: Props) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [saving, setSaving] = useState(false)
  const [emailToast, setEmailToast] = useState<{ notifications: NotificationEntry[] } | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const handleChange = async (newStatus: OrderStatus) => {
    if (saving || disabled || newStatus === status) return

    if (!autoSave) {
      setStatus(newStatus)
      onStatusChange?.(newStatus)
      return
    }

    const previousStatus = status
    setSaving(true)
    setStatus(newStatus)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json().catch(() => ({} as Record<string, unknown>))
      if (!res.ok) {
        const message =
          typeof data.error === 'string' && data.error.trim()
            ? data.error
            : 'Failed to update order status'
        throw new Error(message)
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
        setEmailToast({ notifications: toastEntries })
      }
    } catch (err) {
      setStatus(previousStatus)
      const message = err instanceof Error ? err.message : 'Failed to update order status'
      setErrorToast(message)
      setTimeout(() => setErrorToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const colors = STATUS_COLORS[status]

  return (
    <>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={saving || disabled}
        style={{
          padding: '4px 8px',
          borderRadius: 8,
          border: `1px solid ${colors.color}30`,
          background: colors.bg,
          color: colors.color,
          fontSize: 11,
          fontWeight: 600,
          cursor: saving || disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Email notification toast */}
      {emailToast && (
        <EmailNotificationToast
          notifications={emailToast.notifications}
          onClose={() => setEmailToast(null)}
        />
      )}

      {/* Error toast */}
      {errorToast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '12px 20px',
            background: '#dc2626',
            color: '#fff',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(220,38,38,0.3)',
            animation: 'emailRowSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {errorToast}
        </div>
      )}
    </>
  )
}

