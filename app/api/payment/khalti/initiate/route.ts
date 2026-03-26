import { NextRequest, NextResponse } from 'next/server'
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

  const secretKey = process.env.KHALTI_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

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
        amount: order.amount * 100, // Khalti uses paisa
        purchase_order_id: orderId,
        purchase_order_name: `Inexa Nepal - Order ${orderId}`,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.detail ?? 'Khalti initiation failed' }, { status: 400 })
    }

    if (!data?.pidx || !data?.payment_url) {
      return NextResponse.json({ error: 'Invalid payment gateway response' }, { status: 502 })
    }

    await sql`
      UPDATE orders
      SET payment_ref = ${data.pidx},
          updated_at = NOW()
      WHERE id = ${orderId}
    `

    return NextResponse.json({ paymentUrl: data.payment_url, pidx: data.pidx })
  } catch {
    return NextResponse.json({ error: 'Khalti service unavailable' }, { status: 503 })
  }
}
