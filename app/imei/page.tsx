'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldX, Search, AlertCircle, CheckCircle2, Loader2, Smartphone, ExternalLink } from 'lucide-react'

interface ImeiResult {
  imei: string
  valid: boolean
  brand: string | null
  model: string | null
  note: string
}

export default function ImeiPage() {
  const [imei, setImei] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImeiResult | null>(null)
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
          Verify any phone&apos;s IMEI before buying — works for any seller, any brand.
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
            className="flex items-center gap-1.5 rounded-[10px] px-4 py-2.5 shrink-0 transition-colors"
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
          Dial <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>*#06#</span> on any phone to find the IMEI
        </p>
      </form>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 rounded-[12px] p-3 mb-4"
          style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}
        >
          <AlertCircle size={14} color="#dc2626" />
          <p style={{ fontSize: 12, color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className="rounded-[16px] p-5 mb-6"
          style={{
            background: result.valid ? '#f4faf7' : '#fff5f5',
            border: `1px solid ${result.valid ? '#c8ead9' : '#fca5a5'}`,
          }}
        >
          {/* Status */}
          <div className="flex items-center gap-3 mb-4">
            {result.valid
              ? <ShieldCheck size={22} color="#1D9E75" />
              : <ShieldX size={22} color="#dc2626" />
            }
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: result.valid ? '#0F6E56' : '#dc2626' }}>
                {result.valid ? 'Valid IMEI format' : 'Invalid IMEI'}
              </p>
              <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>
                {result.note}
              </p>
            </div>
          </div>

          {/* IMEI + Model rows */}
          <div className="space-y-2">
            <div
              className="flex justify-between items-center rounded-[8px] px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                IMEI
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#060d0a', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                {result.imei}
              </span>
            </div>

            {result.valid && (
              <div
                className="flex justify-between items-center rounded-[8px] px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.7)' }}
              >
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Device
                </span>
                <span className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600, color: '#060d0a' }}>
                  {result.model ? (
                    <><Smartphone size={12} color="#1D9E75" /> {result.brand} {result.model}</>
                  ) : (
                    <span style={{ color: '#aaa' }}>Unknown model</span>
                  )}
                </span>
              </div>
            )}

            {result.valid && (
              <div
                className="flex justify-between items-center rounded-[8px] px-3 py-2"
                style={{ background: 'rgba(255,255,255,0.7)' }}
              >
                <span style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Luhn check
                </span>
                <span className="flex items-center gap-1" style={{ fontSize: 12, fontWeight: 600, color: '#1D9E75' }}>
                  <CheckCircle2 size={12} color="#1D9E75" /> Passed
                </span>
              </div>
            )}
          </div>

          {/* Stolen check notice */}
          {result.valid && (
            <div
              className="mt-3 rounded-[10px] p-3"
              style={{ background: '#fffbeb', border: '0.5px solid #fde68a' }}
            >
              <p style={{ fontSize: 11, color: '#92400e', fontWeight: 600, marginBottom: 4 }}>
                Want to check if it&apos;s stolen or blacklisted?
              </p>
              <p style={{ fontSize: 11, color: '#a16207', lineHeight: 1.6 }}>
                Visit the <strong>Nepal Government DOTM</strong> portal — the official source for stolen device records in Nepal.
              </p>
              <a
                href="https://dotm.gov.np"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2"
                style={{ fontSize: 12, fontWeight: 700, color: '#1D9E75', textDecoration: 'none' }}
              >
                Check on DOTM Nepal <ExternalLink size={11} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Why check IMEI */}
      <div
        className="rounded-[14px] p-4"
        style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: '#060d0a', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Why check IMEI?
        </p>
        <div className="space-y-2.5">
          {[
            ['Verify it\'s not stolen', 'Stolen phones are blacklisted by telecom authorities'],
            ['Confirm the model', 'Counterfeit iPhones often show wrong model info'],
            ['Works for any seller', 'Hamrobazar, OLX, or any private seller'],
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

        {/* DOTM credit */}
        <div
          className="flex items-center gap-2 mt-4 pt-3"
          style={{ borderTop: '0.5px solid #e8e8e4' }}
        >
          <p style={{ fontSize: 10, color: '#bbb', lineHeight: 1.5 }}>
            IMEI format validated using the Luhn algorithm. Device model identified via the GSMA TAC registry.
            Stolen/blacklist data is maintained by{' '}
            <a
              href="https://dotm.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}
            >
              DOTM Nepal
            </a>
            {' '}— Department of Telecommunications and Mass Communications, Government of Nepal.
          </p>
        </div>
      </div>
    </main>
  )
}
