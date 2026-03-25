import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Not logged in at all
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in but not admin — redirect to home, not login, to avoid leaking that /admin exists
  if (!token.isAdmin) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
