import { NextRequest, NextResponse } from 'next/server'
import { MOCK_DEVICES } from '@/lib/mock-data'
import type { Order, PaymentMethod } from '@/types'
import { sendOrderConfirmed } from '@/lib/email'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// In-memory store for dev (replace with Supabase in production)
const ORDERS: Order[] = []

function generateOrderNumber() {
  return 'INX' + Date.now().toString(36).toUpperCase()
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = !!(session.user as { isAdmin?: boolean }).isAdmin
  const filterUserId = session.user.email // Treat email as the stable ID locally

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = Number(searchParams.get('limit') ?? 20)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let filtered = ORDERS

  // Non-admins can only see their own orders
  if (!isAdmin) {
    filtered = filtered.filter((o) => o.buyerEmail === filterUserId)
  } else if (userId) {
    filtered = filtered.filter((o) => o.userId === userId)
  }

  if (status) {
    filtered = filtered.filter((o) => o.status === status)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.buyerName.toLowerCase().includes(q) ||
      o.buyerPhone.includes(q) ||
      o.device.model.toLowerCase().includes(q)
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const orders = filtered
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice((page - 1) * limit, page * limit)

  return NextResponse.json({ orders, pagination: { total, page, limit, totalPages } })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    deviceId,
    buyerName,
    buyerPhone,
    buyerEmail,
    deliveryAddress,
    city,
    paymentMethod,
    warrantyExtended,
    notes,
  } = body

  if (!deviceId || !buyerName || !buyerPhone || !deliveryAddress || !city || !paymentMethod) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const device = MOCK_DEVICES.find((d) => d.id === deviceId)
  if (!device) {
    return NextResponse.json({ error: 'Device not found' }, { status: 404 })
  }
  if (device.status !== 'available') {
    return NextResponse.json({ error: 'Device is no longer available' }, { status: 409 })
  }

  const amount = device.price + (warrantyExtended ? 1500 : 0)
  const now = new Date().toISOString()

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    userId: (session.user as any).id || session.user.email,
    buyerName,
    buyerPhone,
    buyerEmail: buyerEmail || session.user.email,
    deliveryAddress,
    city,
    paymentMethod: paymentMethod as PaymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    amount,
    warrantyExtended: !!warrantyExtended,
    status: 'pending',
    notes,
    device: {
      deviceId: device.id,
      model: device.model,
      storage: device.storage,
      grade: device.grade,
      price: device.price,
      photo: device.photos[0],
    },
    createdAt: now,
    updatedAt: now,
  }

  ORDERS.push(order)
  // Mark device as reserved in mock
  device.status = 'reserved'

  // Fire-and-forget — don't block response on email
  sendOrderConfirmed(order).catch(console.error)

  return NextResponse.json({ order }, { status: 201 })
}
