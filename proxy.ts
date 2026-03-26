import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Rate limit rules per route
const RATE_LIMIT_RULES: Record<string, { limit: number; windowMs: number }> = {
  '/api/auth/register':       { limit: 5,  windowMs: 10 * 60 * 1000 }, // 5 / 10 min
  '/api/auth/forgot-password':{ limit: 3,  windowMs: 15 * 60 * 1000 }, // 3 / 15 min
  '/api/auth/reset-password': { limit: 5,  windowMs: 10 * 60 * 1000 }, // 5 / 10 min
  '/api/auth/callback':       { limit: 10, windowMs:  5 * 60 * 1000 }, // 10 / 5 min (login)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Rate limiting on auth POST routes ────────────────────────────────────
  if (req.method === 'POST') {
    const rule = RATE_LIMIT_RULES[pathname]
    if (rule) {
      const ip = getClientIp(req.headers)
      const key = `${pathname}:${ip}`
      const { allowed, remaining } = await rateLimit(key, rule.limit, rule.windowMs)

      if (!allowed) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait and try again.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(rule.windowMs / 1000)),
              'X-RateLimit-Remaining': '0',
            },
          }
        )
      }

      // Attach remaining header to response for observability
      const res = NextResponse.next()
      res.headers.set('X-RateLimit-Remaining', String(remaining))
      return res
    }
  }

  // ── Admin route protection ────────────────────────────────────────────────
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!token.isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/callback',
  ],
}
