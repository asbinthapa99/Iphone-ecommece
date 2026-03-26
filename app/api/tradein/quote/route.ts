import { NextRequest, NextResponse } from 'next/server'

const BUYBACK_PRICES: Record<string, Record<string, number>> = {
  'iPhone 15 Pro': { '128GB': 95000, '256GB': 108000, '512GB': 125000 },
  'iPhone 15 Pro Max': { '256GB': 115000, '512GB': 130000 },
  'iPhone 15': { '128GB': 75000, '256GB': 88000 },
  'iPhone 14 Pro': { '128GB': 72000, '256GB': 82000 },
  'iPhone 14 Pro Max': { '256GB': 90000 },
  'iPhone 14': { '128GB': 52000, '256GB': 60000 },
  'iPhone 13 Pro': { '128GB': 55000, '256GB': 62000 },
  'iPhone 13': { '128GB': 38000, '256GB': 45000 },
  'iPhone 12': { '64GB': 25000, '128GB': 30000 },
  'iPhone SE': { '64GB': 18000, '128GB': 22000 },
}

const CONDITION_MULTIPLIER: Record<string, number> = {
  good: 0.75,
  fair: 0.60,
  cracked: 0.40,
  other: 0.50,
}

export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { model, storage, condition, batteryHealth } = payload as {
    model?: unknown
    storage?: unknown
    condition?: unknown
    batteryHealth?: unknown
  }

  if (typeof model !== 'string' || typeof condition !== 'string') {
    return NextResponse.json({ error: 'Model and condition are required' }, { status: 400 })
  }
  if (storage != null && typeof storage !== 'string') {
    return NextResponse.json({ error: 'Invalid storage value' }, { status: 400 })
  }
  if (batteryHealth != null && (typeof batteryHealth !== 'number' || !Number.isFinite(batteryHealth) || batteryHealth < 0 || batteryHealth > 100)) {
    return NextResponse.json({ error: 'Battery health must be between 0 and 100' }, { status: 400 })
  }

  const modelPrices = BUYBACK_PRICES[model]
  if (!modelPrices) {
    return NextResponse.json({ error: 'Model not supported for trade-in yet' }, { status: 404 })
  }

  const basePriceKey = typeof storage === 'string' && modelPrices[storage] ? storage : Object.keys(modelPrices)[0]
  const basePrice = modelPrices[basePriceKey] ?? 0
  const condMultiplier = CONDITION_MULTIPLIER[condition] ?? 0.6

  // Battery health deduction
  let batteryMultiplier = 1
  if (typeof batteryHealth === 'number') {
    if (batteryHealth < 70) batteryMultiplier = 0.7
    else if (batteryHealth < 80) batteryMultiplier = 0.85
    else if (batteryHealth < 90) batteryMultiplier = 0.95
  }

  const quotedPrice = Math.round(basePrice * condMultiplier * batteryMultiplier / 500) * 500

  return NextResponse.json({
    quote: {
      model,
      storage: basePriceKey,
      condition,
      batteryHealth,
      quotedPrice,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    },
  })
}
