import { NextRequest, NextResponse } from 'next/server'
import { sql, initUsersTable } from '@/lib/db'

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

    await initUsersTable()
    const orderRows = await sql`
      SELECT id, amount, payment_ref, payment_status
      FROM orders
      WHERE id = ${orderId}
      LIMIT 1
    `
    if (orderRows.length === 0) {
      return NextResponse.redirect(new URL(`/order/${orderId}/confirmation?status=failed`, request.url))
    }
    const order = orderRows[0] as { id: string; amount: number; payment_ref: string | null; payment_status: string }
    if (order.payment_status === 'paid') {
      return NextResponse.redirect(new URL(`/order/${orderId}/confirmation`, request.url))
    }
    if (!order.payment_ref || order.payment_ref !== pidx) {
      return NextResponse.redirect(new URL(`/order/${orderId}/confirmation?status=failed`, request.url))
    }

    const res = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    })

    const data = await res.json()

    const lookupOrderId = typeof data?.purchase_order_id === 'string' ? data.purchase_order_id : null
    const lookupTotal = Number(data?.total_amount)
    if (
      !res.ok ||
      data?.status !== 'Completed' ||
      data?.pidx !== pidx ||
      !Number.isFinite(lookupTotal) ||
      lookupTotal !== order.amount * 100 ||
      (lookupOrderId !== null && lookupOrderId !== orderId)
    ) {
      return NextResponse.redirect(
        new URL(`/order/${orderId}/confirmation?status=failed`, request.url)
      )
    }

    await sql`
      UPDATE orders
      SET payment_status = 'paid',
          payment_ref    = ${pidx},
          status         = 'confirmed',
          updated_at     = NOW()
      WHERE id = ${orderId}
        AND payment_ref = ${pidx}
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
