import { NextRequest, NextResponse } from 'next/server'
import { MOCK_DEVICES } from '@/lib/mock-data'
import type { ImeiCheckResult } from '@/types'

export async function POST(request: NextRequest) {
  const { imei } = await request.json()

  if (!imei || imei.length < 15 || imei.length > 17) {
    return NextResponse.json({ error: 'Invalid IMEI — must be 15 digits' }, { status: 400 })
  }

  const digits = imei.replace(/\D/g, '')
  if (digits.length < 15) {
    return NextResponse.json({ error: 'IMEI must contain at least 15 digits' }, { status: 400 })
  }

  // Luhn check
  const isValidLuhn = (n: string) => {
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

  if (!isValidLuhn(digits)) {
    return NextResponse.json({
      result: {
        imei: digits,
        status: 'unknown',
        model: 'Unknown device',
        regionLock: 'Unknown',
        icloudLocked: undefined,
      } satisfies ImeiCheckResult,
    })
  }

  // Check against our inventory
  const ourDevice = MOCK_DEVICES.find((d) => d.imei === digits)

  // TAC codes for iPhone models
  const TAC_MAP: Record<string, string> = {
    '35345678': 'iPhone 15 Pro',
    '35345679': 'iPhone 15',
    '35345670': 'iPhone 14 Pro',
    '35345671': 'iPhone 14',
    '35345672': 'iPhone 13 Pro',
    '35345673': 'iPhone 13',
    '35345674': 'iPhone 12',
    '35345675': 'iPhone SE',
  }
  const tac = digits.slice(0, 8)
  const modelGuess = TAC_MAP[tac] ?? 'Apple iPhone'

  const result: ImeiCheckResult = {
    imei: digits,
    status: ourDevice ? ourDevice.imeiStatus : 'clean',
    model: ourDevice ? `${ourDevice.model} ${ourDevice.storage}` : modelGuess,
    regionLock: 'Nepal / International',
    icloudLocked: ourDevice ? ourDevice.icloudLocked : undefined,
  }

  return NextResponse.json({ result })
}
