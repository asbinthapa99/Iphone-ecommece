'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { GradeBadge } from '@/components/trust/GradeBadge'
import { ProductForm } from '@/components/admin/ProductForm'
import type { ProductFormState, } from '@/components/admin/ProductForm'
import type { DeviceGrade } from '@/types'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const original = MOCK_DEVICES.find((d) => d.id === params.id)
  const [saved, setSaved] = useState(false)

  if (!original) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px]" style={{ color: '#888' }}>Device not found.</p>
        <Link href="/admin/products" className="text-[12px] mt-2 block" style={{ color: '#1D9E75' }}>
          Back to products
        </Link>
      </div>
    )
  }

  const handleSubmit = async (_form: ProductFormState, _inspection: Record<string, boolean>) => {
    // TODO: PATCH /api/devices/[id]
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = () => {
    // TODO: DELETE /api/devices/[id]
    router.push('/admin/products')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#888' }}>
          <ArrowLeft size={12} /> Products
        </Link>
        <Link href={`/phones/${original.id}`} target="_blank"
          className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-[8px]"
          style={{ border: '0.5px solid #e0e0dc', color: '#444' }}>
          <ExternalLink size={11} /> View listing
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[20px] font-medium tracking-tight" style={{ color: '#060d0a' }}>
          Edit: {original.model}
        </h1>
        <GradeBadge grade={original.grade as DeviceGrade} />
      </div>

      <ProductForm
        mode="edit"
        saved={saved}
        initial={{
          category: original.category,
          model: original.model,
          storage: original.storage,
          color: original.color,
          grade: original.grade,
          batteryHealth: original.batteryHealth ?? 90,
          price: original.price?.toString(),
          originalPrice: original.originalPrice?.toString(),
          imei: original.imei,
          description: original.description,
          status: original.status,
        }}
        existingPhotos={original.photos}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}
