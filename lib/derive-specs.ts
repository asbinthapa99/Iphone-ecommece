/**
 * Derives a complete DeviceSpecs object from device fields.
 * Explicit device.specs values always win; this fills in the rest automatically.
 * No hardcoding per device — all derived from category, model, grade, battery.
 */

import type { Device, DeviceSpecs } from '@/types'

// ── Model-year lookup ─────────────────────────────────────────────────────────

function getIPhoneYear(model: string): number {
  const m = model.toLowerCase()
  if (m.includes('16')) return 2024
  if (m.includes('15')) return 2023
  if (m.includes('14')) return 2022
  if (m.includes('13')) return 2021
  if (m.includes('12')) return 2020
  if (m.includes('11')) return 2019
  if (m.includes('xs') || m.includes('xr')) return 2018
  if (m.includes('x') && !m.includes('xs')) return 2017
  if (m.includes('8')) return 2017
  if (m.includes('7')) return 2016
  if (m.includes('6')) return 2015
  if (m.includes('se (3')) return 2022
  if (m.includes('se (2')) return 2020
  return 2020
}

function getConnector(model: string, category: string): string {
  if (category === 'iphone') {
    const year = getIPhoneYear(model)
    return year >= 2023 ? 'USB-C' : 'Lightning'
  }
  if (category === 'macbook' || category === 'ipad') return 'USB-C'
  return 'USB-C'
}

function getMobileNetwork(model: string, category: string): string {
  if (!['iphone', 'android'].includes(category)) return ''
  const year = getIPhoneYear(model)
  return year >= 2020 ? '5G' : '4G LTE'
}

function getScreenSize(model: string): number | undefined {
  const m = model.toLowerCase()
  if (m.includes('pro max') || m.includes('plus') || m.includes('max')) return 6.7
  if (m.includes('mini')) return 5.4
  if (m.includes('pro')) return 6.1
  return 6.1
}

function getScreenType(model: string): string {
  const m = model.toLowerCase()
  const year = getIPhoneYear(m)
  if (year >= 2023 && (m.includes('pro') || m.includes('max'))) return 'LTPO Super Retina XDR OLED'
  if (year >= 2020 && m.includes('pro')) return 'Super Retina XDR OLED'
  if (year >= 2019) return 'Super Retina XDR OLED'
  if (m.includes('xr') || m.includes('11') && !m.includes('pro')) return 'Liquid Retina LCD'
  return 'Retina HD LCD'
}

function getResolution(model: string): string {
  const m = model.toLowerCase()
  if (m.includes('15 pro max') || m.includes('14 pro max')) return '1290 x 2796'
  if (m.includes('15 pro') || m.includes('14 pro')) return '1179 x 2556'
  if (m.includes('15 plus') || m.includes('14 plus')) return '1284 x 2778'
  if (m.includes('15') || m.includes('14') || m.includes('13')) return '1170 x 2532'
  if (m.includes('12 pro max') || m.includes('11 pro max') || m.includes('xs max')) return '1242 x 2688'
  if (m.includes('xr') || m.includes('11') && !m.includes('pro')) return '828 x 1792'
  return '1080 x 2340'
}

function getMainCamera(model: string): number {
  const m = model.toLowerCase()
  const year = getIPhoneYear(m)
  if (year >= 2023 && m.includes('pro')) return 48
  if (year >= 2022) return 48
  if (year >= 2020) return 12
  return 12
}

function getMemoryGB(model: string, category: string): number {
  if (category !== 'iphone') return 8
  const m = model.toLowerCase()
  const year = getIPhoneYear(m)
  if (year >= 2023 && m.includes('pro')) return 8
  if (year >= 2021) return 6
  return 4
}

function getSeries(model: string, category: string): string {
  if (category !== 'iphone') return model
  const m = model.toLowerCase()
  if (m.includes('15')) return 'Apple iPhone 15'
  if (m.includes('14')) return 'Apple iPhone 14'
  if (m.includes('13')) return 'Apple iPhone 13'
  if (m.includes('12')) return 'Apple iPhone 12'
  if (m.includes('11')) return 'Apple iPhone 11'
  return `Apple ${model}`
}

