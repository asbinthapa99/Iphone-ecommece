import { NextRequest, NextResponse } from 'next/server'
import { MOCK_DEVICES } from '@/lib/mock-data'
import type { Order, PaymentMethod } from '@/types'
import { sendOrderConfirmed } from '@/lib/email'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sql, initUsersTable } from '@/lib/db'

function generateOrderNumber() {
  return 'INX' + Date.now().toString(36).toUpperCase()
}

function rowToOrder(row: Record<string, unknown>): Order {
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
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = !!(session.user as { isAdmin?: boolean }).isAdmin

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
  warrantyExtended?: boolean
  notes?: string
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: CreateOrderRequestBody = await request.json()
  const {
    deviceId,
    buyerName,
    buyerPhone,
    buyerEmail,
    deliveryAddress,
    city,
    paymentMethod,
    warrantyExtended,
    notes,
  } = body

  if (!deviceId || !buyerName || !buyerPhone || !deliveryAddress || !city || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const device = MOCK_DEVICES.find((d) => d.id === deviceId)
  if (!device) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  if (device.status !== 'available') {
    return NextResponse.json({ error: 'Device is no longer available' }, { status: 409 })
  }

  await initUsersTable()

  const amount = device.price + (warrantyExtended ? 1500 : 0)
  const orderNumber = generateOrderNumber()
  const userId = (session.user as { id?: string }).id || session.user.email!
  const email = buyerEmail || session.user.email!

  const rows = await sql`
    INSERT INTO orders (
      order_number, user_id, buyer_name, buyer_phone, buyer_email,
      delivery_address, city, payment_method, payment_status, amount,
      warranty_extended, status, notes,
      device_id, device_model, device_storage, device_grade, device_price, device_photo
    ) VALUES (
      ${orderNumber}, ${userId}, ${buyerName}, ${buyerPhone}, ${email},
      ${deliveryAddress}, ${city}, ${paymentMethod}, 'pending', ${amount},
      ${!!warrantyExtended}, 'pending', ${notes ?? null},
      ${device.id}, ${device.model}, ${device.storage}, ${device.grade}, ${device.price}, ${device.photos[0] ?? null}
    )
    RETURNING *
  `

  const order = rowToOrder(rows[0] as Record<string, unknown>)

  // Mark device as reserved in mock (until devices table exists)
  device.status = 'reserved'

  // Fire-and-forget — don't block response on email
  sendOrderConfirmed(order).catch(console.error)

  return NextResponse.json({ order }, { status: 201 })
}
