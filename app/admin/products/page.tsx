'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { GradeBadge } from '@/components/trust/GradeBadge'
import { Plus, Pencil, Trash2, Search, X, AlertTriangle } from 'lucide-react'
import type { Device, ProductCategory } from '@/types'

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  iphone: 'iPhone',
  macbook: 'MacBook',
  ipad: 'iPad',
  airpods: 'AirPods',
  android: 'Android',
  windows: 'Windows',
  console: 'Console',
  other: 'Other',
}

const ALL_CATEGORIES: Array<{ value: ProductCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'iphone', label: 'iPhone' },
  { value: 'macbook', label: 'MacBook' },
  { value: 'ipad', label: 'iPad' },
  { value: 'airpods', label: 'AirPods' },
  { value: 'android', label: 'Android' },
  { value: 'windows', label: 'Windows' },
  { value: 'console', label: 'Console' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Device[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/devices?includeSold=true')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to load products')
        setProducts(data.devices ?? [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = useMemo(() => (
    products
      .filter((d) => categoryFilter === 'all' || d.category === categoryFilter)
      .filter((d) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return d.model.toLowerCase().includes(q) || d.storage.toLowerCase().includes(q) || d.color.toLowerCase().includes(q)
      })
  ), [products, categoryFilter, search])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to delete product')
      }
      setProducts((prev) => prev.filter((d) => d.id !== id))
      setDeleteId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete product')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-medium tracking-tight" style={{ color: '#060d0a' }}>
            Products
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: '#888' }}>
            {filtered.length} of {products.length} devices
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-[8px]"
          style={{ background: '#060d0a', color: '#1D9E75' }}
        >
          <Plus size={12} />
          Add Product
        </Link>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={13} color="#aaa" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search model, storage, color…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: 30, paddingRight: search ? 30 : 10,
              paddingTop: 8, paddingBottom: 8,
              border: '0.5px solid #e0e0dc', borderRadius: 8, fontSize: 12,
              color: '#060d0a', outline: 'none', background: '#fafaf8',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={12} color="#aaa" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              style={{
                padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                border: categoryFilter === cat.value ? '1px solid #060d0a' : '0.5px solid #e0e0dc',
                background: categoryFilter === cat.value ? '#060d0a' : '#fff',
                color: categoryFilter === cat.value ? '#fff' : '#666',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {deleteId && (
        <div
          className="flex items-center gap-3 p-3 rounded-[10px] mb-4"
          style={{ background: '#fff5f5', border: '0.5px solid #fca5a5' }}
        >
          <AlertTriangle size={14} color="#e24b4a" className="shrink-0" />
          <p style={{ fontSize: 12, color: '#e24b4a', flex: 1 }}>
            Delete <strong>{products.find((d) => d.id === deleteId)?.model}</strong>? This cannot be undone.
          </p>
          <button
            onClick={() => handleDelete(deleteId)}
            style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#e24b4a', border: 'none', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteId(null)}
            style={{ fontSize: 11, fontWeight: 600, color: '#888', background: 'none', border: '0.5px solid #e0e0dc', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="rounded-[14px] overflow-hidden" style={{ border: '0.5px solid #f0f0ee', background: '#fff' }}>
        {loading ? (
          <div className="py-12 text-center">
            <p style={{ fontSize: 13, color: '#888' }}>Loading products…</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p style={{ fontSize: 13, color: '#e24b4a' }}>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p style={{ fontSize: 13, color: '#888' }}>No products found.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y" style={{ borderColor: '#f4f4f0' }}>
              {filtered.map((device) => (
                <div key={device.id} className="flex items-center gap-3 px-4 py-3 bg-white">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        style={{
                          fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 100,
                          background: '#f0f0ee', color: '#888',
                        }}
                      >
                        {CATEGORY_LABELS[device.category]}
                      </span>
                      <GradeBadge grade={device.grade} />
                      <span
                        style={{
                          fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 100,
                          background: device.status === 'available' ? '#E1F5EE' : '#f0f0ee',
                          color: device.status === 'available' ? '#0F6E56' : '#888',
                        }}
                      >
                        {device.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#060d0a' }}>{device.model}</p>
                    <p style={{ fontSize: 11, color: '#888' }}>{device.storage} · {device.batteryHealth}% batt</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>NPR {device.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <Link
                        href={`/admin/products/${device.id}/edit`}
                        style={{ fontSize: 11, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Edit →
                      </Link>
                      <button
                        onClick={() => setDeleteId(device.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Trash2 size={12} color="#e24b4a" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block">
              <div
                className="grid grid-cols-12 px-4 py-2.5 text-[10px] font-medium uppercase tracking-wide"
                style={{ color: '#888', borderBottom: '0.5px solid #f0f0ee', background: '#fafaf8' }}
              >
                <div className="col-span-1">Cat.</div>
                <div className="col-span-3">Device</div>
                <div className="col-span-2">Grade</div>
                <div className="col-span-2">Battery</div>
                <div className="col-span-2">Price (NPR)</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1"></div>
              </div>

              {filtered.map((device, i) => (
                <div
                  key={device.id}
                  className="grid grid-cols-12 px-4 py-3 items-center"
                  style={{ borderBottom: i < filtered.length - 1 ? '0.5px solid #f0f0ee' : 'none' }}
                >
                  <div className="col-span-1">
                    <span
                      style={{
                        fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                        background: '#f4f4f0', color: '#666',
                      }}
                    >
                      {CATEGORY_LABELS[device.category]}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-[13px] font-medium" style={{ color: '#060d0a' }}>{device.model}</p>
                    <p className="text-[11px]" style={{ color: '#888' }}>{device.storage} · {device.color}</p>
                  </div>
                  <div className="col-span-2"><GradeBadge grade={device.grade} /></div>
                  <div className="col-span-2">
                    <span className="text-[12px]" style={{ color: '#444' }}>{device.batteryHealth}%</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[13px] font-medium" style={{ color: '#060d0a' }}>{device.price.toLocaleString()}</span>
                  </div>
                  <div className="col-span-1">
                    <span
                      className="text-[9px] font-medium px-2 py-1 rounded-full"
                      style={{
                        background: device.status === 'available' ? '#E1F5EE' : '#f0f0ee',
                        color: device.status === 'available' ? '#0F6E56' : '#888',
                      }}
                    >
                      {device.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center gap-1.5 justify-end">
                    <Link href={`/admin/products/${device.id}/edit`} className="p-1.5 rounded-[6px] transition-colors hover:bg-[#f4f4f0]">
                      <Pencil size={12} color="#888" />
                    </Link>
                    <button
                      onClick={() => setDeleteId(device.id)}
                      className="p-1.5 rounded-[6px] transition-colors hover:bg-[#fef2f2]"
                    >
                      <Trash2 size={12} color="#e24b4a" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
