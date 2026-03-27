import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = (token as { isAdmin?: boolean } | null)?.isAdmin

    // Authenticated but not admin → kick to home
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  },
  {
    callbacks: {
      // Not authenticated at all → NextAuth redirects to /login automatically
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: ['/admin/:path*'],
}
