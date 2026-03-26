import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { initDevicesTable, sql } from '@/lib/db'
import { isPrimaryAdminEmail } from '@/lib/admin-emails'

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

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return new Date(String(value)).toISOString()
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
    createdAt: toIsoDate(row.created_at),
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
  }
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { ok: false as const, status: 401 }
  const isAdmin =
    !!(session.user as { isAdmin?: boolean }).isAdmin ||
    isPrimaryAdminEmail(session.user.email)
  return isAdmin ? { ok: true as const } : { ok: false as const, status: 403 }
}

export async function GET(request: NextRequest) {
  try {
    await initDevicesTable()
  } catch (err) {
    console.error('initDevicesTable failed:', err)
    return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 })
  }
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? Number.MAX_SAFE_INTEGER)
  const includeSoldRequested = searchParams.get('includeSold') === 'true'
  let includeSold = false
  if (includeSoldRequested) {
    const session = await getServerSession(authOptions)
    includeSold = !!(
      session?.user &&
      (
        (session.user as { isAdmin?: boolean }).isAdmin ||
        isPrimaryAdminEmail(session.user.email)
      )
    )
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

  return NextResponse.json(
    { devices: rows.map(rowToDevice) },
    { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!admin.ok) {
      return NextResponse.json({ error: admin.status === 401 ? 'Unauthorized' : 'Forbidden' }, { status: admin.status })
    }
  } catch (err) {
    console.error('Auth check failed:', err)
    return NextResponse.json({ error: 'Authentication error. Please sign out and sign in again.' }, { status: 500 })
  }

  try {
    await initDevicesTable()
    const body = await request.json() as {
      category: string
      model: string
      storage: string
      color: string
      grade: string
      batteryHealth: number
      price: number
      originalPrice?: number | string | null
      imei: string
      imeiStatus?: string
      icloudLocked?: boolean
      status: string
      photos?: string[]
      description?: string
      specs?: unknown
    }

    const category = typeof body.category === 'string' ? body.category.trim().toLowerCase() : ''
    const model = typeof body.model === 'string' ? body.model.trim() : ''
    const storage = typeof body.storage === 'string' ? body.storage.trim() : ''
    const color = typeof body.color === 'string' ? body.color.trim() : ''
    const grade = typeof body.grade === 'string' ? body.grade.trim() : ''
    const status = typeof body.status === 'string' ? body.status.trim() : ''
    const imei = typeof body.imei === 'string' ? body.imei.trim() : ''
    const imeiStatus = typeof body.imeiStatus === 'string' && body.imeiStatus.trim() ? body.imeiStatus.trim() : 'clean'
    const requiresImei = category === 'iphone' || category === 'android'
    const batteryHealth = Number(body.batteryHealth)
    const price = Number(body.price)
    const rawOriginalPrice = body.originalPrice
    const originalPrice = rawOriginalPrice == null || rawOriginalPrice === ''
      ? null
      : Number(rawOriginalPrice)
    const photos = Array.isArray(body.photos) ? body.photos.filter((p) => typeof p === 'string' && p.trim()) : []

    if (!model || !category || !storage || !grade || !status) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    if (requiresImei && !imei) {
      return NextResponse.json({ error: 'IMEI is required for phone products.' }, { status: 400 })
    }
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number.' }, { status: 400 })
    }
    if (!Number.isFinite(batteryHealth) || batteryHealth < 50 || batteryHealth > 100) {
      return NextResponse.json({ error: 'Battery health must be between 50 and 100.' }, { status: 400 })
    }
    if (originalPrice != null && (!Number.isFinite(originalPrice) || originalPrice <= 0)) {
      return NextResponse.json({ error: 'Original price must be a positive number.' }, { status: 400 })
    }

    const safeImei = imei || `NA-${Date.now().toString(36)}`
    const id = `d_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    const rows = await sql`
      INSERT INTO devices (
        id, category, model, storage, color, grade, battery_health, price, original_price,
        imei, imei_status, icloud_locked, status, photos, description, specs, created_at, updated_at
      ) VALUES (
        ${id}, ${category}, ${model}, ${storage}, ${color},
        ${grade}, ${Math.round(batteryHealth)}, ${Math.round(price)}, ${originalPrice == null ? null : Math.round(originalPrice)},
        ${safeImei}, ${imeiStatus}, ${!!body.icloudLocked}, ${status},
        ${JSON.stringify(photos)}::jsonb, ${body.description?.trim() ?? null},
        ${body.specs ? JSON.stringify(body.specs) : null}::jsonb, NOW(), NOW()
      )
      RETURNING *
    ` as unknown as DeviceRow[]

    return NextResponse.json({ device: rowToDevice(rows[0]) }, { status: 201 })
  } catch (err) {
    console.error('Failed to create product:', err)
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 })
  }
}
