'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm, specsFormToDeviceSpecs } from '@/components/admin/ProductForm'
import type { ProductFormState } from '@/components/admin/ProductForm'
import type { DeviceGrade } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (form: ProductFormState, _inspection: Record<string, boolean>) => {
    setError(null)
    const res = await fetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: form.category,
        model: form.model,
        storage: form.storage,
        color: form.color,
        grade: form.grade as DeviceGrade,
        batteryHealth: form.batteryHealth,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        imei: form.imei,
        imeiStatus: 'clean',
        icloudLocked: false,
        status: form.status,
        photos: form.photos,
        description: form.description,
        specs: specsFormToDeviceSpecs(form.specs),
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? 'Failed to create product')
      return
    }

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push('/admin/products')
    }, 600)
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-6" style={{ color: '#888' }}>
        <ArrowLeft size={12} /> Products
      </Link>
      <h1 className="text-[20px] font-medium tracking-tight mb-6" style={{ color: '#060d0a' }}>
        Add New Product
      </h1>
      {error && (
        <p className="mb-4 text-[12px]" style={{ color: '#e24b4a' }}>{error}</p>
      )}
      <ProductForm mode="new" saved={saved} onSubmit={handleSubmit} />
    </div>
  )
}
