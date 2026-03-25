'use client'

import { useState } from 'react'
import { Check, X, ChevronDown, ChevronUp, Recycle } from 'lucide-react'
import type { Device, DeviceSpecs } from '@/types'
import { deriveSpecs } from '@/lib/derive-specs'

// ── Sub-components ────────────────────────────────────────────────────────────

function QualityBar({ label, score }: { label: string; score: number }) {
  const color = score >= 85 ? '#1D9E75' : score >= 70 ? '#f59e0b' : '#e24b4a'
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[12px] font-medium" style={{ color: '#555' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#f0f0ee' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="w-10 text-right text-[11px] font-bold" style={{ color }}>{score}/100</span>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between py-2.5" style={{ borderBottom: '0.5px solid #f0f0ee' }}>
      <span className="text-[11px] font-medium uppercase tracking-wide shrink-0 w-40" style={{ color: '#aaa' }}>{label}</span>
      <span className="text-[13px] font-medium text-right" style={{ color: '#111' }}>{String(value)}</span>
    </div>
  )
}

function QuickSpecTile({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1 rounded-[12px] p-3" style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#aaa' }}>{label}</span>
      <span className="text-[13px] font-bold" style={{ color: '#111' }}>{value}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProductSpecs({ device }: { device: Device }) {
  const [specsOpen, setSpecsOpen] = useState(false)
  const s = deriveSpecs(device)

  const qualityRatings = [
    { label: 'Durability', score: s.durability },
    { label: 'Performance', score: s.performance },
    { label: 'Camera', score: s.camera },
    { label: 'Screen quality', score: s.screen },
  ].filter((r): r is { label: string; score: number } => typeof r.score === 'number')

  const quickSpecs: Array<{ label: string; value: string }> = [
    { label: 'Brand', value: s.brand ?? '' },
    { label: 'Carrier', value: 'Unlocked' },
    { label: 'Connector', value: s.connector ?? '' },
    { label: 'Network', value: s.mobileNetwork ?? '' },
    { label: 'SIM', value: s.simCard ?? '' },
    { label: 'Memory', value: s.memoryGB ? `${s.memoryGB} GB` : '' },
    { label: 'Screen', value: s.screenSize ? `${s.screenSize}"` : '' },
    { label: 'SD Card', value: s.sdCardSlot === false ? 'No' : s.sdCardSlot ? 'Yes' : '' },
  ].filter((t) => t.value)

  const fullSpecs: Array<{ label: string; value: string }> = [
    { label: 'Brand', value: s.brand ?? '' },
    { label: 'Model', value: device.model },
    { label: 'Manufacturer Ref', value: s.manufacturerRef ?? '' },
    { label: 'Weight', value: s.weight ?? '' },
    { label: 'Series', value: s.series ?? '' },
    { label: 'Year of Release', value: s.releaseYear ? String(s.releaseYear) : '' },
    { label: 'Memory (RAM)', value: s.memoryGB ? `${s.memoryGB} GB` : '' },
    { label: 'Storage', value: device.storage },
    { label: 'SD Card Slot', value: s.sdCardSlot === false ? 'No' : s.sdCardSlot ? 'Yes' : '' },
    { label: 'Connector', value: s.connector ?? '' },
    { label: 'Main Camera', value: s.mainCamera ? `${s.mainCamera} MP` : '' },
    { label: 'Front Camera', value: s.frontCamera ? `${s.frontCamera} MP` : '' },
    { label: 'Screen Size', value: s.screenSize ? `${s.screenSize} in` : '' },
    { label: 'Screen Type', value: s.screenType ?? '' },
    { label: 'Resolution', value: s.resolution ?? '' },
    { label: 'Mobile Network', value: s.mobileNetwork ?? '' },
    { label: 'SIM Card', value: s.simCard ?? '' },
    { label: 'OS', value: s.os ?? '' },
    { label: 'Foldable', value: typeof s.foldable === 'boolean' ? (s.foldable ? 'Yes' : 'No') : '' },
    { label: 'Colour', value: device.color },
    { label: 'Latest Update Compatible', value: s.compatibleWithLatestUpdate ? 'Yes' : 'No' },
    { label: 'Carrier', value: 'Unlocked' },
  ].filter((r) => r.value)

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-[20px] font-bold tracking-tight" style={{ color: '#060d0a' }}>
        Everything you need to know
      </h2>

      {/* Quality ratings */}
      {qualityRatings.length > 0 && (
        <div className="rounded-[16px] p-5 space-y-3.5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          <p className="text-[13px] font-semibold mb-1" style={{ color: '#060d0a' }}>Quality ratings</p>
          {qualityRatings.map((r) => (
            <QualityBar key={r.label} label={r.label} score={r.score} />
          ))}
          <p className="text-[10px] mt-1" style={{ color: '#aaa' }}>
            Scores derived from device grade (Grade {device.grade}), battery health ({device.batteryHealth}%), and model generation.
          </p>
        </div>
      )}

      {/* Quick specs grid */}
      {quickSpecs.length > 0 && (
        <div className="rounded-[16px] p-5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          <p className="text-[13px] font-semibold mb-3" style={{ color: '#060d0a' }}>Key specs</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickSpecs.map((t) => (
              <QuickSpecTile key={t.label} label={t.label} value={t.value} />
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {(s.longDescription || s.keyFeatures?.length) && (
        <div className="rounded-[16px] p-5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          <p className="text-[13px] font-semibold mb-3" style={{ color: '#060d0a' }}>About the {device.model}</p>
          {s.longDescription && (
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#555' }}>{s.longDescription}</p>
          )}
          {s.keyFeatures && s.keyFeatures.length > 0 && (
            <>
              <p className="text-[12px] font-semibold mb-2" style={{ color: '#333' }}>Key features</p>
              <ul className="space-y-1.5">
                {s.keyFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={12} color="#1D9E75" className="shrink-0 mt-0.5" />
                    <span className="text-[12px]" style={{ color: '#555' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Who is this for */}
      {s.whoIsItFor && (
        <div className="rounded-[16px] p-5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          <p className="text-[13px] font-semibold mb-2" style={{ color: '#060d0a' }}>Who is this for?</p>
          <p className="text-[13px] leading-relaxed" style={{ color: '#555' }}>{s.whoIsItFor}</p>
        </div>
      )}

      {/* Pros & Cons */}
      {(s.pros?.length || s.cons?.length) && (
        <div className="rounded-[16px] p-5" style={{ border: '0.5px solid #ebebeb', background: '#fff' }}>
          <p className="text-[13px] font-semibold mb-4" style={{ color: '#060d0a' }}>Pros & Cons</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.pros && s.pros.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#1D9E75' }}>Pros</p>
                <ul className="space-y-2">
                  {s.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#E1F5EE' }}>
                        <Check size={9} color="#1D9E75" strokeWidth={3} />
                      </div>
                      <span className="text-[12px]" style={{ color: '#444' }}>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.cons && s.cons.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: '#e24b4a' }}>Cons</p>
                <ul className="space-y-2">
                  {s.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#fff5f5' }}>
                        <X size={9} color="#e24b4a" strokeWidth={3} />
                      </div>
                      <span className="text-[12px]" style={{ color: '#444' }}>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Why refurbished */}
      <div className="rounded-[16px] p-5 flex items-start gap-4" style={{ background: '#f4faf7', border: '0.5px solid #c8ead9' }}>
        <div className="shrink-0 rounded-full flex items-center justify-center mt-0.5" style={{ width: 32, height: 32, background: '#E1F5EE' }}>
          <Recycle size={16} color="#0F6E56" />
        </div>
        <div>
          <p className="text-[13px] font-semibold mb-1" style={{ color: '#0F6E56' }}>Why refurbished?</p>
            Choosing a refurbished {device.model} supports a more sustainable approach by extending the device&apos;s lifecycle.
            Every device on Inexa Nepal is IMEI-verified, factory reset, and graded by our team.
            You get the same performance as new at a significantly lower price — with a 6-month warranty included.
        </div>
      </div>

      {/* Full specs accordion */}
      <div className="rounded-[16px] overflow-hidden" style={{ border: '0.5px solid #ebebeb' }}>
        <button
          onClick={() => setSpecsOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fafaf8] transition-colors"
          style={{ background: '#fff' }}
        >
          <span className="text-[13px] font-semibold" style={{ color: '#060d0a' }}>
            Full specifications — {device.model}
          </span>
          {specsOpen
            ? <ChevronUp size={15} color="#888" />
            : <ChevronDown size={15} color="#888" />
          }
        </button>

        {specsOpen && (
          <div className="px-5 pb-4" style={{ background: '#fff' }}>
            {fullSpecs.map((row) => (
              <SpecRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