function getManufacturerRef(model: string): string {
  const refs: Record<string, string> = {
    'iPhone 16 Pro Max': 'A3293',
    'iPhone 16 Pro': 'A3292',
    'iPhone 15 Pro Max': 'A3106',
    'iPhone 15 Pro': 'A3101',
    'iPhone 15 Plus': 'A3094',
    'iPhone 15': 'A3090',
    'iPhone 14 Pro Max': 'A2651',
    'iPhone 14 Pro': 'A2650',
    'iPhone 14 Plus': 'A2632',
    'iPhone 14': 'A2649',
    'iPhone 13 Pro Max': 'A2484',
    'iPhone 13 Pro': 'A2483',
    'iPhone 13': 'A2482',
    'iPhone 13 mini': 'A2481',
    'iPhone 12 Pro Max': 'A2342',
    'iPhone 12 Pro': 'A2341',
    'iPhone 12': 'A2172',
    'iPhone 12 mini': 'A2176',
    'iPhone 11 Pro Max': 'A2161',
    'iPhone 11 Pro': 'A2160',
    'iPhone 11': 'A2111',
    'iPhone XS Max': 'A1921',
    'iPhone XS': 'A1920',
    'iPhone XR': 'A1984',
    'iPhone X': 'A1865',
    'iPhone 8 Plus': 'A1864',
    'iPhone 8': 'A1863',
    'iPhone 7 Plus': 'A1661',
    'iPhone 7': 'A1660',
  }
  return refs[model] ?? ''
}

function getWeight(model: string): string {
  const weights: Record<string, string> = {
    'iPhone 16 Pro Max': '227 g', 'iPhone 15 Pro Max': '221 g',
    'iPhone 15 Pro': '187 g',    'iPhone 15 Plus': '201 g',
    'iPhone 15': '171 g',        'iPhone 14 Pro Max': '240 g',
    'iPhone 14 Pro': '206 g',    'iPhone 14': '172 g',
    'iPhone 13 Pro Max': '238 g','iPhone 13 Pro': '204 g',
    'iPhone 13': '174 g',        'iPhone 13 mini': '141 g',
    'iPhone 12 Pro Max': '228 g','iPhone 12 Pro': '189 g',
    'iPhone 12': '164 g',        'iPhone 12 mini': '133 g',
    'iPhone 11 Pro Max': '226 g','iPhone 11 Pro': '188 g',
    'iPhone 11': '194 g',        'iPhone XS Max': '208 g',
    'iPhone XS': '177 g',        'iPhone XR': '194 g',
    'iPhone X': '174 g',         'iPhone 8 Plus': '202 g',
    'iPhone 8': '148 g',         'iPhone 7 Plus': '188 g',
    'iPhone 7': '138 g',
  }
  return weights[model] ?? ''
}

// ── Quality score derivation ──────────────────────────────────────────────────

function qualityScores(device: Device): Pick<DeviceSpecs, 'durability' | 'performance' | 'camera' | 'screen'> {
  const gradeMap = { 'A+': 96, A: 88, B: 74, C: 60, X: 50 }
  const grade = gradeMap[device.grade as keyof typeof gradeMap] ?? 80
  const battery = device.batteryHealth
  const year = device.category === 'iphone' ? getIPhoneYear(device.model) : 2020
  const recency = Math.min(100, 60 + (year - 2015) * 5) // 2015=60, 2024=105→capped

  return {
    durability: Math.round((grade * 0.5 + battery * 0.5)),
    performance: Math.round((grade * 0.4 + recency * 0.6)),
    camera: Math.round((recency * 0.7 + grade * 0.3)),
    screen: Math.round((recency * 0.6 + grade * 0.4)),
  }
}

// ── Default content ───────────────────────────────────────────────────────────

