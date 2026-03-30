'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Mail, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react'

/* ─── Friendly label map ─── */
const EMAIL_LABELS: Record<string, { label: string; icon: string }> = {
  orderConfirmedEmail:     { label: 'Order Confirmed',     icon: '✅' },
  paymentSuccessEmail:     { label: 'Payment Received',    icon: '💳' },
  processingEmail:         { label: 'Order Processing',    icon: '⚙️' },
  deliveryInProcessEmail:  { label: 'Shipped / In Transit', icon: '🚚' },
  deliveredEmail:          { label: 'Order Delivered',      icon: '📦' },
  cancelledEmail:          { label: 'Order Cancelled',      icon: '❌' },
}

export type NotificationEntry = {
  key: string
  attempted: boolean
  sent: boolean
  error?: string
}

interface Props {
  notifications: NotificationEntry[]
  recipientEmail?: string
  onClose: () => void
}

export function EmailNotificationToast({ notifications, recipientEmail, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 6000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = useCallback(() => {
    setExiting(true)
    setTimeout(() => onClose(), 350)
  }, [onClose])

  const allSent = notifications.every((n) => n.sent)
  const allFailed = notifications.every((n) => !n.sent)
  const hasMixed = !allSent && !allFailed

  const headerColor = allSent ? '#0F6E56' : allFailed ? '#dc2626' : '#a16207'
  const headerBg = allSent ? '#E1F5EE' : allFailed ? '#FEF2F2' : '#FFFBEB'
  const headerIcon = allSent ? '✉️' : allFailed ? '⚠️' : '📬'
  const headerText = allSent
    ? `Email${notifications.length > 1 ? 's' : ''} Sent Successfully`
    : allFailed
    ? `Email${notifications.length > 1 ? 's' : ''} Failed to Send`
    : 'Some Emails Failed'

  return (
    <>
      {/* Subtle backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 9998,
          opacity: visible && !exiting ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
        onClick={handleClose}
      />

      {/* Toast card */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: visible && !exiting
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -46%) scale(0.95)',
          opacity: visible && !exiting ? 1 : 0,
          zIndex: 9999,
          width: 'min(420px, calc(100vw - 32px))',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: headerBg,
            padding: '20px 24px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            position: 'relative',
          }}
        >
          {/* Animated icon circle */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxShadow: `0 2px 8px ${headerColor}20`,
              animation: visible ? 'emailIconPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both' : undefined,
            }}
          >
            {headerIcon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: headerColor,
                letterSpacing: '-0.3px',
              }}
            >
              {headerText}
            </p>
            {recipientEmail && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 12,
                  color: headerColor,
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Mail size={11} />
                {recipientEmail}
              </p>
            )}
          </div>
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 'none',
              background: `${headerColor}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${headerColor}25`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${headerColor}12`}
          >
            <X size={14} color={headerColor} />
          </button>
        </div>

        {/* Notification list */}
        <div style={{ padding: '12px 16px 16px' }}>
          {notifications.map((n, i) => {
            const meta = EMAIL_LABELS[n.key] ?? { label: n.key, icon: '📧' }
            return (
              <div
                key={n.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  marginBottom: i < notifications.length - 1 ? 6 : 0,
                  background: n.sent ? '#f0faf6' : '#fef2f2',
                  border: `0.5px solid ${n.sent ? '#d1e7dd' : '#fecaca'}`,
                  animation: visible ? `emailRowSlide 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.08}s both` : undefined,
                }}
              >
                {/* Status icon */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 15,
                  }}
                >
                  {meta.icon}
                </div>
                {/* Label + error */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#060d0a' }}>
                    {meta.label}
                  </p>
                  {!n.sent && n.error && (
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: 11,
                        color: '#dc2626',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {n.error}
                    </p>
                  )}
                </div>
                {/* Sent/Failed badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: n.sent ? '#0F6E5612' : '#dc262612',
                    color: n.sent ? '#0F6E56' : '#dc2626',
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {n.sent ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  {n.sent ? 'Sent' : 'Failed'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer with timestamp */}
        <div
          style={{
            padding: '0 16px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {/* Auto-dismiss progress bar */}
          <div
            style={{
              height: 3,
              width: 60,
              borderRadius: 2,
              background: '#f0f0ee',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 2,
                background: allSent ? '#1D9E75' : allFailed ? '#dc2626' : '#eab308',
                animation: 'emailProgress 6s linear forwards',
              }}
            />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes emailIconPop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes emailRowSlide {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes emailProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </>
  )
}
