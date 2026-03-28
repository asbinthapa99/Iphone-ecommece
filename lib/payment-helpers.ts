import { sql } from '@/lib/db'

/**
 * Cancels an order and releases its device back to 'available'.
 * Safe to call multiple times — uses conditional WHERE clauses.
 */
export async function cancelOrderAndReleaseDevice(orderId: string) {
  // Update order to cancelled + failed payment
  await sql`
    UPDATE orders
    SET status = 'cancelled', payment_status = 'failed', updated_at = NOW()
    WHERE id = ${orderId}
      AND status NOT IN ('confirmed', 'shipped', 'delivered')
  `
  // Release device — only if still reserved (not sold/delivered)
  await sql`
    UPDATE devices SET status = 'available', updated_at = NOW()
    WHERE id = (
      SELECT device_id FROM orders WHERE id = ${orderId} LIMIT 1
    )
    AND status = 'reserved'
  `
}
