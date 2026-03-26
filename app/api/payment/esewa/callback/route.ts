import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sql, initUsersTable } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const data = searchParams.get('data') // eSewa base64 encoded response

  if (!orderId || !data) {
    return NextResponse.redirect(new URL('/?payment=failed', request.url))
  }

  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
    const { transaction_uuid, total_amount, status, signature } = decoded

    const secretKey = process.env.ESEWA_SECRET_KEY
    const merchantId = process.env.ESEWA_MERCHANT_ID
    if (!secretKey || !merchantId) return NextResponse.redirect(new URL(`/order/${orderId}/confirmation?status=failed`, request.url))

    const message = `transaction_uuid=${transaction_uuid},status=${status},total_amount=${total_amount},product_code=${merchantId}`
    const expectedSig = crypto.createHmac('sha256', secretKey).update(message).digest('base64')

    if (signature !== expectedSig || status !== 'COMPLETE') {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
    }

    await initUsersTable()
    const rows = await sql`
      SELECT id, amount, payment_ref, payment_status
      FROM orders
      WHERE id = ${orderId}
      LIMIT 1
    `
    if (rows.length === 0) {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
    }
    const order = rows[0] as { id: string; amount: number; payment_ref: string | null; payment_status: string }
    if (order.payment_status === 'paid') {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation`, request.url)
      )
    }
    if (!order.payment_ref || order.payment_ref !== transaction_uuid) {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
    }
    const paidAmount = Number(total_amount)
    if (!Number.isFinite(paidAmount) || paidAmount !== order.amount) {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
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

    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation`, request.url)
    )
  } catch {
    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
    )
  }
}
