'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PhoneCard } from '@/components/phones/PhoneCard'
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react'
import type { Device, ProductCategory } from '@/types'

export const SLUG_TO_CATEGORY: Record<string, ProductCategory | 'deals'> = {
  macbook: 'macbook',
  ipad: 'ipad',
  audio: 'airpods',
  android: 'android',
  windows: 'windows',
  consoles: 'console',
  deals: 'deals',
}

export const CATEGORY_LABELS: Record<string, string> = {
  macbook: 'MacBooks',
  ipad: 'iPads',
  audio: 'AirPods & Audio',
  android: 'Android Phones',
  windows: 'Windows Laptops',
  consoles: 'Gaming Consoles',
  deals: 'Great Deals',
}

const CATEGORY_SEARCH_HINTS: Record<string, string> = {
  macbook: 'Search MacBook Pro, Air, M2, 256GB…',
  ipad: 'Search iPad Pro, Air, mini, 128GB…',
  audio: 'Search AirPods Pro, Max, Beats…',
  android: 'Search Galaxy S24, Pixel, OnePlus…',
  windows: 'Search Dell XPS, HP Spectre, ThinkPad…',
  consoles: 'Search PlayStation 5, Nintendo Switch…',
  deals: 'Search any product…',
}

const GRADE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'grade-a', label: 'Grade A' },
  { value: 'under-50k', label: 'Under NPR 50k' },
  { value: 'under-100k', label: 'Under NPR 100k' },
]

interface Props {
  slug: string
}

export function CategoryBrowse({ slug }: Props) {
  const category = SLUG_TO_CATEGORY[slug]
  const label = CATEGORY_LABELS[slug] ?? (slug.charAt(0).toUpperCase() + slug.slice(1))

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'battery'>('price-asc')
  const [filter, setFilter] = useState('all')
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const deferredQuery = useDeferredValue(query)
  const deferredSort = useDeferredValue(sort)
  const deferredFilter = useDeferredValue(filter)

  useEffect(() => {
    if (!category) {
      setDevices([])
      setIsLoading(false)
      setLoadError(null)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    async function loadDevices() {
      try {
        setIsLoading(true)
        setLoadError(null)
        const endpoint = category === 'deals'
          ? '/api/devices'
          : `/api/devices?category=${encodeURIComponent(category)}`
        const res = await fetch(endpoint, { signal: controller.signal })

        if (!res.ok) {
          throw new Error(`Failed to load products (${res.status})`)
        }

        const data = await res.json() as { devices?: Device[] }
        setDevices(Array.isArray(data.devices) ? data.devices : [])
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setLoadError('Unable to load products right now. Please try again.')
      } finally {
        setIsLoading(false)
        clearTimeout(timeout)
      }
    }

    void loadDevices()
    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [category])

  const products = useMemo(() => {
    if (!category) return []
    return devices
      .filter((d) => (category === 'deals' ? d.originalPrice != null && d.originalPrice > d.price : true))
      .filter((d) => {
        if (deferredQuery.trim()) {
          const q = deferredQuery.toLowerCase()
          return (
            d.model.toLowerCase().includes(q) ||
            d.storage.toLowerCase().includes(q) ||
            d.color.toLowerCase().includes(q)
          )
        }
        if (deferredFilter === 'all') return true
        if (deferredFilter === 'grade-a') return d.grade === 'A'
        if (deferredFilter === 'under-50k') return d.price < 50000
        if (deferredFilter === 'under-100k') return d.price < 100000
        return true
      })
      .sort((a, b) => {
        if (deferredSort === 'price-asc') return a.price - b.price
        if (deferredSort === 'price-desc') return b.price - a.price
        return b.batteryHealth - a.batteryHealth
      })
  }, [category, deferredFilter, deferredQuery, deferredSort, devices])

  if (!category) {
    return (
      <main className="min-h-screen pt-[160px] pb-24 bg-[#fcfcfc] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[64px] mb-6 block">⚡️</span>
          <h1 className="text-[28px] font-bold text-[#111] mb-4">Coming soon!</h1>
          <Link href="/gadgets" className="inline-flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-full font-bold">
            <ArrowLeft size={16} /> Back to Gadgets
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #ebebeb', background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/gadgets"
                className="flex items-center justify-center rounded-[10px] shrink-0"
                style={{ width: 36, height: 36, border: '0.5px solid #e0e0dc', background: '#fff' }}
              >
                <ArrowLeft size={14} color="#444" />
              </Link>
              <div>
                <h1 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.6px' }}>
                  {label}
                </h1>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>
                  {products.length} available · All inspected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} color="#999" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                style={{ fontSize: 13, fontWeight: 500, padding: '8px 12px', borderRadius: 10, border: '1px solid #e0e0dc', color: '#444', background: '#fff', outline: 'none' }}
              >
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="battery">Battery</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} color="#aaa" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={CATEGORY_SEARCH_HINTS[slug] ?? 'Search…'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '11px 36px 11px 36px', borderRadius: 12, border: '1px solid #e0e0dc', fontSize: 14, color: '#060d0a', outline: 'none', background: '#fafaf8' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={14} color="#aaa" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          {!query && (
            <div className="flex gap-2 flex-wrap">
              {GRADE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    border: filter === f.value ? '1.5px solid #060d0a' : '1px solid #e0e0dc',
                    background: filter === f.value ? '#060d0a' : '#fff',
                    color: filter === f.value ? '#fff' : '#666',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 16, color: '#999' }}>Loading products...</p>
        </div>
      ) : loadError ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 16, color: '#999' }}>{loadError}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 16, color: '#999' }}>No products match your search.</p>
          <button
            onClick={() => { setQuery(''); setFilter('all') }}
            style={{ marginTop: 12, fontSize: 13, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((device) => (
              <PhoneCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
