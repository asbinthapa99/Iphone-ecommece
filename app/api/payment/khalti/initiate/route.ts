import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId, amount } = await request.json()

  if (!orderId || !amount) {
    return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 })
  }

  const secretKey = process.env.KHALTI_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  try {
    const res = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: `${baseUrl}/api/payment/khalti/verify?orderId=${orderId}`,
        website_url: baseUrl,
        amount: amount * 100, // Khalti uses paisa
        purchase_order_id: orderId,
        purchase_order_name: `Inexa Nepal - Order ${orderId}`,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.detail ?? 'Khalti initiation failed' }, { status: 400 })
    }

    return NextResponse.json({ paymentUrl: data.payment_url, pidx: data.pidx })
  } catch {
    return NextResponse.json({ error: 'Khalti service unavailable' }, { status: 503 })
  }
}
