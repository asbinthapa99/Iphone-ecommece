import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const { orderId, amount } = await request.json()

  if (!orderId || !amount) {
    return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 })
  }

  const merchantId = process.env.ESEWA_MERCHANT_ID
  const secretKey = process.env.ESEWA_SECRET_KEY
  if (!merchantId || !secretKey) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/payment/esewa/callback?orderId=${orderId}`
  const failureUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/order/${orderId}/confirmation?status=failed`

  // eSewa v2 signature: HMAC-SHA256 of "total_amount,transaction_uuid,product_code"
  const transactionUuid = `${orderId}-${Date.now()}`
  const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${merchantId}`
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('base64')

  // Build eSewa payment form params
  const params = {
    amount: String(amount),
    tax_amount: '0',
    total_amount: String(amount),
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
