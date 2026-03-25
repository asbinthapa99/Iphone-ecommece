'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { PaymentBadges } from '@/components/ui/PaymentBadges'
import type { Order } from '@/types'

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => setOrder(data.order))
      .catch(() => {})
  }, [id])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#fff' }}>
      <div className="w-full max-w-[400px] text-center">
        {/* Success animation */}
        <div
          className="mx-auto mb-5 flex items-center justify-center rounded-full animate-scaleIn"
          style={{ width: 72, height: 72, background: '#E1F5EE' }}
        >
          <CheckCircle2 size={36} color="#1D9E75" />
        </div>

        <h1
          className="animate-blurUp"
          style={{ fontSize: 24, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.6px', marginBottom: 8 }}
        >
          Order placed!
        </h1>
        <p
          className="animate-blurUp delay-100"
          style={{ fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 24 }}
        >
          Thank you for your purchase. Our team will contact you to confirm delivery.
        </p>

        {order && (
          <div
            className="rounded-[16px] p-4 mb-5 text-left animate-fadeUp delay-200"
            style={{ border: '0.5px solid #ebebeb', background: '#fafaf8' }}
          >
            <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '0.5px solid #f0f0ee' }}>
              <div
                className="flex items-center justify-center rounded-[8px] shrink-0"
                style={{ width: 40, height: 40, background: '#f0f0ee' }}
              >
                <Package size={18} color="#888" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#060d0a' }}>
                  {order.device.model} {order.device.storage}
                </p>
                <p style={{ fontSize: 11, color: '#888' }}>Grade {order.device.grade}</p>
              </div>
            </div>
            {[
              ['Order #', order.orderNumber],
              ['Amount', `NPR ${order.amount.toLocaleString()}`],
              ['Payment', order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)],
              ['Delivery to', order.city],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: '0.5px solid #f4f4f0' }}>
                <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#060d0a' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 animate-fadeUp delay-300">
          <div
            className="flex items-center justify-center w-full py-3 rounded-[12px]"
            style={{ background: '#fafaf8', border: '0.5px solid #ebebeb' }}
          >
            <PaymentBadges compact={true} />
          </div>

          {order && (
            <Link
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-[12px]"
              style={{ background: '#f4f4f0', color: '#444', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
            >
              View order details
              <ArrowRight size={13} />
            </Link>
          )}

          <Link
            href="/phones"
            className="inline-block pt-2"
            style={{ fontSize: 12, color: '#1D9E75', textDecoration: 'none', fontWeight: 600 }}
          >
            Browse more phones →
          </Link>
        </div>
      </div>
    </main>
  )
}
