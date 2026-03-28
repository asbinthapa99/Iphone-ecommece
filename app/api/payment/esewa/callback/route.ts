import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sql, initUsersTable } from '@/lib/db'
import { sendPaymentSuccess } from '@/lib/email'
import { rowToOrder } from '@/app/api/orders/route'
import { cancelOrderAndReleaseDevice } from '@/lib/payment-helpers'

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://inexanepal.com'
const fail = (path: string) => NextResponse.redirect(new URL(path, BASE))
const ok   = (path: string) => NextResponse.redirect(new URL(path, BASE))

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const data = searchParams.get('data') // eSewa base64 encoded response

  if (!orderId || !data) {
    return fail('/?payment=failed')
  }

  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
    const { transaction_uuid, total_amount, status, signature } = decoded

    const secretKey = process.env.ESEWA_SECRET_KEY
    const merchantId = process.env.ESEWA_MERCHANT_ID
    if (!secretKey || !merchantId) {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    const message = `transaction_uuid=${transaction_uuid},status=${status},total_amount=${total_amount},product_code=${merchantId}`
    const expectedSig = crypto.createHmac('sha256', secretKey).update(message).digest('base64')

    if (signature !== expectedSig || status !== 'COMPLETE') {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    await initUsersTable()
    const rows = await sql`
      SELECT id, amount, payment_ref, payment_status
      FROM orders
      WHERE id = ${orderId}
      LIMIT 1
    `
    if (rows.length === 0) {
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    const order = rows[0] as { id: string; amount: number; payment_ref: string | null; payment_status: string }

    if (order.payment_status === 'paid') {
      return ok(`/order/${orderId}/confirmation`)
    }

    if (!order.payment_ref || order.payment_ref !== transaction_uuid) {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    const paidAmount = Number(total_amount)
    if (!Number.isFinite(paidAmount) || paidAmount !== order.amount) {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    await sql`
      UPDATE orders
      SET payment_status = 'paid',
          payment_ref    = ${transaction_uuid},
          status         = 'confirmed',
          updated_at     = NOW()
      WHERE id = ${orderId}
        AND payment_ref = ${transaction_uuid}
    `

    const updatedOrder = await sql`SELECT * FROM orders WHERE id = ${orderId} LIMIT 1`
    if (updatedOrder.length > 0) {
      const orderObj = rowToOrder(updatedOrder[0] as Record<string, unknown>)
      sendPaymentSuccess(orderObj).catch(console.error)
    }

    return ok(`/order/${orderId}/confirmation`)
  } catch {
    await cancelOrderAndReleaseDevice(orderId).catch(console.error)
    return fail(`/order/${orderId}/confirmation?status=failed`)
  }
}
