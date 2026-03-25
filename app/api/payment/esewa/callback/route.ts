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
    await sql`
      UPDATE orders
      SET payment_status = 'paid',
          payment_ref    = ${transaction_uuid},
          status         = 'confirmed',
          updated_at     = NOW()
      WHERE id = ${orderId}
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
