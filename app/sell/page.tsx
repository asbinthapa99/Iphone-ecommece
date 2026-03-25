'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, CheckCircle2, Phone, Camera, Tag, MessageCircle } from 'lucide-react'

const MODELS = [
  'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
  'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
  'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
  'iPhone 8 Plus', 'iPhone 8',
  'iPhone 7 Plus', 'iPhone 7',
  'iPhone 6s Plus', 'iPhone 6s',
  'iPhone SE (3rd gen)', 'iPhone SE (2nd gen)',
  'Other',
]

const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB']

const CONDITIONS = [
  { id: 'good', label: 'Good', emoji: '✨', desc: 'Minor wear, all functions perfect' },
  { id: 'fair', label: 'Fair', emoji: '👍', desc: 'Visible scratches, fully functional' },
  { id: 'cracked', label: 'Cracked', emoji: '💔', desc: 'Screen cracked but working' },
  { id: 'other', label: 'Other', emoji: '❓', desc: 'Unknown issues or parts only' },
]

type Step = 1 | 2 | 3 | 4

export default function SellPage() {
  const [step, setStep] = useState<Step>(1)
  const [model, setModel] = useState('')
  const [storage, setStorage] = useState('')
  const [condition, setCondition] = useState('')
  const [batteryHealth, setBatteryHealth] = useState(85)
  const [phone, setPhone] = useState('')
  const [quote, setQuote] = useState<{ quotedPrice: number; expiresAt: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const getQuote = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tradein/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, storage, condition, batteryHealth }),
      })
      const data = await res.json()
      if (res.ok) setQuote(data.quote)
    } catch {}
    setLoading(false)
    setStep(4)
  }

  const STEPS = [
    { num: 1, label: 'Model', icon: Phone },
    { num: 2, label: 'Condition', icon: Camera },
    { num: 3, label: 'Details', icon: Tag },
    { num: 4, label: 'Quote', icon: CheckCircle2 },
  ]

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.6px' }}>
          Sell your iPhone
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Get an instant quote in under 60 seconds
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => {
          const done = step > s.num
          const active = step === s.num
          return (
            <div key={s.num} className="flex items-center gap-1 flex-1">
              <div
                className="flex-1 h-1.5 rounded-full"
                style={{
                  background: done || active ? '#1D9E75' : '#f0f0ee',
                  transition: 'background 0.3s',
                }}
              />
              {i === STEPS.length - 1 && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: done || active ? '#1D9E75' : '#f0f0ee' }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Model */}
      {step === 1 && (
        <div className="animate-fadeUp">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 14 }}>
            Which iPhone do you have?
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className="text-left rounded-[12px] px-3 py-3"
                style={{
                  border: `1px solid ${model === m ? '#1D9E75' : '#ebebeb'}`,
                  background: model === m ? '#f4faf7' : '#fff',
                  fontSize: 13,
                  fontWeight: model === m ? 600 : 400,
                  color: model === m ? '#0F6E56' : '#444',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            disabled={!model}
            onClick={() => setStep(2)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px]"
            style={{
              background: model ? '#060d0a' : '#f0f0ee',
              color: model ? '#fff' : '#aaa',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: model ? 'pointer' : 'not-allowed',
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 2 — Condition */}
      {step === 2 && (
        <div className="animate-fadeUp">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 mb-5"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#888' }}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 14 }}>
            What&apos;s the condition?
          </p>
          <div className="space-y-2 mb-6">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCondition(c.id)}
                className="w-full flex items-center gap-3 rounded-[12px] p-3 text-left"
                style={{
                  border: `1px solid ${condition === c.id ? '#1D9E75' : '#ebebeb'}`,
                  background: condition === c.id ? '#f4faf7' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 22 }}>{c.emoji}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: condition === c.id ? '#0F6E56' : '#060d0a' }}>
                    {c.label}
                  </p>
                  <p style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{c.desc}</p>
                </div>
                {condition === c.id && (
                  <CheckCircle2 size={16} color="#1D9E75" className="ml-auto shrink-0" />
                )}
              </button>
            ))}
          </div>
          <button
            disabled={!condition}
            onClick={() => setStep(3)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px]"
            style={{
              background: condition ? '#060d0a' : '#f0f0ee',
              color: condition ? '#fff' : '#aaa',
              fontSize: 14, fontWeight: 600, border: 'none', cursor: condition ? 'pointer' : 'not-allowed',
            }}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 3 — Details */}
      {step === 3 && (
        <div className="animate-fadeUp">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1.5 mb-5"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#888' }}
          >
            <ArrowLeft size={13} /> Back
          </button>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#060d0a', marginBottom: 14 }}>
            A few more details
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Storage
              </label>
              <div className="flex gap-2 flex-wrap">
                {STORAGE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStorage(s)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: `1px solid ${storage === s ? '#1D9E75' : '#ebebeb'}`,
                      background: storage === s ? '#f4faf7' : '#fff',
                      fontSize: 12,
                      fontWeight: storage === s ? 600 : 400,
                      color: storage === s ? '#0F6E56' : '#444',
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Battery Health: {batteryHealth}%
              </label>
              <input
                type="range"
                min={60}
                max={100}
                value={batteryHealth}
                onChange={(e) => setBatteryHealth(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#1D9E75' }}
              />
              <div className="flex justify-between" style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
                <span>60%</span><span>100%</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '0.5px solid #e0e0dc',
                  fontSize: 14,
                  color: '#060d0a',
                  background: '#fafaf8',
                  outline: 'none',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1D9E75'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0dc'}
              />
            </div>
          </div>

          <button
            disabled={!phone || loading}
            onClick={getQuote}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px]"
            style={{
              background: phone && !loading ? '#1D9E75' : '#f0f0ee',
              color: phone && !loading ? '#060d0a' : '#aaa',
              fontSize: 14, fontWeight: 700, border: 'none', cursor: phone ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Getting your quote…' : <><span>Get instant quote</span> <ArrowRight size={15} /></>}
          </button>
        </div>
      )}

      {/* Step 4 — Quote */}
      {step === 4 && (
        <div className="animate-fadeUp">
          {!accepted ? (
            <>
              <div className="text-center mb-6">
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-full"
                  style={{ width: 64, height: 64, background: '#E1F5EE' }}
                >
                  <Tag size={28} color="#1D9E75" />
                </div>
                <p style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>
                  Your Inexa Quote
                </p>
                <p style={{ fontSize: 36, fontWeight: 800, color: '#060d0a', letterSpacing: '-1.5px' }}>
                  NPR {quote?.quotedPrice.toLocaleString() ?? '—'}
                </p>
                <p style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                  Valid for 48 hours · {model} · {condition}
                </p>
              </div>

              <div
                className="rounded-[14px] p-4 mb-5"
                style={{ background: '#f8f8f6', border: '0.5px solid #ebebeb' }}
              >
                {[
                  ['Model', model],
                  ['Storage', storage || 'Not specified'],
                  ['Condition', CONDITIONS.find(c => c.id === condition)?.label ?? condition],
                  ['Battery Health', `${batteryHealth}%`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '0.5px solid #f0f0ee', fontSize: 12 }}>
                    <span style={{ color: '#888' }}>{k}</span>
                    <span style={{ fontWeight: 600, color: '#060d0a' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setAccepted(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px]"
                  style={{ background: '#1D9E75', color: '#060d0a', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Accept quote <CheckCircle2 size={15} />
                </button>
                <button
                  onClick={() => { setStep(1); setModel(''); setCondition(''); setQuote(null) }}
                  className="w-full py-3 rounded-[12px]"
                  style={{ background: '#f0f0ee', color: '#888', fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  Start over
                </button>
              </div>
            </>
          ) : (
            <div className="text-center animate-scaleIn">
              <CheckCircle2 size={48} color="#1D9E75" className="mx-auto mb-4" />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.5px', marginBottom: 8 }}>
                Quote accepted!
              </h2>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 24 }}>
                Our team will contact you at <strong>{phone}</strong> within 2 hours to arrange pickup.
              </p>
              <a
                href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hi! I accepted a trade-in quote for my ${model} — NPR ${quote?.quotedPrice.toLocaleString()}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-[12px]"
                style={{ background: '#060d0a', color: '#1D9E75', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <MessageCircle size={15} />
                Confirm on WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