function defaultKeyFeatures(device: Device): string[] {
  const year = getIPhoneYear(device.model)
  const features: string[] = [
    `Release Date: ${year}`,
    `Processor: ${year >= 2023 ? 'A17 Pro' : year >= 2022 ? 'A16 Bionic' : year >= 2021 ? 'A15 Bionic' : year >= 2020 ? 'A14 Bionic' : 'A-series chip'}`,
  ]
  if (getMobileNetwork(device.model, device.category)) {
    features.push(`Connectivity: ${getMobileNetwork(device.model, device.category)} capable`)
  }
  if (device.model.includes('Pro') || device.model.includes('Max')) {
    features.push('Camera: Triple-lens camera system with telephoto, wide, and ultra-wide')
  } else {
    features.push('Camera: Dual-lens camera system')
  }
  if (year >= 2023) features.push('Build: Natural titanium frame for enhanced durability')
  else if (year >= 2020) features.push('Build: Ceramic Shield front, surgical-grade stainless steel')
  features.push(`Operating System: Ships with iOS ${year >= 2023 ? '17' : year >= 2022 ? '16' : year >= 2021 ? '15' : '14'}`)
  return features
}

function defaultPros(device: Device): string[] {
  const m = device.model.toLowerCase()
  const year = getIPhoneYear(device.model)
  const pros = [`Grade ${device.grade} condition — ${device.grade === 'A' ? 'like new' : device.grade === 'B' ? 'good condition' : 'functional with visible wear'}`]
  if (year >= 2023) pros.push('Natural titanium frame — lightweight and durable')
  if (device.batteryHealth >= 85) pros.push(`Battery health at ${device.batteryHealth}% — excellent`)
  else if (device.batteryHealth >= 75) pros.push(`Battery health at ${device.batteryHealth}% — good`)
  if (m.includes('pro')) pros.push('Pro camera system with versatile zoom range')
  if (year >= 2020) pros.push('5G connectivity for fast network speeds')
  return pros
}

function defaultCons(device: Device): string[] {
  const m = device.model.toLowerCase()
  const cons: string[] = ['No expandable storage (SD card not supported)']
  if (device.batteryHealth < 80) cons.push(`Battery at ${device.batteryHealth}% — may benefit from a replacement`)
  if (!m.includes('pro') && !m.includes('max')) cons.push('Standard camera system — no telephoto lens')
  if (device.grade === 'C') cons.push('Visible wear marks — cosmetic only, fully functional')
  return cons
}

// ── Main export ───────────────────────────────────────────────────────────────

export function deriveSpecs(device: Device): Required<DeviceSpecs> {
  const isApple = ['iphone', 'macbook', 'ipad', 'airpods'].includes(device.category)
  const year = device.category === 'iphone' ? getIPhoneYear(device.model) : 2020

  const derived: DeviceSpecs = {
    brand: isApple ? 'Apple' : device.category === 'android' ? 'Various' : 'Various',
    manufacturerRef: device.category === 'iphone' ? getManufacturerRef(device.model) : '',
    weight: device.category === 'iphone' ? getWeight(device.model) : '',
    series: getSeries(device.model, device.category),
    releaseYear: year,
    memoryGB: getMemoryGB(device.model, device.category),
    sdCardSlot: !isApple,
    connector: getConnector(device.model, device.category),
    mobileNetwork: getMobileNetwork(device.model, device.category),
    simCard: isApple ? 'Physical SIM + eSIM' : 'Nano SIM',
    screenSize: device.category === 'iphone' ? getScreenSize(device.model) : undefined,
    screenType: device.category === 'iphone' ? getScreenType(device.model) : undefined,
    resolution: device.category === 'iphone' ? getResolution(device.model) : undefined,
    mainCamera: device.category === 'iphone' ? getMainCamera(device.model) : undefined,
    frontCamera: device.category === 'iphone' ? 12 : undefined,
    os: isApple ? (device.category === 'macbook' ? 'macOS' : 'iOS') : device.category === 'android' ? 'Android' : 'Windows 11',
    compatibleWithLatestUpdate: true,
    foldable: false,
    keyFeatures: defaultKeyFeatures(device),
    whoIsItFor: `The ${device.model} is ideal for users who want a reliable, IMEI-verified device at a fraction of the retail price. It suits everyday users, students, and professionals who value Apple's ecosystem and build quality. Compared to buying new, this refurbished unit offers the same performance at significant savings.`,
    pros: defaultPros(device),
    cons: defaultCons(device),
    longDescription: device.description ?? '',
    ...qualityScores(device),
  }

  // Device-level specs override derived values
  return { ...derived, ...device.specs } as Required<DeviceSpecs>
}
