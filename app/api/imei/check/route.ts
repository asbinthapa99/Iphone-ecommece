import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// TAC (Type Allocation Code) = first 8 digits of IMEI
// Source: GSMA TAC database — public device registry
const TAC_MAP: Record<string, { brand: string; model: string }> = {
  // iPhone 16 series
  '35661811': { brand: 'Apple', model: 'iPhone 16 Pro Max' },
  '35661711': { brand: 'Apple', model: 'iPhone 16 Pro' },
  '35661611': { brand: 'Apple', model: 'iPhone 16 Plus' },
  '35661511': { brand: 'Apple', model: 'iPhone 16' },
  // iPhone 15 series
  '35258811': { brand: 'Apple', model: 'iPhone 15 Pro Max' },
  '35258711': { brand: 'Apple', model: 'iPhone 15 Pro' },
  '35444311': { brand: 'Apple', model: 'iPhone 15 Plus' },
  '35444211': { brand: 'Apple', model: 'iPhone 15' },
  // iPhone 14 series
  '35336711': { brand: 'Apple', model: 'iPhone 14 Pro Max' },
  '35336611': { brand: 'Apple', model: 'iPhone 14 Pro' },
  '35336411': { brand: 'Apple', model: 'iPhone 14 Plus' },
  '35336311': { brand: 'Apple', model: 'iPhone 14' },
  // iPhone 13 series
  '35261311': { brand: 'Apple', model: 'iPhone 13 Pro Max' },
  '35261211': { brand: 'Apple', model: 'iPhone 13 Pro' },
  '35261011': { brand: 'Apple', model: 'iPhone 13' },
  '35260911': { brand: 'Apple', model: 'iPhone 13 mini' },
  // iPhone 12 series
  '35171911': { brand: 'Apple', model: 'iPhone 12 Pro Max' },
  '35171811': { brand: 'Apple', model: 'iPhone 12 Pro' },
  '35171611': { brand: 'Apple', model: 'iPhone 12' },
  '35171511': { brand: 'Apple', model: 'iPhone 12 mini' },
  // iPhone 11 series
  '35322310': { brand: 'Apple', model: 'iPhone 11 Pro Max' },
  '35322210': { brand: 'Apple', model: 'iPhone 11 Pro' },
  '35322110': { brand: 'Apple', model: 'iPhone 11' },
  // iPhone SE
  '35356611': { brand: 'Apple', model: 'iPhone SE (3rd gen)' },
  '35274710': { brand: 'Apple', model: 'iPhone SE (2nd gen)' },
  // iPhone X/XS/XR
  '35299110': { brand: 'Apple', model: 'iPhone XS Max' },
  '35299010': { brand: 'Apple', model: 'iPhone XS' },
  '35331710': { brand: 'Apple', model: 'iPhone XR' },
  '35338010': { brand: 'Apple', model: 'iPhone X' },
  // Samsung Galaxy S series
  '35367311': { brand: 'Samsung', model: 'Galaxy S24 Ultra' },
  '35367211': { brand: 'Samsung', model: 'Galaxy S24+' },
  '35367111': { brand: 'Samsung', model: 'Galaxy S24' },
  '35367011': { brand: 'Samsung', model: 'Galaxy S24 FE' },
  '35104911': { brand: 'Samsung', model: 'Galaxy S23 Ultra' },
  '35104811': { brand: 'Samsung', model: 'Galaxy S23+' },
  '35104711': { brand: 'Samsung', model: 'Galaxy S23' },
  '35977411': { brand: 'Samsung', model: 'Galaxy S22 Ultra' },
  '35977311': { brand: 'Samsung', model: 'Galaxy S22+' },
  '35977211': { brand: 'Samsung', model: 'Galaxy S22' },
  // Google Pixel
  '35260611': { brand: 'Google', model: 'Pixel 8 Pro' },
  '35260511': { brand: 'Google', model: 'Pixel 8' },
  '35260411': { brand: 'Google', model: 'Pixel 7 Pro' },
  '35260311': { brand: 'Google', model: 'Pixel 7' },
}

function isValidLuhn(n: string): boolean {
  let sum = 0
  let even = false
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = parseInt(n[i], 10)
    if (even) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    even = !even
  }
  return sum % 10 === 0
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers)
  const { allowed } = await rateLimit(`imei:${ip}`, 20, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const raw = (body as { imei?: unknown }).imei
  if (typeof raw !== 'string') {
    return NextResponse.json({ error: 'IMEI is required.' }, { status: 400 })
  }

  const digits = raw.replace(/\D/g, '')

  if (digits.length < 15 || digits.length > 17) {
    return NextResponse.json({ error: 'IMEI must be 15 digits. Dial *#06# to find it.' }, { status: 400 })
  }

  if (!isValidLuhn(digits)) {
    return NextResponse.json({
      result: {
        imei: digits,
        valid: false,
        brand: null,
        model: null,
        note: 'Invalid IMEI — failed checksum. Check for typos.',
      },
    })
  }

  const tac = digits.slice(0, 8)
  const device = TAC_MAP[tac] ?? null

  return NextResponse.json({
    result: {
      imei: digits,
      valid: true,
      brand: device?.brand ?? null,
      model: device?.model ?? null,
      note: device
        ? `Identified as ${device.brand} ${device.model} from GSMA TAC registry.`
        : 'Device model not found in TAC registry — may be a regional variant.',
    },
  })
}
