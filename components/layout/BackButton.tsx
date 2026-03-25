'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 font-medium rounded-full transition-all duration-200 animate-fadeUp"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(6,13,10,0.80)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.12)',
        fontSize: 13,
        padding: '10px 18px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(6,13,10,0.92)'
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(6,13,10,0.80)'
        ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
      }}
    >
      <ArrowLeft size={14} />
      Back
    </button>
  )
}
