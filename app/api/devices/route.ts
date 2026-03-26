import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { initDevicesTable, sql } from '@/lib/db'

type DeviceRow = {
  id: string
  category: string
  model: string
  storage: string
  color: string
  grade: string
  battery_health: number
  price: number
  original_price: number | null
  imei: string
  imei_status: string
  icloud_locked: boolean
  status: string
  photos: unknown
  description: string | null
  specs: unknown
  created_at: Date | string
  rating: number | null
  review_count: number | null
}

function rowToDevice(row: DeviceRow) {
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
    specs: row.specs ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
  }
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { ok: false as const, status: 401 }
  const isAdmin = !!(session.user as { isAdmin?: boolean }).isAdmin
  return isAdmin ? { ok: true as const } : { ok: false as const, status: 403 }
}

export async function GET(request: NextRequest) {
  await initDevicesTable()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? Number.MAX_SAFE_INTEGER)
  const includeSoldRequested = searchParams.get('includeSold') === 'true'
  let includeSold = false
  if (includeSoldRequested) {
    const session = await getServerSession(authOptions)
    includeSold = !!(session?.user && (session.user as { isAdmin?: boolean }).isAdmin)
  }

  const args: unknown[] = []
  const conditions: string[] = []
  let argIdx = 1

  if (category) {
    conditions.push(`category = $${argIdx++}`)
    args.push(category)
  }
  if (!includeSold) {
    conditions.push(`status = 'available'`)
  }
  if (search) {
    conditions.push(`(model ILIKE $${argIdx} OR storage ILIKE $${argIdx} OR color ILIKE $${argIdx})`)
    args.push(`%${search}%`)
    argIdx++
  }
  if (Number.isFinite(minPrice) && minPrice > 0) {
    conditions.push(`price >= $${argIdx++}`)
    args.push(minPrice)
  }
  if (Number.isFinite(maxPrice) && maxPrice < Number.MAX_SAFE_INTEGER) {
    conditions.push(`price <= $${argIdx++}`)
    args.push(maxPrice)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = await sql.query(
    `SELECT * FROM devices ${where} ORDER BY created_at DESC`,
    args
  ) as unknown as DeviceRow[]

  return NextResponse.json({ devices: rows.map(rowToDevice) })
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return NextResponse.json({ error: admin.status === 401 ? 'Unauthorized' : 'Forbidden' }, { status: admin.status })
  }

  await initDevicesTable()
  const body = await request.json() as {
    category: string
    model: string
    storage: string
    color: string
    grade: string
    batteryHealth: number
    price: number
    originalPrice?: number | null
    imei: string
    imeiStatus?: string
    icloudLocked?: boolean
    status: string
    photos?: string[]
    description?: string
    specs?: unknown
  }

  if (!body.model || !body.category || !body.storage || !body.grade || !body.status || !body.imei) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }
  if (!Number.isFinite(body.price) || body.price <= 0) {
    return NextResponse.json({ error: 'Price must be a positive number.' }, { status: 400 })
  }

  const id = `d_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
  const rows = await sql`
    INSERT INTO devices (
      id, category, model, storage, color, grade, battery_health, price, original_price,
      imei, imei_status, icloud_locked, status, photos, description, specs, created_at, updated_at
    ) VALUES (
      ${id}, ${body.category}, ${body.model.trim()}, ${body.storage.trim()}, ${body.color.trim()},
      ${body.grade}, ${body.batteryHealth}, ${body.price}, ${body.originalPrice ?? null},
      ${body.imei.trim()}, ${body.imeiStatus ?? 'clean'}, ${!!body.icloudLocked}, ${body.status},
      ${JSON.stringify(body.photos ?? [])}::jsonb, ${body.description?.trim() ?? null},
      ${body.specs ? JSON.stringify(body.specs) : null}::jsonb, NOW(), NOW()
    )
    RETURNING *
  ` as unknown as DeviceRow[]

  return NextResponse.json({ device: rowToDevice(rows[0]) }, { status: 201 })
}
