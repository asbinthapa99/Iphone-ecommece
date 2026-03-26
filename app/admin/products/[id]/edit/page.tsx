'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GradeBadge } from '@/components/trust/GradeBadge'
import { ProductForm, specsFormToDeviceSpecs } from '@/components/admin/ProductForm'
import type { ProductFormState, SpecsFormState } from '@/components/admin/ProductForm'
import type { Device, DeviceSpecs, DeviceGrade } from '@/types'
import { MOCK_DEVICES } from '@/lib/mock-data'

function toSpecsForm(specs?: DeviceSpecs): Partial<SpecsFormState> {
  if (!specs) return {}
  return {
    durability: specs.durability?.toString() ?? '',
    performance: specs.performance?.toString() ?? '',
    camera: specs.camera?.toString() ?? '',
    screen: specs.screen?.toString() ?? '',
    brand: specs.brand ?? '',
    manufacturerRef: specs.manufacturerRef ?? '',
    weight: specs.weight ?? '',
    series: specs.series ?? '',
    releaseYear: specs.releaseYear?.toString() ?? '',
    memoryGB: specs.memoryGB?.toString() ?? '',
    sdCardSlot: specs.sdCardSlot === true ? 'yes' : specs.sdCardSlot === false ? 'no' : '',
    connector: specs.connector ?? '',
    mobileNetwork: specs.mobileNetwork ?? '',
    simCard: specs.simCard ?? '',
    screenSize: specs.screenSize?.toString() ?? '',
    screenType: specs.screenType ?? '',
    resolution: specs.resolution ?? '',
    mainCamera: specs.mainCamera?.toString() ?? '',
    frontCamera: specs.frontCamera?.toString() ?? '',
    os: specs.os ?? '',
    foldable: specs.foldable === true ? 'yes' : specs.foldable === false ? 'no' : '',
    compatibleWithLatestUpdate: specs.compatibleWithLatestUpdate === true ? 'yes' : specs.compatibleWithLatestUpdate === false ? 'no' : '',
    longDescription: specs.longDescription ?? '',
    keyFeatures: specs.keyFeatures ?? [''],
    whoIsItFor: specs.whoIsItFor ?? '',
    pros: specs.pros ?? [''],
    cons: specs.cons ?? [''],
  }
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const [saved, setSaved] = useState(false)
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/devices/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to load device')
        setDevice(data.device)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load device')
      } finally {
        setLoading(false)
      }
    }
    if (id) run()
  }, [id])

  const publicListingExists = useMemo(
    () => !!device && MOCK_DEVICES.some((d) => d.id === device.id),
    [device]
  )

  if (loading) {
    return <div className="text-[13px]" style={{ color: '#888' }}>Loading device…</div>
  }

  if (!device) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px]" style={{ color: '#888' }}>{error ?? 'Device not found.'}</p>
        <Link href="/admin/products" className="text-[12px] mt-2 block" style={{ color: '#1D9E75' }}>
          Back to products
        </Link>
      </div>
    )
  }

  const handleSubmit = async (form: ProductFormState, _inspection: Record<string, boolean>) => {
    setError(null)
    const res = await fetch(`/api/devices/${id}`, {
      method: 'PATCH',
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
        status: form.status,
        description: form.description,
        specs: specsFormToDeviceSpecs(form.specs),
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? 'Failed to update product')
      return
    }
    setDevice(data.device)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleDelete = async () => {
    setError(null)
    const res = await fetch(`/api/devices/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? 'Failed to delete product')
      return
    }
    router.push('/admin/products')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#888' }}>
          <ArrowLeft size={12} /> Products
        </Link>
        {publicListingExists && (
          <Link href={`/phones/${device.id}`} target="_blank"
            className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-[8px]"
            style={{ border: '0.5px solid #e0e0dc', color: '#444' }}>
            <ExternalLink size={11} /> View listing
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[20px] font-medium tracking-tight" style={{ color: '#060d0a' }}>
          Edit: {device.model}
        </h1>
        <GradeBadge grade={device.grade as DeviceGrade} />
      </div>

      {error && <p className="mb-4 text-[12px]" style={{ color: '#e24b4a' }}>{error}</p>}

      <ProductForm
        mode="edit"
        saved={saved}
        initial={{
          category: device.category,
          model: device.model,
          storage: device.storage,
          color: device.color,
          grade: device.grade,
          batteryHealth: device.batteryHealth ?? 90,
          price: device.price?.toString(),
          originalPrice: device.originalPrice?.toString(),
          imei: device.imei,
          description: device.description,
          status: device.status,
          specs: toSpecsForm(device.specs),
        }}
        existingPhotos={device.photos}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}
