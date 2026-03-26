import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadImages } from '@/lib/upload'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const LIMITS = {
  products: { maxFiles: 12, maxBytes: 5 * 1024 * 1024 },  // 12 photos, 5 MB each
  reviews:  { maxFiles: 3,  maxBytes: 3 * 1024 * 1024 },  // 3 photos, 3 MB each
} as const

type UploadFolder = keyof typeof LIMITS

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'You must be logged in to upload files.' }, { status: 401 })
  }

  // ── Rate limit: 30 uploads per user per hour ───────────────────────────────
  const ip = getClientIp(req.headers)
  const userKey = `upload:${session.user.email}:${ip}`
  const { allowed } = await rateLimit(userKey, 30, 60 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Upload limit reached. Please wait before uploading more.' }, { status: 429 })
  }

  // ── Folder type (products or reviews) ─────────────────────────────────────
  const folderParam = req.nextUrl.searchParams.get('type')
  if (!folderParam || !(folderParam in LIMITS)) {
    return NextResponse.json({ error: 'Missing ?type=products|reviews query param.' }, { status: 400 })
  }
  const folder = folderParam as UploadFolder
  const { maxFiles, maxBytes } = LIMITS[folder]

  // Admin-only for product uploads
  const isAdmin = (session.user as { isAdmin?: boolean }).isAdmin === true
  if (folder === 'products' && !isAdmin) {
    return NextResponse.json({ error: 'Only admins can upload product photos.' }, { status: 403 })
  }

  // ── Parse multipart form ───────────────────────────────────────────────────
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data.' }, { status: 400 })
  }

  const files = formData.getAll('files') as File[]
  if (!files.length) {
    return NextResponse.json({ error: 'No files provided.' }, { status: 400 })
  }
  if (files.length > maxFiles) {
    return NextResponse.json({ error: `Maximum ${maxFiles} files allowed per upload.` }, { status: 400 })
  }

  // ── Upload with security validation ───────────────────────────────────────
  const { urls, errors } = await uploadImages(files, { folder, maxBytes })

  if (urls.length === 0 && errors.length > 0) {
    return NextResponse.json({ error: errors[0].reason, errors }, { status: 422 })
  }

  return NextResponse.json({ urls, errors }, { status: 200 })
}
