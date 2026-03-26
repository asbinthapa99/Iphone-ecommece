import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Review } from '@/types'
import { sql, initUsersTable } from '@/lib/db'

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    deviceId: row.device_id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    userInitials: row.user_initials as string,
    rating: row.rating as number,
    title: row.title as string,
    body: row.body as string,
    verifiedPurchase: row.verified_purchase as boolean,
    helpful: row.helpful as number,
    photos: Array.isArray(row.photos) ? (row.photos as string[]) : [],
    createdAt: (row.created_at as Date).toISOString(),
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await params
  await initUsersTable()

  const rows = await sql`
    SELECT * FROM reviews WHERE device_id = ${deviceId} ORDER BY created_at DESC
  `
  const reviews = rows.map((r) => rowToReview(r as Record<string, unknown>))

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return NextResponse.json(
    { reviews, avgRating, total: reviews.length, breakdown },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'You must be logged in to leave a review.' }, { status: 401 })
  }

  const { deviceId } = await params
  const body = await req.json()

  const rating = Number(body.rating)
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5.' }, { status: 400 })
  }
  if (!body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: 'Title and review text are required.' }, { status: 400 })
  }

  await initUsersTable()

  const name = session.user.name ?? session.user.email.split('@')[0]
  const userId = (session.user as { id?: string }).id ?? session.user.email
  const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

  // Validate photos — must be an array of HTTPS Cloudinary URLs (already uploaded)
  const rawPhotos = Array.isArray(body.photos) ? body.photos as unknown[] : []
  const photos = rawPhotos
    .filter((u): u is string =>
      typeof u === 'string' &&
      u.startsWith('https://res.cloudinary.com/') &&
      u.length < 500
    )
    .slice(0, 3) // max 3 photos per review

  // Check if user already reviewed this device
  const verifiedRows = await sql`
    SELECT id FROM orders
    WHERE buyer_email = ${session.user.email}
      AND device_id   = ${deviceId}
      AND payment_status = 'paid'
    LIMIT 1
  `
  const verifiedPurchase = verifiedRows.length > 0

  try {
    const rows = await sql`
      INSERT INTO reviews (id, device_id, user_id, user_name, user_initials, rating, title, body, verified_purchase, photos)
      VALUES (
        ${id}, ${deviceId}, ${userId},
        ${name}, ${name.slice(0, 2).toUpperCase()},
        ${rating},
        ${body.title.trim().slice(0, 120)},
        ${body.body.trim().slice(0, 1200)},
        ${verifiedPurchase},
        ${JSON.stringify(photos)}::jsonb
      )
      RETURNING *
    `
    const review = rowToReview(rows[0] as Record<string, unknown>)
    return NextResponse.json({ review }, { status: 201 })
  } catch (err: unknown) {
    // Unique constraint violation — user already reviewed
    if ((err as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 })
    }
    throw err
  }
}
