import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/types'
import { sendPaymentSuccess, sendDeliveryInProcess, sendDelivered, sendOrderCancelled } from '@/lib/email'
import { sql, initUsersTable } from '@/lib/db'
import { isPrimaryAdminEmail } from '@/lib/admin-emails'

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString()
  return new Date(String(value)).toISOString()
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
    paymentStatus: row.payment_status as PaymentStatus,
    paymentRef: row.payment_ref as string | undefined,
    amount: row.amount as number,
    warrantyExtended: row.warranty_extended as boolean,
    status: row.status as OrderStatus,
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await initUsersTable()

  const rows = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const order = rowToOrder(rows[0] as Record<string, unknown>)
  const isAdmin =
    !!(session.user as { isAdmin?: boolean }).isAdmin ||
    isPrimaryAdminEmail(session.user.email)

  // Non-admins can only view their own orders
  if (!isAdmin && order.buyerEmail !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const isAdmin =
    !!(session.user as { isAdmin?: boolean }).isAdmin ||
    isPrimaryAdminEmail(session.user.email)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, paymentStatus, trackingNumber, notes } = body as {
    status?: OrderStatus
    paymentStatus?: PaymentStatus
    trackingNumber?: string
    notes?: string
  }

  const allowedStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  const allowedPaymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'refunded']

  if (status != null && !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }
  if (paymentStatus != null && !allowedPaymentStatuses.includes(paymentStatus)) {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
  }
  if (trackingNumber != null && (typeof trackingNumber !== 'string' || trackingNumber.length > 100)) {
    return NextResponse.json({ error: 'Invalid tracking number' }, { status: 400 })
  }
  if (notes != null && (typeof notes !== 'string' || notes.length > 1000)) {
    return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
  }

  await initUsersTable()

  // Fetch existing to merge + send correct emails
  const existing = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const rows = await sql`
    UPDATE orders SET
      status           = COALESCE(${status ?? null}, status),
      payment_status   = COALESCE(${paymentStatus ?? null}, payment_status),
      tracking_number  = COALESCE(${trackingNumber ?? null}, tracking_number),
      notes            = COALESCE(${notes ?? null}, notes),
      updated_at       = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  const order = rowToOrder(rows[0] as Record<string, unknown>)

  // When cancelled, release the device back to available so it can be purchased again
  if (status === 'cancelled') {
    await sql`
      UPDATE devices SET status = 'available', updated_at = NOW()
      WHERE id = ${order.device.deviceId} AND status = 'reserved'
    `
  }

  if (paymentStatus === 'paid') sendPaymentSuccess(order).catch(console.error)
  if (status === 'shipped') sendDeliveryInProcess({ ...order, trackingNumber }).catch(console.error)
  if (status === 'delivered') sendDelivered(order).catch(console.error)
  if (status === 'cancelled') sendOrderCancelled(order).catch(console.error)

  return NextResponse.json({ order })
}
