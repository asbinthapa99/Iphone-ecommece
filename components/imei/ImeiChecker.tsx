'use client'

import { useState } from 'react'
import { Search, ShieldCheck, ShieldX, Loader2 } from 'lucide-react'

export function ImeiChecker() {
  const [imei, setImei] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    status: 'clean' | 'blocked' | 'stolen'
    model?: string
    icloudLocked?: boolean
  } | null>(null)

  const handleCheck = async () => {
    if (imei.length < 15) return
    setLoading(true)
    setResult(null)
    // Simulate API call — replace with real NTA API
    await new Promise((r) => setTimeout(r, 1200))
    setResult({ status: 'clean', model: 'Apple iPhone', icloudLocked: false })
    setLoading(false)
  }

  return (
    <div
      className="rounded-[16px] p-5"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '0.5px solid rgba(255,255,255,0.9)',
      }}
    >
      <p
        className="text-[11px] font-medium uppercase tracking-widest mb-1"
        style={{ color: '#1D9E75' }}
      >
        Free IMEI Check
      </p>
      <p
        className="text-[18px] font-medium tracking-tight mb-4"
        style={{ color: '#060d0a' }}
      >
        Verify any iPhone before buying
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={16}
          placeholder="Enter 15-digit IMEI"
          value={imei}
          onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
          className="flex-1 text-[13px] px-3 py-2.5 rounded-[8px] outline-none"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '0.04em',
            background: '#f4f4f0',
            border: '0.5px solid #e0e0dc',
            color: '#060d0a',
          }}
        />
        <button
          onClick={handleCheck}
          disabled={imei.length < 15 || loading}
          className="flex items-center gap-1.5 px-4 text-[12px] font-medium rounded-[8px] transition-opacity disabled:opacity-40"
          style={{ background: '#060d0a', color: '#1D9E75' }}
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Search size={12} />
          )}
          Check
        </button>
      </div>

      <p className="text-[10px] mt-2" style={{ color: '#aaa' }}>
        Free · No account needed · Works for any seller
      </p>

      {result && (
        <div
          className="mt-4 p-3 rounded-[10px] flex items-center gap-3"
          style={{
            background: result.status === 'clean' ? '#f4faf7' : '#fef2f2',
            border: `0.5px solid ${result.status === 'clean' ? '#c8ead9' : '#fecaca'}`,
            animation: 'slideUp 0.25s ease',
          }}
        >
          {result.status === 'clean' ? (
            <ShieldCheck size={18} color="#0F6E56" />
          ) : (
            <ShieldX size={18} color="#dc2626" />
          )}
          <div>
            <p
              className="text-[12px] font-medium"
              style={{ color: result.status === 'clean' ? '#0F6E56' : '#dc2626' }}
            >
              {result.status === 'clean' ? 'IMEI Clean — Safe to buy' : 'IMEI Blocked'}
            </p>
            {result.model && (
              <p className="text-[10px]" style={{ color: '#888' }}>
                {result.model} ·{' '}
                {result.icloudLocked ? 'iCloud Locked ⚠' : 'iCloud Free'}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
