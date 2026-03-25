import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

/**
 * IP-based rate limiter backed by Neon PostgreSQL.
 * Works across serverless instances — no Redis needed.
 *
 * @param key     Unique key: `"register:<ip>"`, `"login:<ip>"`, etc.
 * @param limit   Max requests allowed in the window
 * @param windowMs  Window size in milliseconds
 * @returns { allowed: boolean, remaining: number }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const windowStart = new Date(Date.now() - windowMs).toISOString()

    // Upsert: increment count if within window, reset if window expired
    const rows = await sql`
      INSERT INTO rate_limits (key, count, window_start)
      VALUES (${key}, 1, NOW())
      ON CONFLICT (key) DO UPDATE
        SET count = CASE
          WHEN rate_limits.window_start < ${windowStart}::timestamptz
          THEN 1
          ELSE rate_limits.count + 1
        END,
        window_start = CASE
          WHEN rate_limits.window_start < ${windowStart}::timestamptz
          THEN NOW()
          ELSE rate_limits.window_start
        END
      RETURNING count
    `

    const count = rows[0]?.count ?? 1
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) }
  } catch {
    // If rate limit table doesn't exist yet, allow the request
    return { allowed: true, remaining: limit }
  }
}

/**
 * Extract real client IP from Next.js request headers.
 * Handles Vercel, Cloudflare, and direct connections.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
