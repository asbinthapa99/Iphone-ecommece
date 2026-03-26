import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sql, initUsersTable } from '@/lib/db'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId } = await request.json()

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  const merchantId = process.env.ESEWA_MERCHANT_ID
  const secretKey = process.env.ESEWA_SECRET_KEY
  if (!merchantId || !secretKey) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })

  await initUsersTable()
  const rows = await sql`
    SELECT id, amount, buyer_email, payment_status
    FROM orders
    WHERE id = ${orderId}
    LIMIT 1
  `
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  const order = rows[0] as { id: string; amount: number; buyer_email: string; payment_status: string }
  if (order.buyer_email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (order.payment_status === 'paid') {
    return NextResponse.json({ error: 'Order is already paid' }, { status: 409 })
  }

  const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/payment/esewa/callback?orderId=${orderId}`
  const failureUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/order/${orderId}/confirmation?status=failed`

  // eSewa v2 signature: HMAC-SHA256 of "total_amount,transaction_uuid,product_code"
  const transactionUuid = `${orderId}-${Date.now()}`
  const message = `total_amount=${order.amount},transaction_uuid=${transactionUuid},product_code=${merchantId}`
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('base64')

  await sql`
    UPDATE orders
    SET payment_ref = ${transactionUuid},
        updated_at = NOW()
    WHERE id = ${orderId}
  `

  // Build eSewa payment form params
  const params = {
    amount: String(order.amount),
    tax_amount: '0',
    total_amount: String(order.amount),
    transaction_uuid: transactionUuid,
    product_code: merchantId,
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  }

  // Return form URL + params for client-side form submission
  return NextResponse.json({
    formUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    params,
  })
}
