'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Device } from '@/types'
import { WishlistButton } from '@/components/phones/WishlistButton'
import { Star, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useAuth } from '@/components/auth/AuthProvider'

const getRating = (id: string) => {
  const seed = id.charCodeAt(0) + (id.charCodeAt(1) || 0)
  const rating = 4 + (seed % 10) / 10
  const count = 2000 + (seed * 73) % 80000
  return { rating, count }
}

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`

const STARS = [1, 2, 3, 4, 5]

export function PhoneCard({ device }: { device: Device }) {
  const { addItem, hasItem, removeItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const inCart = hasItem(device.id)

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push(`/checkout/${device.id}`)
    } else {
      router.push(`/login?callbackUrl=/checkout/${device.id}`)
    }
  }

  const handleCartToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inCart) {
      removeItem(device.id)
    } else {
      addItem({
        deviceId: device.id,
        model: device.model,
        storage: device.storage,
        color: device.color,
        grade: device.grade,
        price: device.price,
        originalPrice: device.originalPrice,
        photo: device.photos[0],
      })
    }
  }

  const savingsPct = device.originalPrice && device.originalPrice > device.price
    ? Math.round(((device.originalPrice - device.price) / device.originalPrice) * 100)
    : null

  const { rating, count } = device.rating
    ? { rating: device.rating, count: device.reviewCount || 0 }
    : getRating(device.id)

  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3

  return (
    <div className="bg-white flex flex-col relative group rounded-[16px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] transition-all duration-300">

      {/* Savings badge top-left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {savingsPct && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#e8f5e9] text-[10px] font-bold text-[#2e7d32] tracking-wide uppercase">
            -{savingsPct}%
          </span>
        )}
        {device.status === 'available' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#fef9c3] text-[10px] font-bold text-[#854d0e] tracking-wide uppercase">
            Only 1 left
          </span>
        )}
      </div>

      {/* Wishlist top-right */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton id={device.id} />
      </div>

      {/* Image — pure white, phone floats */}
      <Link
        href={`/phones/${device.id}`}
        className="block relative flex items-center justify-center bg-white rounded-t-[16px] overflow-hidden"
        style={{ minHeight: 200, paddingTop: 24, paddingBottom: 16 }}
      >
        {device.photos[0] ? (
          <Image
            src={device.photos[0]}
            alt={`${device.model} ${device.storage} ${device.color}`}
            width={160}
            height={160}
            loading="lazy"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ maxHeight: 160, width: 'auto', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}
            unoptimized
          />
        ) : (
          <span className="text-[72px] opacity-20 select-none">📱</span>
        )}

        {device.status !== 'available' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-t-[16px]">
            <span className="text-[11px] font-bold text-white bg-black px-4 py-1.5 rounded-full tracking-wide">SOLD OUT</span>
          </div>
        )}
      </Link>

      {/* Divider */}
      <div style={{ height: 1, background: '#f5f5f5' }} />

      {/* Info */}
      <div className="flex flex-col px-4 pt-3 pb-4 flex-1">

        {/* Model name */}
        <Link href={`/phones/${device.id}`}>
          <h3 className="text-[16px] font-bold text-[#111] leading-snug tracking-tight mb-0.5 hover:text-[#1D9E75] transition-colors">
            {device.model}
          </h3>
        </Link>

        {/* Specs line */}
        <p className="text-[12px] text-[#666] mb-2 leading-snug">
          {device.color} · {device.storage}
          {device.imeiStatus === 'clean' && ' · Physical SIM + eSIM'}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {STARS.map((s) => (
              <Star
                key={s}
                size={11}
                strokeWidth={0}
                fill={s <= fullStars ? '#f5a623' : s === fullStars + 1 && hasHalf ? 'url(#half)' : '#e0e0e0'}
                className="shrink-0"
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[#444] ml-0.5">{rating.toFixed(1)}/5</span>
          <span className="text-[11px] text-[#999]">({formatCount(count)})</span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-[#888] tracking-wide mb-0.5">PRICE</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] md:text-[22px] font-bold text-[#111] tracking-tight leading-none">
                NPR {device.price.toLocaleString()}
              </span>
            </div>
            {device.originalPrice && device.originalPrice > device.price && (
              <span className="text-[11px] font-medium text-[#999] line-through mt-1 leading-none">
                NPR {device.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {device.status === 'available' && (
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Add to cart */}
              <button
                onClick={handleCartToggle}
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{
                  width: 34, height: 34,
                  background: inCart ? '#E1F5EE' : '#f4f4f0',
                  border: inCart ? '1.5px solid #1D9E75' : '1px solid transparent',
                  cursor: 'pointer',
                }}
                aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
              >
                {inCart
                  ? <Check size={14} color="#1D9E75" strokeWidth={2.5} />
                  : <ShoppingCart size={13} color="#555" />
                }
              </button>
              {/* Buy */}
              <button
                onClick={handleBuy}
                className="bg-[#111] text-white hover:bg-[#1D9E75] hover:scale-105 active:scale-95 text-[13px] font-bold px-5 py-2.5 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              >
                Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
