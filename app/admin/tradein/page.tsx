'use client'

import { useState } from 'react'
import { RefreshCw, MessageCircle, Check, X } from 'lucide-react'
import type { TradeInStatus } from '@/types'

interface TradeIn {
  id: string
  model: string
  storage: string
  condition: 'good' | 'fair' | 'cracked' | 'other'
  batteryHealth: number
  quotedPrice: number
  status: TradeInStatus
  contactPhone: string
  createdAt: string
}

const DEMO_TRADEINS: TradeIn[] = [
  { id: 't1', model: 'iPhone 13', storage: '128GB', condition: 'good', batteryHealth: 88, quotedPrice: 28500, status: 'pending', contactPhone: '9841234567', createdAt: '2024-01-20T09:00:00Z' },
  { id: 't2', model: 'iPhone 12 Pro', storage: '256GB', condition: 'fair', batteryHealth: 79, quotedPrice: 22000, status: 'accepted', contactPhone: '9855555555', createdAt: '2024-01-19T14:00:00Z' },
  { id: 't3', model: 'iPhone 14', storage: '128GB', condition: 'cracked', batteryHealth: 85, quotedPrice: 18000, status: 'rejected', contactPhone: '9800000001', createdAt: '2024-01-18T11:00:00Z' },
]

const STATUS_CONFIG: Record<TradeInStatus, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fefce8', color: '#a16207', label: 'Pending' },
  reviewing: { bg: '#dbeafe', color: '#1d4ed8', label: 'Reviewing' },
  quoted:    { bg: '#ede9fe', color: '#6d28d9', label: 'Quoted' },
  accepted:  { bg: '#E1F5EE', color: '#0F6E56', label: 'Accepted' },
  rejected:  { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  completed: { bg: '#f0fdf4', color: '#15803d', label: 'Completed' },
  expired:   { bg: '#f3f4f6', color: '#6b7280', label: 'Expired' },
}

const CONDITION_LABEL = { good: 'Good ✨', fair: 'Fair 👍', cracked: 'Cracked 💔', other: 'Other ❓' }

export default function AdminTradeInPage() {
  const [items, setItems] = useState<TradeIn[]>(DEMO_TRADEINS)
  const [filter, setFilter] = useState<TradeInStatus | ''>('')

  const filtered = filter ? items.filter((t) => t.status === filter) : items

  const updateStatus = (id: string, status: TradeInStatus) => {
    setItems((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#060d0a', letterSpacing: '-0.4px' }}>Trade-ins</h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{filtered.length} quotes</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: '', label: 'All' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as TradeInStatus | '')}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              border: `0.5px solid ${filter === value ? '#1D9E75' : '#e0e0dc'}`,
              background: filter === value ? '#E1F5EE' : '#fff',
              color: filter === value ? '#0F6E56' : '#888',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const status = STATUS_CONFIG[item.status]
          return (
            <div key={item.id} className="rounded-[14px] p-4" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RefreshCw size={13} color="#1D9E75" />
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a' }}>{item.model} {item.storage}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#888' }}>
                    {CONDITION_LABEL[item.condition]} · Battery {item.batteryHealth}%
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#1D9E75' }}>NPR {item.quotedPrice.toLocaleString()}</p>
                  <span
                    style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: status.bg, color: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <p style={{ fontSize: 11, color: '#888' }}>
                  📞 {item.contactPhone} · {new Date(item.createdAt).toLocaleDateString('en-NP')}
                </p>
                <div className="flex items-center gap-2 ml-auto">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, 'accepted')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]"
                        style={{ background: '#E1F5EE', color: '#0F6E56', fontSize: 11, fontWeight: 600, border: '0.5px solid #c8ead9', cursor: 'pointer' }}
                      >
                        <Check size={11} /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]"
                        style={{ background: '#fee2e2', color: '#dc2626', fontSize: 11, fontWeight: 600, border: '0.5px solid #fca5a5', cursor: 'pointer' }}
                      >
                        <X size={11} /> Reject
                      </button>
                    </>
                  )}
                  <a
                    href={`https://wa.me/${item.contactPhone}?text=${encodeURIComponent(`Hi! Regarding your trade-in for ${item.model} — we'd like to proceed. Our quote is NPR ${item.quotedPrice.toLocaleString()}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px]"
                    style={{ background: '#f4f4f0', color: '#444', fontSize: 11, fontWeight: 600, border: '0.5px solid #e0e0dc', textDecoration: 'none' }}
                  >
                    <MessageCircle size={11} /> Message
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center rounded-[14px] py-14" style={{ background: '#fff', border: '0.5px solid #ebebeb' }}>
          <RefreshCw size={28} color="#ddd" className="mx-auto mb-3" />
          <p style={{ fontSize: 14, color: '#888' }}>No trade-in requests</p>
        </div>
      )}
    </div>
  )
}
