'use client'

import { useEffect, useState } from 'react'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { PhoneCard } from '@/components/phones/PhoneCard'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    const list: string[] = JSON.parse(localStorage.getItem('inexa_wishlist') ?? '[]')
    queueMicrotask(() => setIds(list))
  }, [])

  const devices = MOCK_DEVICES.filter((d) => ids.includes(d.id))

  return (
    <main style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-6xl mx-auto px-4 py-5 sm:py-8">
          <Link href="/account" className="inline-flex items-center gap-1.5 mb-4" style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}>
            <ArrowLeft size={12} /> Back to account
          </Link>
          <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, color: '#060d0a', letterSpacing: '-0.5px' }}>
            Saved Phones
          </h1>
          <p style={{ fontSize: 13, color: '#999', marginTop: 3 }}>{devices.length} saved</p>
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="max-w-sm mx-auto px-4 py-20 text-center">
          <Heart size={40} color="#e0e0dc" style={{ margin: '0 auto 14px' }} />
          <p style={{ fontSize: 16, fontWeight: 700, color: '#060d0a', marginBottom: 6 }}>No saved phones yet</p>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Tap the heart on any listing to save it here.</p>
          <Link href="/phones"
            style={{ background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 12, textDecoration: 'none', display: 'inline-block' }}>
            Browse Phones
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ borderLeft: '1px solid #ebebeb' }}>
            {devices.map((device) => (
              <PhoneCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
