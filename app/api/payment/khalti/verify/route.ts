import { NextRequest, NextResponse } from 'next/server'
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
  const pidx = searchParams.get('pidx')

  if (!orderId || !pidx) {
    return fail('/?payment=failed')
  }

  try {
    const secretKey = process.env.KHALTI_SECRET_KEY
    if (!secretKey) {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    await initUsersTable()
    const orderRows = await sql`
      SELECT id, amount, payment_ref, payment_status
      FROM orders
      WHERE id = ${orderId}
      LIMIT 1
    `
    if (orderRows.length === 0) {
      return fail(`/order/${orderId}/confirmation?status=failed`)
    }

    const order = orderRows[0] as { id: string; amount: number; payment_ref: string | null; payment_status: string }

    if (order.payment_status === 'paid') {
      return ok(`/order/${orderId}/confirmation`)
    }

    if (!order.payment_ref || order.payment_ref !== pidx) {
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
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
      await cancelOrderAndReleaseDevice(orderId)
      return fail(`/order/${orderId}/confirmation?status=failed`)
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
