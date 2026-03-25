import { NextRequest, NextResponse } from 'next/server'
import type { Order, OrderStatus, PaymentStatus } from '@/types'
import { sendPaymentSuccess, sendDeliveryInProcess, sendDelivered } from '@/lib/email'

// Shared in-memory store (same module as route.ts in dev)
declare const global: { __inexaOrders?: Order[] }

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // For demo, return a mock order so the UI works
  const mockOrder: Order = {
    id,
    orderNumber: 'INX' + id.slice(0, 6).toUpperCase(),
    buyerName: 'Demo User',
    buyerPhone: '9800000000',
    buyerEmail: 'demo@example.com',
    deliveryAddress: 'Thamel, Kathmandu',
    city: 'Kathmandu',
    paymentMethod: 'esewa',
    paymentStatus: 'pending',
    amount: 43500,
    warrantyExtended: false,
    status: 'confirmed',
    device: {
      deviceId: '1',
      model: 'iPhone 13',
      storage: '128GB',
      grade: 'A',
      price: 43500,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ order: mockOrder })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status, paymentStatus, trackingNumber, notes } = body as {
    status?: OrderStatus
    paymentStatus?: PaymentStatus
    trackingNumber?: string
    notes?: string
  }

  const updatedOrder: Order = {
    id,
    orderNumber: 'INX' + id.slice(0, 6).toUpperCase(),
    buyerName: body.buyerName ?? 'Customer',
    buyerPhone: body.buyerPhone ?? '',
    buyerEmail: body.buyerEmail ?? '',
    deliveryAddress: body.deliveryAddress ?? '',
    city: body.city ?? 'Kathmandu',
    paymentMethod: body.paymentMethod ?? 'cod',
    paymentStatus: paymentStatus ?? body.paymentStatus ?? 'pending',
    amount: body.amount ?? 0,
    warrantyExtended: body.warrantyExtended ?? false,
    status: status ?? body.status ?? 'pending',
    trackingNumber,
    notes,
    device: body.device ?? { deviceId: '', model: 'Unknown', storage: '', grade: 'A', price: 0 },
    createdAt: body.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Send email based on what changed
  if (paymentStatus === 'paid') {
    sendPaymentSuccess(updatedOrder).catch(console.error)
  }
  if (status === 'shipped') {
    sendDeliveryInProcess({ ...updatedOrder, trackingNumber }).catch(console.error)
  }
  if (status === 'delivered') {
    sendDelivered(updatedOrder).catch(console.error)
  }

  return NextResponse.json({ order: updatedOrder })
}
