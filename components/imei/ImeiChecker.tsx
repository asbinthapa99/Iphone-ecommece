'use client'

import { useState } from 'react'
import { Search, ShieldCheck, ShieldX, Loader2, Smartphone } from 'lucide-react'

interface ImeiResult {
  imei: string
  valid: boolean
  brand: string | null
  model: string | null
  note: string
}

export function ImeiChecker() {
  const [imei, setImei] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImeiResult | null>(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    if (imei.length < 15) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/imei/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Check failed.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
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
      <p className="text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#1D9E75' }}>
        Free IMEI Check
      </p>
      <p className="text-[18px] font-medium tracking-tight mb-4" style={{ color: '#060d0a' }}>
        Verify any phone before buying
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={17}
          placeholder="Enter 15-digit IMEI"
          value={imei}
          onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 17))}
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
          style={{ background: '#060d0a', color: '#1D9E75', border: 'none', cursor: 'pointer' }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          Check
        </button>
      </div>

      <p className="text-[10px] mt-2" style={{ color: '#aaa' }}>
        Dial *#06# to find IMEI · Free · No account needed
      </p>

      {error && (
        <p className="text-[11px] mt-2" style={{ color: '#dc2626' }}>{error}</p>
      )}

      {result && (
        <div
          className="mt-3 p-3 rounded-[10px]"
          style={{
            background: result.valid ? '#f4faf7' : '#fff5f5',
            border: `0.5px solid ${result.valid ? '#c8ead9' : '#fca5a5'}`,
            animation: 'slideUp 0.25s ease',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {result.valid
              ? <ShieldCheck size={15} color="#1D9E75" />
              : <ShieldX size={15} color="#dc2626" />
            }
            <p className="text-[12px] font-semibold" style={{ color: result.valid ? '#0F6E56' : '#dc2626' }}>
              {result.valid ? 'Valid IMEI' : 'Invalid IMEI'}
            </p>
          </div>

          {result.valid && result.model && (
            <p className="text-[11px] flex items-center gap-1" style={{ color: '#555' }}>
              <Smartphone size={11} color="#1D9E75" />
              {result.brand} {result.model}
            </p>
          )}
          {result.valid && !result.model && (
            <p className="text-[11px]" style={{ color: '#aaa' }}>Model not identified</p>
          )}
          {!result.valid && (
            <p className="text-[11px]" style={{ color: '#888' }}>{result.note}</p>
          )}

          <p className="text-[10px] mt-2" style={{ color: '#bbb' }}>
            Format validated via Luhn · Data: GSMA TAC ·{' '}
            <a
              href="https://dotm.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1D9E75', textDecoration: 'none' }}
            >
              Stolen check: DOTM Nepal ↗
            </a>
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
