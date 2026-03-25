'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductForm } from '@/components/admin/ProductForm'
import type { ProductFormState } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (_form: ProductFormState, _inspection: Record<string, boolean>) => {
    // TODO: POST /api/devices with form data
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[12px] font-medium mb-6" style={{ color: '#888' }}>
        <ArrowLeft size={12} /> Products
      </Link>
      <h1 className="text-[20px] font-medium tracking-tight mb-6" style={{ color: '#060d0a' }}>
        Add New Product
      </h1>
      <ProductForm mode="new" saved={saved} onSubmit={handleSubmit} />
    </div>
  )
}
