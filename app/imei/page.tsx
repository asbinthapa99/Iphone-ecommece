'use client'

import { useState } from 'react'
import { ShieldCheck, Search, CheckCircle2, XCircle, AlertCircle, Lock, Loader2 } from 'lucide-react'
import type { ImeiCheckResult } from '@/types'

export default function ImeiPage() {
  const [imei, setImei] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImeiCheckResult | null>(null)
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch('/api/imei/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Check failed. Try again.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = result ? {
    clean:   { icon: CheckCircle2, color: '#1D9E75', bg: '#E1F5EE', border: '#c8ead9', label: 'Clean — Safe to buy' },
    blocked: { icon: XCircle, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Blocked — Do NOT buy' },
    stolen:  { icon: XCircle, color: '#dc2626', bg: '#fee2e2', border: '#fca5a5', label: 'Stolen — Do NOT buy' },
    unknown: { icon: AlertCircle, color: '#a16207', bg: '#fefce8', border: '#fde68a', label: 'Unknown status' },
  }[result.status] : null

  return (
    <main className="max-w-lg mx-auto px-4 py-10 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{ width: 56, height: 56, background: '#E1F5EE' }}
        >
          <ShieldCheck size={26} color="#1D9E75" />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.6px', marginBottom: 8 }}>
          Free IMEI Checker
        </h1>
        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
          Check any iPhone&apos;s IMEI before buying.
          Works for phones from any seller — Hamrobazar, OLX, or anywhere.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleCheck} className="mb-6">
        <div
          className="flex items-center gap-2 rounded-[14px] p-1.5"
          style={{ border: '1px solid #e0e0dc', background: '#fff' }}
        >
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 17))}
            placeholder="Enter 15-digit IMEI number"
            maxLength={17}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              fontSize: 15,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              color: '#060d0a',
              background: 'transparent',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={imei.length < 15 || loading}
            className="flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 shrink-0"
            style={{
              background: imei.length >= 15 && !loading ? '#060d0a' : '#f0f0ee',
              color: imei.length >= 15 && !loading ? '#fff' : '#aaa',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: imei.length >= 15 ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {loading ? 'Checking…' : 'Check'}
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#aaa', marginTop: 6, textAlign: 'center' }}>
          Dial *#06# on any phone to find the IMEI
        </p>
      </form>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 rounded-[12px] p-3 mb-4 animate-fadeUp"
          style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}
        >
          <AlertCircle size={14} color="#dc2626" />
          <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && statusConfig && (
        <div
          className="rounded-[16px] p-5 animate-scaleIn"
          style={{ background: statusConfig.bg, border: `1px solid ${statusConfig.border}` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <statusConfig.icon size={22} color={statusConfig.color} />
            <p style={{ fontSize: 15, fontWeight: 700, color: statusConfig.color }}>
              {statusConfig.label}
            </p>
          </div>
          <div className="space-y-2">
            {[
              ['IMEI', result.imei],
              ['Model', result.model ?? 'Unknown'],
              ['Region', result.regionLock ?? 'Unknown'],
              ['iCloud Lock', result.icloudLocked === true ? 'Locked ⚠️' : result.icloudLocked === false ? 'Unlocked ✓' : 'Unknown'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between rounded-[8px] px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.6)' }}
              >
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#060d0a', fontFamily: label === 'IMEI' ? 'monospace' : 'inherit' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          {result.icloudLocked && (
            <div
              className="flex items-center gap-2 mt-3 rounded-[8px] p-2.5"
              style={{ background: '#fefce8', border: '0.5px solid #fde68a' }}
            >
              <Lock size={12} color="#a16207" />
              <p style={{ fontSize: 11, color: '#a16207', fontWeight: 600 }}>
                iCloud locked phones cannot be activated — avoid purchasing.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Trust notes */}
      <div
        className="mt-8 rounded-[14px] p-4"
        style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: '#060d0a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Why check IMEI?
        </p>
        <div className="space-y-2.5">
          {[
            ['Verify it\'s not stolen', 'Stolen phones are blacklisted by telecom authorities'],
            ['Check iCloud lock status', 'iCloud locked phones are worthless — can\'t be used'],
            ['Confirm the model', 'Fake iPhones often show wrong model info'],
          ].map(([title, desc]) => (
            <div key={title} className="flex items-start gap-2">
              <CheckCircle2 size={13} color="#1D9E75" className="shrink-0 mt-0.5" />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#060d0a' }}>{title}</p>
                <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#aaa', marginTop: 12, textAlign: 'center' }}>
          Free forever · Works for any device · No registration needed
        </p>
      </div>
    </main>
  )
}
