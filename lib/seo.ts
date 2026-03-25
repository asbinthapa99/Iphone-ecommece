import type { Device, ProductCategory } from '@/types'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://inexanepal.com'
export const SITE_NAME = 'Inexa Nepal'
export const SITE_TAGLINE = 'Buy Verified Used iPhones & Gadgets in Nepal'

// ── Brand helpers ─────────────────────────────────────────────────────────────

function getBrand(device: Device): string {
  if (['iphone', 'ipad', 'macbook', 'airpods'].includes(device.category)) return 'Apple'
  if (device.category === 'console') {
    if (device.model.toLowerCase().includes('playstation') || device.model.toLowerCase().includes('ps5')) return 'Sony'
    if (device.model.toLowerCase().includes('xbox')) return 'Microsoft'
    if (device.model.toLowerCase().includes('nintendo') || device.model.toLowerCase().includes('switch')) return 'Nintendo'
  }
  // Android / Windows — infer from model name
  const m = device.model.toLowerCase()
  if (m.includes('samsung')) return 'Samsung'
  if (m.includes('pixel')) return 'Google'
  if (m.includes('oneplus')) return 'OnePlus'
  if (m.includes('dell')) return 'Dell'
  if (m.includes('hp')) return 'HP'
  if (m.includes('lenovo') || m.includes('thinkpad')) return 'Lenovo'
  if (m.includes('asus')) return 'ASUS'
  if (m.includes('surface')) return 'Microsoft'
  return 'Unknown'
}

// ── Category labels ───────────────────────────────────────────────────────────

export const CATEGORY_SEO: Record<ProductCategory, { label: string; plural: string; keywords: string[] }> = {
  iphone: {
    label: 'iPhone',
    plural: 'Used iPhones',
    keywords: ['buy iPhone Nepal', 'used iPhone Nepal', 'second hand iPhone Nepal', 'iPhone price Nepal', 'verified iPhone Nepal'],
  },
  macbook: {
    label: 'MacBook',
    plural: 'Used MacBooks',
    keywords: ['buy MacBook Nepal', 'used MacBook Nepal', 'second hand MacBook Nepal', 'MacBook price Nepal', 'Apple laptop Nepal'],
  },
  ipad: {
    label: 'iPad',
    plural: 'Used iPads',
    keywords: ['buy iPad Nepal', 'used iPad Nepal', 'iPad price Nepal', 'Apple tablet Nepal', 'second hand iPad Nepal'],
  },
  airpods: {
    label: 'AirPods & Audio',
    plural: 'Used AirPods & Audio',
    keywords: ['buy AirPods Nepal', 'AirPods price Nepal', 'used AirPods Nepal', 'wireless earbuds Nepal', 'AirPods Pro Nepal'],
  },
  android: {
    label: 'Android Phone',
    plural: 'Used Android Phones',
    keywords: ['buy Android phone Nepal', 'used Samsung Nepal', 'Samsung price Nepal', 'Android phone Nepal', 'second hand Android Nepal'],
  },
  windows: {
    label: 'Windows Laptop',
    plural: 'Used Windows Laptops',
    keywords: ['buy laptop Nepal', 'used laptop Nepal', 'laptop price Nepal', 'second hand laptop Nepal', 'Dell XPS Nepal'],
  },
  console: {
    label: 'Gaming Console',
    plural: 'Used Gaming Consoles',
    keywords: ['buy PS5 Nepal', 'PlayStation 5 price Nepal', 'used gaming console Nepal', 'Nintendo Switch Nepal', 'Xbox Nepal'],
  },
  other: {
    label: 'Gadget',
    plural: 'Used Gadgets',
    keywords: ['buy gadgets Nepal', 'used electronics Nepal', 'verified gadgets Nepal'],
  },
}

// ── Product page meta ─────────────────────────────────────────────────────────

export function productTitle(device: Device): string {
  const condition = device.grade === 'A' ? 'Grade A (Like New)' : device.grade === 'B' ? 'Grade B' : 'Grade C'
  return `Buy ${device.model} ${device.storage} ${device.color} Nepal | NPR ${device.price.toLocaleString()} | ${SITE_NAME}`
}

export function productDescription(device: Device): string {
  const condition = device.grade === 'A' ? 'like new' : device.grade === 'B' ? 'good condition' : 'fair condition'
  const savings = device.originalPrice && device.originalPrice > device.price
    ? ` Save NPR ${(device.originalPrice - device.price).toLocaleString()} vs new.` : ''
  return `Buy Grade ${device.grade} ${device.model} ${device.storage} ${device.color} in Nepal — ${condition}, ${device.batteryHealth}% battery, IMEI verified clean. NPR ${device.price.toLocaleString()}.${savings} 3-month Inexa warranty. Fast delivery in Kathmandu & Pokhara. COD available.`
}

export function productKeywords(device: Device): string {
  const base = CATEGORY_SEO[device.category]?.keywords ?? []
  const specific = [
    `${device.model} price Nepal`,
    `${device.model} ${device.storage} Nepal`,
    `buy ${device.model} Nepal`,
    `used ${device.model} Nepal`,
    `${device.model} grade ${device.grade} Nepal`,
    `second hand ${device.model} Nepal`,
  ]
  return [...specific, ...base].join(', ')
}

// ── Product JSON-LD ───────────────────────────────────────────────────────────

export function productJsonLd(device: Device) {
  const brand = getBrand(device)
  const condition = device.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${device.model} ${device.storage} ${device.color}`,
    description: productDescription(device),
    image: device.photos.filter(Boolean),
    sku: `INX-${device.id}`,
    brand: { '@type': 'Brand', name: brand },
    condition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      price: device.price,
      priceCurrency: 'NPR',
      availability: condition,
      itemCondition: 'https://schema.org/UsedCondition',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      url: `${SITE_URL}/phones/${device.id}`,
    },
  }
}

export function breadcrumbJsonLd(device: Device) {
  const catLabel = CATEGORY_SEO[device.category]?.label ?? 'Product'
  const catHref = device.category === 'iphone' ? '/phones' : `/gadgets/${device.category}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: catLabel, item: `${SITE_URL}${catHref}` },
      { '@type': 'ListItem', position: 3, name: `${device.model} ${device.storage}`, item: `${SITE_URL}/phones/${device.id}` },
    ],
  }
}

// ── Category page meta ────────────────────────────────────────────────────────

export function categoryTitle(category: ProductCategory, count: number): string {
  const { plural } = CATEGORY_SEO[category]
  return `Buy ${plural} in Nepal | Verified & Inspected | ${SITE_NAME}`
}

export function categoryDescription(category: ProductCategory, devices: Device[]): string {
  const { plural, keywords } = CATEGORY_SEO[category]
  const count = devices.filter((d) => d.status === 'available').length
  const min = devices.length > 0 ? Math.min(...devices.map((d) => d.price)) : 0
  return `Shop ${count} verified ${plural.toLowerCase()} in Nepal. All inspected, IMEI checked, 3-month warranty. Prices from NPR ${min.toLocaleString()}. Cash on delivery in Kathmandu & Pokhara.`
}

// ── Site-wide JSON-LD ─────────────────────────────────────────────────────────

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "Nepal's most trusted marketplace for verified second-hand iPhones, MacBooks, AirPods & gadgets.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'NP',
  },
  sameAs: [],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_TAGLINE,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/phones?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}
