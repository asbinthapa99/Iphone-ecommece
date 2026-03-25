'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, Plus, Trash2, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { INSPECTION_POINTS } from '@/lib/mock-data'
import { CATEGORIES, MODELS_BY_CATEGORY, STORAGE_OPTIONS, COLORS } from '@/lib/product-constants'
import type { ProductCategory, DeviceSpecs } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpecsFormState {
  // Quality scores (leave blank = auto-derived from grade + battery + model)
  durability: string
  performance: string
  camera: string
  screen: string
  // Identity
  brand: string
  manufacturerRef: string
  weight: string
  series: string
  releaseYear: string
  memoryGB: string
  sdCardSlot: '' | 'yes' | 'no'
  connector: string
  mobileNetwork: string
  simCard: string
  // Display
  screenSize: string
  screenType: string
  resolution: string
  // Camera
  mainCamera: string
  frontCamera: string
  // Software
  os: string
  foldable: '' | 'yes' | 'no'
  compatibleWithLatestUpdate: '' | 'yes' | 'no'
  // Rich content
  longDescription: string
  keyFeatures: string[]
  whoIsItFor: string
  pros: string[]
  cons: string[]
}

export interface ProductFormState {
  category: ProductCategory
  model: string
  storage: string
  color: string
  grade: string
  batteryHealth: number
  price: string
  originalPrice: string
  imei: string
  description: string
  status: string
  specs: SpecsFormState
}

interface Props {
  mode: 'new' | 'edit'
  initial?: Partial<Omit<ProductFormState, 'specs'> & { specs?: Partial<SpecsFormState> }>
  existingPhotos?: string[]
  saved?: boolean
  onSubmit: (form: ProductFormState, inspection: Record<string, boolean>) => Promise<void>
  onDelete?: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fieldStyle = {
  border: '0.5px solid #e0e0dc', borderRadius: 8, background: '#fff',
  color: '#060d0a', fontSize: 13, padding: '8px 12px', width: '100%', outline: 'none',
}
const labelStyle = {
  fontSize: 11, fontWeight: 500 as const, color: '#888',
  textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 6,
}
const sectionStyle = { border: '0.5px solid #f0f0ee', background: '#fff' }

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="p-5 rounded-[14px]" style={sectionStyle}>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-[13px] font-medium" style={{ color: '#060d0a' }}>{title}</p>
        {hint && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#f0f0ee', color: '#888' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const emptySpecs: SpecsFormState = {
  durability: '', performance: '', camera: '', screen: '',
  brand: '', manufacturerRef: '', weight: '', series: '', releaseYear: '',
  memoryGB: '', sdCardSlot: '', connector: '', mobileNetwork: '', simCard: '',
  screenSize: '', screenType: '', resolution: '',
  mainCamera: '', frontCamera: '',
  os: '', foldable: '', compatibleWithLatestUpdate: '',
  longDescription: '', keyFeatures: [''], whoIsItFor: '', pros: [''], cons: [''],
}

/** Convert SpecsFormState → DeviceSpecs (for submit) */
export function specsFormToDeviceSpecs(s: SpecsFormState): DeviceSpecs {
  const num = (v: string) => v ? Number(v) : undefined
  const bool = (v: string) => v === 'yes' ? true : v === 'no' ? false : undefined
  return {
    durability: num(s.durability),
    performance: num(s.performance),
    camera: num(s.camera),
    screen: num(s.screen),
    brand: s.brand || undefined,
    manufacturerRef: s.manufacturerRef || undefined,
    weight: s.weight || undefined,
    series: s.series || undefined,
    releaseYear: num(s.releaseYear),
    memoryGB: num(s.memoryGB),
    sdCardSlot: bool(s.sdCardSlot),
    connector: s.connector || undefined,
    mobileNetwork: s.mobileNetwork || undefined,
    simCard: s.simCard || undefined,
    screenSize: num(s.screenSize),
    screenType: s.screenType || undefined,
    resolution: s.resolution || undefined,
    mainCamera: num(s.mainCamera),
    frontCamera: num(s.frontCamera),
    os: s.os || undefined,
    foldable: bool(s.foldable),
    compatibleWithLatestUpdate: bool(s.compatibleWithLatestUpdate),
    longDescription: s.longDescription || undefined,
    keyFeatures: s.keyFeatures.filter(Boolean).length > 0 ? s.keyFeatures.filter(Boolean) : undefined,
    whoIsItFor: s.whoIsItFor || undefined,
    pros: s.pros.filter(Boolean).length > 0 ? s.pros.filter(Boolean) : undefined,
    cons: s.cons.filter(Boolean).length > 0 ? s.cons.filter(Boolean) : undefined,
  }
}

// ── Dynamic list editor ───────────────────────────────────────────────────────

function ListEditor({
  label, items, onChange, placeholder,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
}) {
  const update = (i: number, val: string) => onChange(items.map((it, idx) => idx === i ? val : it))
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, ''])

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              style={{ ...fieldStyle, flex: 1 }}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', padding: 4, flexShrink: 0 }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-[11px] font-medium self-start px-2.5 py-1.5 rounded-[7px]"
          style={{ border: '0.5px solid #e0e0dc', color: '#888' }}
        >
          <Plus size={10} /> Add item
        </button>
      </div>
    </div>
  )
}

