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
  const isAdmin =
    !!(session.user as { isAdmin?: boolean }).isAdmin ||
    isPrimaryAdminEmail(session.user.email)
  return isAdmin ? { ok: true as const } : { ok: false as const, status: 403 }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await initDevicesTable()
  const { id } = await params
  const rows = await sql`SELECT * FROM devices WHERE id = ${id} LIMIT 1` as unknown as DeviceRow[]
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  return NextResponse.json({ device: rowToDevice(rows[0]) })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return NextResponse.json({ error: admin.status === 401 ? 'Unauthorized' : 'Forbidden' }, { status: admin.status })
  }

  await initDevicesTable()
  const { id } = await params
  const body = await request.json() as {
    category?: string
    model?: string
    storage?: string
    color?: string
    grade?: string
    batteryHealth?: number
    price?: number
    originalPrice?: number | null
    imei?: string
    imeiStatus?: string
    icloudLocked?: boolean
    status?: string
    photos?: string[]
    description?: string
    specs?: unknown
  }

  const rows = await sql`
    UPDATE devices
    SET category       = COALESCE(${body.category ?? null}, category),
        model          = COALESCE(${body.model?.trim() ?? null}, model),
        storage        = COALESCE(${body.storage?.trim() ?? null}, storage),
        color          = COALESCE(${body.color?.trim() ?? null}, color),
        grade          = COALESCE(${body.grade ?? null}, grade),
        battery_health = COALESCE(${body.batteryHealth ?? null}, battery_health),
        price          = COALESCE(${body.price ?? null}, price),
        original_price = COALESCE(${body.originalPrice ?? null}, original_price),
        imei           = COALESCE(${body.imei?.trim() ?? null}, imei),
        imei_status    = COALESCE(${body.imeiStatus ?? null}, imei_status),
        icloud_locked  = COALESCE(${body.icloudLocked ?? null}, icloud_locked),
        status         = COALESCE(${body.status ?? null}, status),
        photos         = COALESCE(${body.photos ? JSON.stringify(body.photos) : null}::jsonb, photos),
        description    = COALESCE(${body.description?.trim() ?? null}, description),
        specs          = COALESCE(${body.specs ? JSON.stringify(body.specs) : null}::jsonb, specs),
        updated_at     = NOW()
    WHERE id = ${id}
    RETURNING *
  ` as unknown as DeviceRow[]

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  return NextResponse.json({ device: rowToDevice(rows[0]) })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) {
    return NextResponse.json({ error: admin.status === 401 ? 'Unauthorized' : 'Forbidden' }, { status: admin.status })
  }
  await initDevicesTable()
  const { id } = await params
  const rows = await sql`DELETE FROM devices WHERE id = ${id} RETURNING id` as Array<{ id: string }>
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
