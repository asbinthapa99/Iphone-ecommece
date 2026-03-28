import { NextRequest, NextResponse } from 'next/server'
import type { Order, PaymentMethod } from '@/types'
import { sendOrderConfirmed, sendAdminNewOrder } from '@/lib/email'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sql, initDevicesTable, initUsersTable } from '@/lib/db'
import { isPrimaryAdminEmail } from '@/lib/admin-emails'

function generateOrderNumber() {
  return 'INX' + Date.now().toString(36).toUpperCase()
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return new Date(String(value)).toISOString()
}

export function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    userId: row.user_id as string | undefined,
    buyerName: row.buyer_name as string,
    buyerPhone: row.buyer_phone as string,
    buyerEmail: row.buyer_email as string,
    deliveryAddress: row.delivery_address as string,
    city: row.city as string,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as Order['paymentStatus'],
    paymentRef: row.payment_ref as string | undefined,
    amount: row.amount as number,
    warrantyExtended: row.warranty_extended as boolean,
    status: row.status as Order['status'],
    notes: row.notes as string | undefined,
    trackingNumber: row.tracking_number as string | undefined,
    device: {
      deviceId: row.device_id as string,
      model: row.device_model as string,
      storage: row.device_storage as string,
      grade: row.device_grade as Order['device']['grade'],
      price: row.device_price as number,
      photo: row.device_photo as string | undefined,
    },
    createdAt: toIsoDate(row.created_at),
    updatedAt: toIsoDate(row.updated_at),
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin =
    !!(session.user as { isAdmin?: boolean }).isAdmin ||
    isPrimaryAdminEmail(session.user.email)

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)))
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  await initUsersTable()

  // Build WHERE clauses
  const conditions: string[] = []
  const args: unknown[] = []
  let argIdx = 1

  if (!isAdmin) {
    conditions.push(`buyer_email = $${argIdx++}`)
    args.push(session.user.email)
  } else if (userId) {
    conditions.push(`user_id = $${argIdx++}`)
    args.push(userId)
  }

  if (status) {
    conditions.push(`status = $${argIdx++}`)
    args.push(status)
  }

  if (search) {
    conditions.push(`(
      order_number ILIKE $${argIdx} OR
      buyer_name   ILIKE $${argIdx} OR
      buyer_phone  ILIKE $${argIdx} OR
      device_model ILIKE $${argIdx}
    )`)
    args.push(`%${search}%`)
    argIdx++
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Total count — neon sql.query() returns rows array directly
  const countRows = await sql.query(
    `SELECT COUNT(*) AS total FROM orders ${where}`,
    args
  )
  const total = Number((countRows as unknown as Array<{ total: string }>)[0].total)
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit

  const orderRows = await sql.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT $${argIdx} OFFSET $${argIdx + 1}`,
    [...args, limit, offset]
  )

  const orders = (orderRows as unknown as Array<Record<string, unknown>>).map(rowToOrder)
  return NextResponse.json({ orders, pagination: { total, page, limit, totalPages } })
}

interface CreateOrderRequestBody {
  deviceId: string
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  deliveryAddress: string
  city: string
  paymentMethod: PaymentMethod
  paymentStatus?: 'pending' | 'paid'
  paymentRef?: string
  warrantyExtended?: boolean
  notes?: string
}

type DeviceForOrderRow = {
  id: string
  model: string
  storage: string
  grade: string
  price: number
  photos: unknown
  status: string
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const body = payload as Partial<CreateOrderRequestBody>
  const {
    deviceId,
    buyerName,
    buyerPhone,
    buyerEmail,
    deliveryAddress,
    city,
    paymentMethod,
    paymentStatus,
    paymentRef,
    warrantyExtended,
    notes,
  } = body

  if (
    typeof deviceId !== 'string' ||
    typeof buyerName !== 'string' ||
    typeof buyerPhone !== 'string' ||
    typeof deliveryAddress !== 'string' ||
    typeof city !== 'string' ||
    typeof paymentMethod !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (buyerName.trim().length < 2 || buyerName.length > 120) {
    return NextResponse.json({ error: 'Invalid buyer name' }, { status: 400 })
  }
  if (buyerPhone.trim().length < 7 || buyerPhone.length > 25) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }
  if (deliveryAddress.trim().length < 5 || deliveryAddress.length > 250) {
    return NextResponse.json({ error: 'Invalid delivery address' }, { status: 400 })
  }
  if (city.trim().length < 2 || city.length > 80) {
    return NextResponse.json({ error: 'Invalid city' }, { status: 400 })
  }
  const allowedMethods: PaymentMethod[] = ['esewa', 'khalti', 'cod', 'bank_transfer', 'qr']
  if (!allowedMethods.includes(paymentMethod as PaymentMethod)) {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  }
  if (paymentStatus != null && paymentStatus !== 'pending' && paymentStatus !== 'paid') {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
  }
  if (buyerEmail != null) {
    if (typeof buyerEmail !== 'string' || buyerEmail.length > 160) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const e = buyerEmail.toLowerCase().trim()
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
  }
  if (notes != null && (typeof notes !== 'string' || notes.length > 1000)) {
    return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
  }
  if (warrantyExtended != null && typeof warrantyExtended !== 'boolean') {
    return NextResponse.json({ error: 'Invalid warranty flag' }, { status: 400 })
  }

  await initDevicesTable()

  // First check device exists at all
  const deviceCheck = await sql`
    SELECT id FROM devices WHERE id = ${deviceId} LIMIT 1
  ` as unknown as { id: string }[]
  if (deviceCheck.length === 0) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }

  // Atomic reserve: only succeeds if status is still 'available'.
  // Eliminates the read-check-then-update race condition — two concurrent
  // requests cannot both pass this; only one UPDATE will match the WHERE.
  const reserved = await sql`
    UPDATE devices
    SET status = 'reserved', updated_at = NOW()
    WHERE id = ${deviceId} AND status = 'available'
    RETURNING id, model, storage, grade, price, photos
  ` as unknown as DeviceForOrderRow[]

  if (reserved.length === 0) {
    return NextResponse.json({ error: 'Device is no longer available' }, { status: 409 })
  }
  const device = reserved[0]

  await initUsersTable()

  const amount = device.price + (warrantyExtended ? 1500 : 0)
  const orderNumber = generateOrderNumber()
  const userId = (session.user as { id?: string }).id || session.user.email!
  const email = typeof buyerEmail === 'string' && buyerEmail.trim()
    ? buyerEmail.toLowerCase().trim()
    : session.user.email!
  const photoList = Array.isArray(device.photos) ? (device.photos as string[]) : []

  const ref = typeof paymentRef === 'string' && paymentRef.trim() ? paymentRef.trim() : null

  // Always start as 'pending' — never trust client-supplied paymentStatus
  let rows
  try {
    rows = await sql`
      INSERT INTO orders (
        order_number, user_id, buyer_name, buyer_phone, buyer_email,
        delivery_address, city, payment_method, payment_status, payment_ref, amount,
        warranty_extended, status, notes,
        device_id, device_model, device_storage, device_grade, device_price, device_photo
      ) VALUES (
        ${orderNumber}, ${userId}, ${buyerName}, ${buyerPhone}, ${email},
        ${deliveryAddress}, ${city}, ${paymentMethod}, 'pending', ${ref}, ${amount},
        ${!!warrantyExtended}, 'pending', ${notes ?? null},
        ${device.id}, ${device.model}, ${device.storage}, ${device.grade}, ${device.price}, ${photoList[0] ?? null}
      )
      RETURNING *
    `
  } catch (insertErr) {
    // Roll back the device reservation so it can be purchased again
    await sql`
      UPDATE devices SET status = 'available', updated_at = NOW()
      WHERE id = ${device.id} AND status = 'reserved'
    `.catch(console.error)
    const msg = insertErr instanceof Error ? insertErr.message : String(insertErr)
    console.error('[orders POST] INSERT failed:', msg)
    return NextResponse.json({ error: `Order could not be saved: ${msg}` }, { status: 500 })
  }

  const order = rowToOrder(rows[0] as Record<string, unknown>)

  // Fire-and-forget — don't block response on emails
  sendOrderConfirmed(order).catch(console.error)
  sendAdminNewOrder(order).catch(console.error)

  return NextResponse.json({ order }, { status: 201 })
}