// ── Score slider ──────────────────────────────────────────────────────────────

function ScoreSlider({
  label, value, onChange, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const num = value ? Number(value) : null
  const color = num === null ? '#ddd' : num >= 85 ? '#1D9E75' : num >= 70 ? '#f59e0b' : '#e24b4a'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <span className="text-[12px] font-bold" style={{ color: num ? color : '#aaa' }}>
          {num ?? <span style={{ color: '#bbb' }}>auto</span>}
        </span>
      </div>
      <input
        type="range" min={0} max={100} step={1}
        value={value || 0}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', accentColor: color, cursor: 'pointer' }}
      />
      <div className="flex justify-between text-[9px] mt-0.5" style={{ color: '#ccc' }}>
        <span>0</span>
        <span style={{ color: '#bbb', fontSize: 9 }}>leave at 0 = auto-derive</span>
        <span>100</span>
      </div>
    </div>
  )
}

// ── Collapsible specs section ─────────────────────────────────────────────────

function SpecsSection({ specs, onChange }: {
  specs: SpecsFormState
  onChange: (s: SpecsFormState) => void
}) {
  const [open, setOpen] = useState(false)
  const set = (key: keyof SpecsFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...specs, [key]: e.target.value })

  const CONNECTORS = ['USB-C', 'Lightning', 'USB-A', 'Proprietary']
  const OS_OPTIONS = ['iOS', 'Android', 'macOS', 'Windows 11', 'Windows 10', 'Other']
  const NETWORK_OPTIONS = ['5G', '4G LTE', '3G', 'Wi-Fi only']

  return (
    <div className="rounded-[14px] overflow-hidden" style={sectionStyle}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-[#fafaf8] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-medium" style={{ color: '#060d0a' }}>Specifications</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#E1F5EE', color: '#1D9E75' }}>optional — auto-derived if blank</span>
        </div>
        {open ? <ChevronUp size={14} color="#888" /> : <ChevronDown size={14} color="#888" />}
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-6" style={{ borderTop: '0.5px solid #f5f5f5' }}>

          {/* Auto-derived notice */}
          <div className="flex items-start gap-2 pt-4 rounded-[10px]">
            <Info size={12} color="#888" className="shrink-0 mt-0.5" />
            <p className="text-[11px]" style={{ color: '#888', lineHeight: 1.6 }}>
              All fields are optional. Empty fields will be automatically derived from the device model, grade, and battery health.
              Fill in only what you want to override.
            </p>
          </div>

          {/* Quality scores */}
          <div>
            <p className="text-[12px] font-semibold mb-3" style={{ color: '#444' }}>Quality Scores (0–100)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['durability', 'Durability'],
                ['performance', 'Performance'],
                ['camera', 'Camera'],
                ['screen', 'Screen Quality'],
              ] as [keyof SpecsFormState, string][]).map(([key, lbl]) => (
                <ScoreSlider
                  key={key}
                  label={lbl}
                  value={specs[key] as string}
                  onChange={(v) => onChange({ ...specs, [key]: v === '0' ? '' : v })}
                  placeholder="auto"
                />
              ))}
            </div>
          </div>

          {/* Technical specs */}
          <div>
            <p className="text-[12px] font-semibold mb-3" style={{ color: '#444' }}>Technical Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Brand</label>
                <input type="text" value={specs.brand} onChange={set('brand')} style={fieldStyle} placeholder="e.g. Apple" />
              </div>
              <div>
                <label style={labelStyle}>Manufacturer Ref</label>
                <input type="text" value={specs.manufacturerRef} onChange={set('manufacturerRef')} style={fieldStyle} placeholder="e.g. A3106" />
              </div>
              <div>
                <label style={labelStyle}>Weight</label>
                <input type="text" value={specs.weight} onChange={set('weight')} style={fieldStyle} placeholder="e.g. 221 g" />
              </div>
              <div>
                <label style={labelStyle}>Series / Family</label>
                <input type="text" value={specs.series} onChange={set('series')} style={fieldStyle} placeholder="e.g. Apple iPhone 15" />
              </div>
              <div>
                <label style={labelStyle}>Release Year</label>
                <input type="number" value={specs.releaseYear} onChange={set('releaseYear')} style={fieldStyle} placeholder="e.g. 2023" min={2007} max={2030} />
              </div>
              <div>
                <label style={labelStyle}>RAM (GB)</label>
                <input type="number" value={specs.memoryGB} onChange={set('memoryGB')} style={fieldStyle} placeholder="e.g. 8" min={1} max={64} />
              </div>
              <div>
                <label style={labelStyle}>Connector</label>
                <select value={specs.connector} onChange={set('connector')} style={fieldStyle}>
                  <option value="">Auto-derive</option>
                  {CONNECTORS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mobile Network</label>
                <select value={specs.mobileNetwork} onChange={set('mobileNetwork')} style={fieldStyle}>
                  <option value="">Auto-derive</option>
                  {NETWORK_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>SIM Type</label>
                <input type="text" value={specs.simCard} onChange={set('simCard')} style={fieldStyle} placeholder="e.g. Physical SIM + eSIM" />
              </div>
              <div>
                <label style={labelStyle}>SD Card Slot</label>
                <select value={specs.sdCardSlot} onChange={set('sdCardSlot')} style={fieldStyle}>
                  <option value="">Auto-derive</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Operating System</label>
                <select value={specs.os} onChange={set('os')} style={fieldStyle}>
                  <option value="">Auto-derive</option>
                  {OS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Foldable</label>
                <select value={specs.foldable} onChange={set('foldable')} style={fieldStyle}>
                  <option value="">Auto-derive</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display */}
          <div>
            <p className="text-[12px] font-semibold mb-3" style={{ color: '#444' }}>Display</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Screen Size (inches)</label>
                <input type="number" value={specs.screenSize} onChange={set('screenSize')} style={fieldStyle} placeholder="e.g. 6.7" step={0.1} min={1} max={20} />
              </div>
              <div>
                <label style={labelStyle}>Resolution</label>
                <input type="text" value={specs.resolution} onChange={set('resolution')} style={fieldStyle} placeholder="e.g. 1290 x 2796" />
              </div>
              <div className="col-span-2">
                <label style={labelStyle}>Screen Type</label>
                <input type="text" value={specs.screenType} onChange={set('screenType')} style={fieldStyle} placeholder="e.g. LTPO Super Retina XDR OLED" />
              </div>
            </div>
          </div>

          {/* Camera */}
          <div>
            <p className="text-[12px] font-semibold mb-3" style={{ color: '#444' }}>Camera</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Main Camera (MP)</label>
                <input type="number" value={specs.mainCamera} onChange={set('mainCamera')} style={fieldStyle} placeholder="e.g. 48" min={1} max={200} />
              </div>
              <div>
                <label style={labelStyle}>Front Camera (MP)</label>
                <input type="number" value={specs.frontCamera} onChange={set('frontCamera')} style={fieldStyle} placeholder="e.g. 12" min={1} max={100} />
              </div>
            </div>
          </div>

          {/* Rich content */}
          <div>
            <p className="text-[12px] font-semibold mb-3" style={{ color: '#444' }}>Product Page Content</p>
            <div className="flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Long Description (overrides short description on product page)</label>
                <textarea
                  value={specs.longDescription}
                  onChange={set('longDescription')}
                  style={{ ...fieldStyle, minHeight: 100, resize: 'vertical' }}
                  placeholder="The iPhone 15 Pro Max represents Apple's flagship..."
                />
              </div>

              <ListEditor
                label="Key Features (bullet points)"
                items={specs.keyFeatures}
                onChange={(items) => onChange({ ...specs, keyFeatures: items })}
                placeholder="e.g. Release Date: September 2023"
              />

              <div>
                <label style={labelStyle}>Who is this for?</label>
                <textarea
                  value={specs.whoIsItFor}
                  onChange={set('whoIsItFor')}
                  style={{ ...fieldStyle, minHeight: 80, resize: 'vertical' }}
                  placeholder="Ideal for professionals, content creators, and tech enthusiasts who..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ListEditor
                  label="Pros"
                  items={specs.pros}
                  onChange={(items) => onChange({ ...specs, pros: items })}
                  placeholder="e.g. Lightweight titanium frame"
                />
                <ListEditor
                  label="Cons"
                  items={specs.cons}
                  onChange={(items) => onChange({ ...specs, cons: items })}
                  placeholder="e.g. No expandable storage"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function ProductForm({ mode, initial, existingPhotos, saved, onSubmit, onDelete }: Props) {
  const [form, setForm] = useState<ProductFormState>({
    category: initial?.category ?? 'iphone',
    model: initial?.model ?? '',
    storage: initial?.storage ?? '',
    color: initial?.color ?? '',
    grade: initial?.grade ?? 'A',
    batteryHealth: initial?.batteryHealth ?? 90,
    price: initial?.price ?? '',
    originalPrice: initial?.originalPrice ?? '',
    imei: initial?.imei ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'available',
    specs: { ...emptySpecs, ...initial?.specs },
  })
  const [inspection, setInspection] = useState<Record<string, boolean>>(
    Object.fromEntries(INSPECTION_POINTS.map((p) => [p.key, mode === 'edit']))
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const set = (key: keyof Omit<ProductFormState, 'specs'>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form, inspection)
  }

  const models = MODELS_BY_CATEGORY[form.category] ?? []
  const needsImei = form.category === 'iphone' || form.category === 'android'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">

      {/* Category */}
      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat.value} type="button"
              onClick={() => setForm((f) => ({ ...f, category: cat.value, model: '' }))}
              style={{
                padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                border: form.category === cat.value ? '1.5px solid #060d0a' : '0.5px solid #e0e0dc',
                background: form.category === cat.value ? '#060d0a' : '#fff',
                color: form.category === cat.value ? '#fff' : '#666',
              }}
            >{cat.label}</button>
          ))}
        </div>
      </Section>

      {/* Product info */}
      <Section title="Product Info">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Model</label>
            {mode === 'new' && models.length > 0 ? (
              <select value={form.model} onChange={set('model')} style={fieldStyle} required>
                <option value="">Select model</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            ) : (
              <input type="text" value={form.model} onChange={set('model')} style={fieldStyle} required />
            )}
          </div>
          <div>
            <label style={labelStyle}>Storage</label>
            {mode === 'new' ? (
              <select value={form.storage} onChange={set('storage')} style={fieldStyle} required>
                <option value="">Select storage</option>
                {STORAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <input type="text" value={form.storage} onChange={set('storage')} style={fieldStyle} required />
            )}
          </div>
          <div>
            <label style={labelStyle}>Color</label>
            {mode === 'new' ? (
              <select value={form.color} onChange={set('color')} style={fieldStyle}>
                <option value="">Select color</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input type="text" value={form.color} onChange={set('color')} style={fieldStyle} />
            )}
          </div>
          <div>
            <label style={labelStyle}>Grade</label>
            <select value={form.grade} onChange={set('grade')} style={fieldStyle}>
              <option value="A">Grade A — Like new (90%+ battery)</option>
              <option value="B">Grade B — Good condition (80%+ battery)</option>
              <option value="C">Grade C — Visible wear (70%+ battery)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Battery Health (%)</label>
            <input type="number" min={50} max={100} value={form.batteryHealth}
              onChange={(e) => setForm((f) => ({ ...f, batteryHealth: Number(e.target.value) }))}
              style={fieldStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={set('status')} style={fieldStyle}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        {(mode === 'edit' || needsImei) && (
          <div className="mt-4">
            <label style={labelStyle}>IMEI Number</label>
            <input type="text" inputMode="numeric" maxLength={16} placeholder="15-digit IMEI"
              value={form.imei}
              onChange={(e) => setForm((f) => ({ ...f, imei: e.target.value.replace(/\D/g, '') }))}
              style={{ ...fieldStyle, fontFamily: 'monospace', letterSpacing: '0.04em' }}
              required={mode === 'new'} />
          </div>
        )}

        <div className="mt-4">
          <label style={labelStyle}>Short Description</label>
          <textarea value={form.description} onChange={set('description')}
            style={{ ...fieldStyle, minHeight: 80, resize: 'vertical' }}
            placeholder="Condition notes, what's included, etc." />
        </div>
      </Section>

      {/* Specifications */}
      <SpecsSection
        specs={form.specs}
        onChange={(specs) => setForm((f) => ({ ...f, specs }))}
      />

      {/* Pricing */}
      <Section title="Pricing (NPR)">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Selling Price</label>
            <input type="number" value={form.price} onChange={set('price')} style={fieldStyle} placeholder="43500" required />
          </div>
          <div>
            <label style={labelStyle}>Original Retail Price (optional)</label>
            <input type="number" value={form.originalPrice} onChange={set('originalPrice')} style={fieldStyle} placeholder="79900" />
          </div>
        </div>
      </Section>

      {/* Photos */}
      <Section title="Photos">
        {existingPhotos && existingPhotos.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {existingPhotos.map((url, i) => (
              <div key={i} className="relative group w-20 h-20 rounded-[10px] overflow-hidden" style={{ border: '0.5px solid #f0f0ee' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Trash2 size={14} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="border-dashed rounded-[12px] flex flex-col items-center justify-center py-10 cursor-pointer hover:bg-[#fafaf8] transition-colors" style={{ border: '1px dashed #e0e0dc' }}>
          <Upload size={20} color="#aaa" />
          <p className="text-[12px] mt-2" style={{ color: '#888' }}>Drop photos here or click to upload</p>
          <p className="text-[10px] mt-1" style={{ color: '#aaa' }}>8–12 photos · JPG, PNG · max 5MB each</p>
          <button type="button" className="mt-3 flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-[8px]" style={{ border: '0.5px solid #e0e0dc', color: '#444' }}>
            <Plus size={11} /> Choose files
          </button>
        </div>
      </Section>

      {/* Inspection checklist */}
      <Section title="Inspection Checklist">
        <div className="flex justify-end mb-3">
          <button type="button" onClick={() => setInspection(Object.fromEntries(INSPECTION_POINTS.map((p) => [p.key, true])))}
            className="text-[11px] font-medium" style={{ color: '#1D9E75' }}>
            Mark all passed
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {INSPECTION_POINTS.map((point) => (
            <button key={point.key} type="button"
              onClick={() => setInspection((s) => ({ ...s, [point.key]: !s[point.key] }))}
              className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-left transition-colors"
              style={{ border: `0.5px solid ${inspection[point.key] ? '#c8ead9' : '#f0f0ee'}`, background: inspection[point.key] ? '#f4faf7' : '#fff' }}>
              <CheckCircle2 size={13} color={inspection[point.key] ? '#1D9E75' : '#d0d0cc'} />
              <span className="text-[11px] font-medium" style={{ color: inspection[point.key] ? '#0F6E56' : '#888' }}>{point.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" className="flex-1 py-3 text-[13px] font-medium rounded-[10px] flex items-center justify-center gap-2"
          style={{ background: '#060d0a', color: '#1D9E75' }}>
          {saved ? '✓ Saved!' : mode === 'new' ? 'Save Device' : 'Save Changes'}
        </button>
        {onDelete && (
          <button type="button" onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 text-[12px] font-medium rounded-[10px]"
            style={{ border: '0.5px solid #fecaca', color: '#e24b4a' }}>
            Delete
          </button>
        )}
      </div>

      {showDeleteConfirm && onDelete && (
        <div className="flex items-center gap-3 p-3 rounded-[10px]" style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}>
          <p style={{ fontSize: 12, color: '#e24b4a', flex: 1 }}>Delete this device? This cannot be undone.</p>
          <button type="button" onClick={onDelete}
            style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#e24b4a', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Yes, Delete
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(false)}
            style={{ fontSize: 11, color: '#888', background: 'none', border: '0.5px solid #e0e0dc', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}
    </form>
  )
}
