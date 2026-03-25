'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { Zap } from 'lucide-react'

interface Props {
  deviceId: string
  price: number
}

export function BuyNowButton({ deviceId, price }: Props) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (user) {
      router.push(`/checkout/${deviceId}`)
    } else {
      router.push(`/login?callbackUrl=/checkout/${deviceId}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-[12px] transition-opacity hover:opacity-90 active:scale-[0.98]"
      style={{
        background: '#060d0a',
        color: '#fff',
        fontSize: 15,
        fontWeight: 700,
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <Zap size={15} color="#1D9E75" />
      Buy Now — NPR {price.toLocaleString()}
    </button>
  )
}
