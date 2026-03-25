'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function WishlistButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const list: string[] = JSON.parse(localStorage.getItem('inexa_wishlist') ?? '[]')
    const isInList = list.includes(id)
    queueMicrotask(() => setSaved(isInList))
  }, [id])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const list: string[] = JSON.parse(localStorage.getItem('inexa_wishlist') ?? '[]')
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    localStorage.setItem('inexa_wishlist', JSON.stringify(next))
    setSaved(next.includes(id))
  }

  return (
    <button
      onClick={toggle}
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 3,
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: saved ? '#fee2e2' : 'rgba(255,255,255,0.85)',
        border: `1px solid ${saved ? '#fca5a5' : '#ebebeb'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.2s',
      }}
      title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <Heart size={14} fill={saved ? '#ef4444' : 'none'} color={saved ? '#ef4444' : '#aaa'} strokeWidth={2} />
    </button>
  )
}
