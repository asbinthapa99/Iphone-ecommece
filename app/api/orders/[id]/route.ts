import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import type { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/types'
import { sendOrderConfirmed, sendOrderProcessing, sendPaymentSuccess, sendDeliveryInProcess, sendDelivered, sendOrderCancelled } from '@/lib/email'
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
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { status, paymentStatus, trackingNumber, notes } = body as {
    status?: OrderStatus
    paymentStatus?: PaymentStatus
    trackingNumber?: string
    notes?: string
  }

  const allowedStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']
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

  const previousOrder = rowToOrder(existing[0] as Record<string, unknown>)

  // ──── DEBUG: Log incoming request ────
  console.log(`[order-update] Order ${id}:`, {
    requestedStatus: status,
    requestedPaymentStatus: paymentStatus,
    previousStatus: previousOrder.status,
    previousPaymentStatus: previousOrder.paymentStatus,
    buyerEmail: previousOrder.buyerEmail,
  })

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
  const statusChanged = status != null && order.status !== previousOrder.status
  const paymentChanged = paymentStatus != null && order.paymentStatus !== previousOrder.paymentStatus

  // ──── DEBUG: Log change detection ────
  console.log(`[order-update] Change detection:`, {
    statusChanged,
    paymentChanged,
    newStatus: order.status,
    newPaymentStatus: order.paymentStatus,
    buyerEmail: order.buyerEmail,
    hasBuyerEmail: !!order.buyerEmail,
  })

  // When cancelled, release the device back to available so it can be purchased again
  if (statusChanged && status === 'cancelled') {
    await sql`
      UPDATE devices SET status = 'available', updated_at = NOW()
      WHERE id = ${order.device.deviceId} AND status = 'reserved'
    `
  }

  const notifications: Record<string, { attempted: boolean; sent: boolean; error?: string }> = {}

  if (statusChanged && status === 'confirmed') {
    console.log(`[order-update] Sending ORDER CONFIRMED email to ${order.buyerEmail}...`)
    const result = await sendOrderConfirmed(order)
    console.log(`[order-update] Order confirmed email result:`, result)
    notifications.orderConfirmedEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }
  if (paymentChanged && paymentStatus === 'paid') {
    console.log(`[order-update] Sending PAYMENT SUCCESS email to ${order.buyerEmail}...`)
    const result = await sendPaymentSuccess(order)
    console.log(`[order-update] Payment success email result:`, result)
    notifications.paymentSuccessEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }
  if (statusChanged && status === 'processing') {
    console.log(`[order-update] Sending ORDER PROCESSING email to ${order.buyerEmail}...`)
    const result = await sendOrderProcessing(order)
    console.log(`[order-update] Processing email result:`, result)
    notifications.processingEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }
  if (statusChanged && status === 'shipped') {
    console.log(`[order-update] Sending DELIVERY IN PROCESS email to ${order.buyerEmail}...`)
    const result = await sendDeliveryInProcess({ ...order, trackingNumber: order.trackingNumber ?? trackingNumber })
    console.log(`[order-update] Delivery in process email result:`, result)
    notifications.deliveryInProcessEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }
  if (statusChanged && status === 'delivered') {
    console.log(`[order-update] Sending DELIVERED email to ${order.buyerEmail}...`)
    const result = await sendDelivered(order)
    console.log(`[order-update] Delivered email result:`, result)
    notifications.deliveredEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }
  if (statusChanged && status === 'cancelled') {
    console.log(`[order-update] Sending CANCELLED email to ${order.buyerEmail}...`)
    const result = await sendOrderCancelled(order)
    console.log(`[order-update] Cancelled email result:`, result)
    notifications.cancelledEmail = result.ok
      ? { attempted: true, sent: true }
      : { attempted: true, sent: false, error: result.error }
  }

  if (!statusChanged && !paymentChanged) {
    console.log(`[order-update] ⚠️ No status or payment change detected — NO email will be sent.`)
  }

  console.log(`[order-update] Final notifications:`, JSON.stringify(notifications))
  return NextResponse.json({ order, notifications })
}
