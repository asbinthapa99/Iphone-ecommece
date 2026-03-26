export type DeviceGrade = 'A' | 'B' | 'C' | 'X'
export type DeviceStatus = 'available' | 'reserved' | 'sold'
export type ImeiStatus = 'clean' | 'blocked' | 'stolen' | 'unknown'
export type ProductCategory = 'iphone' | 'macbook' | 'ipad' | 'airpods' | 'android' | 'windows' | 'console' | 'other'

export interface DeviceSpecs {
  // Quality scores (0–100) — auto-derived when not set
  durability?: number
  performance?: number
  camera?: number
  screen?: number

  // Identity
  brand?: string              // "Apple"
  manufacturerRef?: string    // "A3106"
  weight?: string             // "221 g"
  series?: string             // "Apple iPhone 15"
  releaseYear?: number        // 2023

  // Memory / storage
  memoryGB?: number           // RAM in GB
  sdCardSlot?: boolean

  // Connectivity
  connector?: string          // "USB-C" | "Lightning"
  mobileNetwork?: string      // "5G" | "4G LTE"
  simCard?: string            // "Physical SIM + eSIM"

  // Display
  screenSize?: number         // inches, e.g. 6.7
  screenType?: string         // "LTPO Super Retina XDR OLED"
  resolution?: string         // "1290 x 2796"

  // Camera
  mainCamera?: number         // megapixels
  frontCamera?: number        // megapixels

  // Software
  os?: string                 // "iOS" | "Android" | "macOS"
  compatibleWithLatestUpdate?: boolean
  foldable?: boolean

  // Rich content (optional — shown only if provided)
  longDescription?: string
  keyFeatures?: string[]
  whoIsItFor?: string
  pros?: string[]
  cons?: string[]
}

export interface Device {
  id: string
  category: ProductCategory
  model: string
  storage: string
  color: string
  grade: DeviceGrade
  batteryHealth: number
  price: number
  originalPrice?: number
  imei: string
  imeiStatus: ImeiStatus
  icloudLocked: boolean
  status: DeviceStatus
  photos: string[]
  description?: string
  specs?: DeviceSpecs
  createdAt: string
  rating?: number
  reviewCount?: number
}

export interface ImeiCheckResult {
  imei: string
  status: ImeiStatus
  model?: string
  regionLock?: string
  icloudLocked?: boolean
}

// ─── Auth / User ─────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'super_admin'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: UserRole
  createdAt: string
  avatarUrl?: string | null
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
export type PaymentMethod = 'esewa' | 'khalti' | 'cod' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  deviceId: string
  model: string
  storage: string
  grade: DeviceGrade
  price: number
  photo?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  deliveryAddress: string
  city: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  paymentRef?: string
  amount: number
  warrantyExtended: boolean
  status: OrderStatus
  notes?: string
  trackingNumber?: string
  device: OrderItem
  createdAt: string
  updatedAt: string
}

// ─── Trade-in ─────────────────────────────────────────────────────────────────

export type TradeInStatus = 'pending' | 'reviewing' | 'quoted' | 'accepted' | 'rejected' | 'completed' | 'expired'

export interface TradeInQuote {
  id: string
  model: string
  storage?: string
  condition: 'good' | 'fair' | 'cracked' | 'other'
  batteryHealth?: number
  photos: string[]
  quotedPrice?: number
  status: TradeInStatus
  contactPhone: string
  contactEmail?: string
  notes?: string
  expiresAt?: string
  createdAt: string
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  deviceId: string
  userId: string
  userName: string
  userInitials: string
  rating: number       // 1–5
  title: string
  body: string
  verifiedPurchase: boolean
  helpful: number
  photos: string[]
  createdAt: string
}

// ─── Warranty ─────────────────────────────────────────────────────────────────

export interface Warranty {
  id: string
  orderId: string
  deviceId: string
  startsAt: string
  endsAt: string
  type: 'standard' | 'extended'
  status: 'active' | 'expired' | 'claimed'
}
