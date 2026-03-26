'use client'

import Link from 'next/link'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { PhoneCard } from '@/components/phones/PhoneCard'
import { FilterChips } from '@/components/phones/FilterChips'
import { SlidersHorizontal, Search, X, ArrowLeft } from 'lucide-react'
import type { Device } from '@/types'

export function PhonesBrowse() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'battery'>('price-asc')
  const [query, setQuery] = useState('')
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Deferred values — input stays instant, heavy grid re-render runs at idle time
  const deferredQuery = useDeferredValue(query)
  const deferredFilter = useDeferredValue(filter)
  const deferredSort = useDeferredValue(sort)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    async function loadDevices() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const res = await fetch('/api/devices?category=iphone', { signal: controller.signal })
        if (!res.ok) {
          throw new Error(`Failed to load iPhones (${res.status})`)
        }

        const data = await res.json() as { devices?: Device[] }
        setDevices(Array.isArray(data.devices) ? data.devices : [])
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        setLoadError('Unable to load phones right now. Please try again.')
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
  }, [])

  const filtered = useMemo(() => {
    return devices
      .filter((d) => {
        if (deferredQuery.trim()) {
          const q = deferredQuery.toLowerCase()
          return d.model.toLowerCase().includes(q) || d.storage.toLowerCase().includes(q) || d.color.toLowerCase().includes(q)
        }
        if (deferredFilter === 'all') return true
        if (deferredFilter === 'grade-a') return d.grade === 'A'
        if (deferredFilter === 'under-50k') return d.price < 50000
        return d.model.startsWith(deferredFilter)
      })
      .sort((a, b) => {
        if (deferredSort === 'price-asc') return a.price - b.price
        if (deferredSort === 'price-desc') return b.price - a.price
        return b.batteryHealth - a.batteryHealth
      })
  }, [devices, deferredFilter, deferredQuery, deferredSort])

  return (
    <>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #ebebeb', background: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link
                href="/gadgets"
                aria-label="Back to gadgets"
                className="flex items-center justify-center rounded-[10px] shrink-0"
                style={{ width: 36, height: 36, border: '0.5px solid #e0e0dc', background: '#fff' }}
              >
                <ArrowLeft size={14} color="#444" />
              </Link>
              <div>
                <h1 style={{ fontSize: 'clamp(22px,5vw,30px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px' }}>
                  All iPhones
                </h1>
                <p style={{ fontSize: 13, color: '#999', marginTop: 3 }}>
                  {filtered.length} available · All inspected
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
              placeholder="Search iPhone 14 Pro, Midnight, 256GB…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '11px 36px 11px 36px', borderRadius: 12, border: '1px solid #e0e0dc', fontSize: 16, color: '#060d0a', outline: 'none', background: '#fafaf8' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={14} color="#aaa" />
              </button>
            )}
          </div>

          {!query && <FilterChips onFilterChange={setFilter} />}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 16, color: '#999' }}>Loading phones...</p>
        </div>
      ) : loadError ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 16, color: '#999' }}>{loadError}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p style={{ fontSize: 48, marginBottom: 12 }}>📱</p>
          <p style={{ fontSize: 16, color: '#999' }}>No phones match this filter.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((device) => (
              <PhoneCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
