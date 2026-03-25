'use client'

import { useCart } from '@/lib/cart'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react'

export default function CartPage() {
  const { items, total, removeItem, count } = useCart()

  if (count === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: '#fff' }}>
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{ width: 72, height: 72, background: '#f4f4f0' }}
        >
          <ShoppingBag size={32} color="#bbb" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 8, letterSpacing: '-0.4px' }}>
          Your cart is empty
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          Browse our verified iPhones and gadgets to get started.
        </p>
        <Link
          href="/phones"
          className="flex items-center gap-2 px-6 py-3 rounded-full"
          style={{ background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
        >
          Browse Phones <ArrowRight size={14} />
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
          Cart
        </h1>
        <span style={{ fontSize: 13, color: '#888' }}>
          {count} item{count !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cart items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.deviceId}
            className="flex items-center gap-4 rounded-[16px] p-4"
            style={{ border: '0.5px solid #ebebeb', background: '#fff' }}
          >
            {/* Image */}
            <div
              className="flex items-center justify-center rounded-[12px] shrink-0"
              style={{ width: 72, height: 72, background: '#f5f5f7' }}
            >
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt={item.model}
                  width={60}
                  height={60}
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
                  unoptimized
                />
              ) : (
                <span style={{ fontSize: 28 }}>📱</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>{item.model}</p>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                {item.color} · {item.storage} · Grade {item.grade}
              </p>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                  NPR {item.price.toLocaleString()}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>
                    NPR {item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => removeItem(item.deviceId)}
                className="flex items-center justify-center rounded-[8px] hover:bg-red-50 transition-colors"
                style={{ width: 32, height: 32, border: '0.5px solid #f0f0ee', background: '#fff', cursor: 'pointer' }}
                aria-label="Remove from cart"
              >
                <Trash2 size={13} color="#dc2626" />
              </button>
              <Link
                href={`/checkout/${item.deviceId}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]"
                style={{ background: '#060d0a', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}
              >
                Buy <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-[16px] p-5 mb-4" style={{ border: '0.5px solid #ebebeb', background: '#fafaf8' }}>
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: 13, color: '#666' }}>{count} item{count !== 1 ? 's' : ''}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>NPR {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span style={{ fontSize: 13, color: '#666' }}>Delivery</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1D9E75' }}>Free</span>
        </div>
        <div className="flex justify-between pt-3" style={{ borderTop: '1px solid #ebebeb' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.4px' }}>
            NPR {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <ShieldCheck size={13} color="#1D9E75" />
        <span style={{ fontSize: 11, color: '#666' }}>6-month Inexa warranty on all phones</span>
        <Tag size={11} color="#888" className="ml-auto" />
        <span style={{ fontSize: 11, color: '#666' }}>IMEI verified</span>
      </div>

      {/* Note: each phone is unique — checkout per item */}
      {count > 1 && (
        <p style={{ fontSize: 11, color: '#aaa', marginBottom: 16, textAlign: 'center' }}>
          Each device is unique. Click &quot;Buy&quot; on the item you want to checkout first.
        </p>
      )}

      <Link
        href="/phones"
        style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#1D9E75', fontWeight: 600, textDecoration: 'none', marginTop: 8 }}
      >
        ← Continue Shopping
      </Link>
    </main>
  )
}
