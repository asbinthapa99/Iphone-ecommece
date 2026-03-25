import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const pidx = searchParams.get('pidx')

  if (!orderId || !pidx) {
    return NextResponse.redirect(new URL('/?payment=failed', request.url))
  }

  try {
    const secretKey = process.env.KHALTI_SECRET_KEY
    if (!secretKey) return NextResponse.redirect(new URL(`/order/${orderId}/confirmation?status=failed`, request.url))

    const res = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    })

    const data = await res.json()

    if (!res.ok || data.status !== 'Completed') {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
    }

    // Update order payment status in Supabase here
    // await updateOrderPayment(orderId, 'paid', pidx)

    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation`, request.url)
    )
  } catch {
    return NextResponse.redirect(
      new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
    )
  }
}
