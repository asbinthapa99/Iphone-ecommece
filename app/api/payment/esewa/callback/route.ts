import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const data = searchParams.get('data') // eSewa base64 encoded response

  if (!orderId || !data) {
    return NextResponse.redirect(new URL('/?payment=failed', request.url))
  }

  try {
    // Decode eSewa response
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
    const { transaction_uuid, total_amount, status, signature } = decoded

    // Verify signature
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

    // Update order in Supabase (skipped in dev — add Supabase call here)
    // await updateOrderPayment(orderId, 'paid', transaction_uuid)

    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation`, request.url)
    )
  } catch {
    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
    )
  }
}
