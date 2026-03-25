import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Review } from '@/types'

// In-memory store — replace with DB (neon) when wired
const reviewStore = new Map<string, Review[]>()

// Seed demo reviews so product pages don't look empty
const seedReviews: Review[] = [
  {
    id: 'rev_seed_1',
    deviceId: '__any__',
    userId: 'user_demo_1',
    userName: 'Priya Sharma',
    userInitials: 'PS',
    rating: 5,
    title: 'Exactly as described — totally worth it',
    body: 'Battery health was exactly as listed, the phone looks almost brand new. Delivery was fast to Kathmandu and the Inexa team was super responsive on WhatsApp. Will definitely buy again.',
    verifiedPurchase: true,
    helpful: 12,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev_seed_2',
    deviceId: '__any__',
    userId: 'user_demo_2',
    userName: 'Rohan KC',
    userInitials: 'RK',
    rating: 5,
    title: 'Grade A is genuinely Grade A',
    body: 'I was skeptical about buying a used phone online in Nepal, but Inexa changed that. The 12-point inspection is real — no scratches, clean IMEI, and the box came with original accessories. The 6-month warranty gives peace of mind.',
    verifiedPurchase: true,
    helpful: 9,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev_seed_3',
    deviceId: '__any__',
    userId: 'user_demo_3',
    userName: 'Anisha Thapa',
    userInitials: 'AT',
    rating: 4,
    title: 'Very good condition, minor scuff on frame',
    body: 'Overall super happy with the purchase. There was a tiny scuff on the frame that wasn\'t in the photos, but Inexa team credited me NPR 500 when I pointed it out. Great customer service.',
    verifiedPurchase: true,
    helpful: 6,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev_seed_4',
    deviceId: '__any__',
    userId: 'user_demo_4',
    userName: 'Bikash Rai',
    userInitials: 'BR',
    rating: 5,
    title: 'Saved NPR 40,000 vs buying new',
    body: 'Same phone, fraction of the price. Battery health was 91% as listed, performs exactly like new. IMEI check passed, iCloud is clean. Honestly, I don\'t see any reason to buy new in Nepal anymore.',
    verifiedPurchase: true,
    helpful: 18,
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function getReviews(deviceId: string): Review[] {
  const custom = reviewStore.get(deviceId) ?? []
  const seeded = seedReviews.map((r) => ({ ...r, deviceId }))
  return [...custom, ...seeded]
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await params
  const reviews = getReviews(deviceId)
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))
  return NextResponse.json(
    { reviews, avgRating, total: reviews.length, breakdown },
    {
      headers: {
        // CDN caches for 60s, browser caches for 30s, serves stale for 5min while revalidating
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

  const name = session.user.name ?? session.user.email.split('@')[0]
  const review: Review = {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    deviceId,
    userId: (session.user as { id?: string }).id ?? session.user.email,
    userName: name,
    userInitials: name.slice(0, 2).toUpperCase(),
    rating,
    title: body.title.trim().slice(0, 120),
    body: body.body.trim().slice(0, 1200),
    verifiedPurchase: false, // TODO: query orders table once DB is wired
    helpful: 0,
    createdAt: new Date().toISOString(),
  }

  const existing = reviewStore.get(deviceId) ?? []
  // Prevent duplicate review from same user
  if (existing.some((r) => r.userId === review.userId)) {
    return NextResponse.json({ error: 'You have already reviewed this product.' }, { status: 409 })
  }

  reviewStore.set(deviceId, [review, ...existing])
  return NextResponse.json({ review }, { status: 201 })
}
