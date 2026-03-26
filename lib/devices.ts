import type { Device, ProductCategory } from '@/types'
import { initDevicesTable, sql } from '@/lib/db'
import { MOCK_DEVICES } from '@/lib/mock-data'

type DeviceRow = {
  id: string
  category: ProductCategory
  model: string
  storage: string
  color: string
  grade: Device['grade']
  battery_health: number
  price: number
  original_price: number | null
  imei: string
  imei_status: Device['imeiStatus']
  icloud_locked: boolean
  status: Device['status']
  photos: unknown
  description: string | null
  specs: unknown
  created_at: Date | string
  rating: number | null
  review_count: number | null
}

function rowToDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    category: row.category,
    model: row.model,
    storage: row.storage,
    color: row.color,
    grade: row.grade,
    batteryHealth: row.battery_health,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    imei: row.imei,
    imeiStatus: row.imei_status,
    icloudLocked: row.icloud_locked,
    status: row.status,
    photos: Array.isArray(row.photos) ? (row.photos as string[]) : [],
    description: row.description ?? undefined,
    specs: row.specs as Device['specs'],
    createdAt: new Date(row.created_at).toISOString(),
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
  }
}

export async function getDeviceById(id: string): Promise<Device | null> {
  try {
    await initDevicesTable()
    const rows = await sql`SELECT * FROM devices WHERE id = ${id} LIMIT 1` as unknown as DeviceRow[]
    if (rows.length > 0) return rowToDevice(rows[0])
  } catch {
    // fallback below
  }
  return MOCK_DEVICES.find((d) => d.id === id) ?? null
}

export async function getAvailableDevices(category?: ProductCategory): Promise<Device[]> {
  try {
    await initDevicesTable()
    const rows = category
      ? await sql`SELECT * FROM devices WHERE status = 'available' AND category = ${category} ORDER BY created_at DESC`
      : await sql`SELECT * FROM devices WHERE status = 'available' ORDER BY created_at DESC`
    return (rows as unknown as DeviceRow[]).map(rowToDevice)
  } catch {
    return MOCK_DEVICES.filter((d) => d.status === 'available' && (!category || d.category === category))
  }
}

export async function getAllDeviceIds(): Promise<string[]> {
  try {
    await initDevicesTable()
    const rows = await sql`SELECT id FROM devices ORDER BY created_at DESC` as Array<{ id: string }>
    if (rows.length > 0) return rows.map((r) => r.id)
  } catch {
    // fallback below
  }
  return MOCK_DEVICES.map((d) => d.id)
}
