import { neon } from '@neondatabase/serverless'
import { MOCK_DEVICES } from '@/lib/mock-data'
import { getPrimaryAdminEmailFromEnv } from '@/lib/admin-emails'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Module-level flags so we only run heavy migrations once per serverless instance
let devicesTableReady = false
let usersTableReady = false

type DeviceSeed = {
  id: string
  category: string
  model: string
  storage: string
  color: string
  grade: string
  batteryHealth: number
  price: number
  originalPrice?: number
  imei: string
  imeiStatus: string
  icloudLocked: boolean
  status: string
  photos: string[]
  description?: string
  specs?: unknown
  createdAt: string
  rating?: number
  reviewCount?: number
}

export async function initDevicesTable() {
  if (devicesTableReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS devices (
      id             TEXT PRIMARY KEY,
      category       TEXT NOT NULL,
      model          TEXT NOT NULL,
      storage        TEXT NOT NULL,
      color          TEXT NOT NULL,
      grade          TEXT NOT NULL,
      battery_health INTEGER NOT NULL,
      price          INTEGER NOT NULL,
      original_price INTEGER,
      imei           TEXT NOT NULL,
      imei_status    TEXT NOT NULL,
      icloud_locked  BOOLEAN NOT NULL DEFAULT FALSE,
      status         TEXT NOT NULL DEFAULT 'available',
      photos         JSONB NOT NULL DEFAULT '[]'::jsonb,
      description    TEXT,
      specs          JSONB,
      rating         REAL,
      review_count   INTEGER,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // Safe migrations for older devices tables created before category/specs support
  await sql`ALTER TABLE devices ADD COLUMN IF NOT EXISTS category TEXT;`
  await sql`ALTER TABLE devices ADD COLUMN IF NOT EXISTS specs JSONB;`
  await sql`ALTER TABLE devices ADD COLUMN IF NOT EXISTS rating REAL;`
  await sql`ALTER TABLE devices ADD COLUMN IF NOT EXISTS review_count INTEGER;`
  await sql`ALTER TABLE devices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;`
  await sql`UPDATE devices SET category = COALESCE(category, 'iphone') WHERE category IS NULL;`
  await sql`UPDATE devices SET updated_at = COALESCE(updated_at, NOW()) WHERE updated_at IS NULL;`

  const rows = await sql`SELECT COUNT(*)::int AS total FROM devices`
  const total = Number((rows[0] as { total: number | string }).total)
  if (total === 0) {
    for (const d of MOCK_DEVICES as DeviceSeed[]) {
      await sql`
        INSERT INTO devices (
          id, category, model, storage, color, grade, battery_health,
          price, original_price, imei, imei_status, icloud_locked, status,
          photos, description, specs, rating, review_count, created_at, updated_at
        ) VALUES (
          ${d.id}, ${d.category}, ${d.model}, ${d.storage}, ${d.color}, ${d.grade}, ${d.batteryHealth},
          ${d.price}, ${d.originalPrice ?? null}, ${d.imei}, ${d.imeiStatus}, ${d.icloudLocked}, ${d.status},
          ${d.photos ?? []}, ${d.description ?? null}, ${d.specs ? JSON.stringify(d.specs) : null}::jsonb,
          ${d.rating ?? null}, ${d.reviewCount ?? null}, ${d.createdAt}, NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `
    }
  }

  devicesTableReady = true
}

export async function initUsersTable() {
  if (usersTableReady) return
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT,
      email       TEXT UNIQUE NOT NULL,
      phone       TEXT,
      password    TEXT,
      provider    TEXT NOT NULL DEFAULT 'credentials',
      is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
      address     TEXT,
      city        TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // Safely add new columns to existing tables
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;`
  } catch {
    // Columns might already exist, safe to ignore
  }

  // Bootstrap a single admin from env.
  const primaryAdminEmail = getPrimaryAdminEmailFromEnv()
  if (primaryAdminEmail) {
    await sql`UPDATE users SET is_admin = FALSE WHERE LOWER(email) <> ${primaryAdminEmail}`
    await sql`UPDATE users SET is_admin = TRUE WHERE LOWER(email) = ${primaryAdminEmail}`
  } else {
    await sql`UPDATE users SET is_admin = FALSE`
  }

  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT NOT NULL,
      otp         TEXT NOT NULL,
      expires_at  TIMESTAMPTZ NOT NULL,
      used        BOOLEAN NOT NULL DEFAULT FALSE,
      attempts    INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  try {
    await sql`ALTER TABLE password_reset_tokens ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0;`
  } catch {
    // safe to ignore
  }

  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key          TEXT PRIMARY KEY,
      count        INTEGER NOT NULL DEFAULT 1,
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number     TEXT UNIQUE NOT NULL,
      user_id          TEXT,
      buyer_name       TEXT NOT NULL,
      buyer_phone      TEXT NOT NULL,
      buyer_email      TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      city             TEXT NOT NULL,
      payment_method   TEXT NOT NULL,
      payment_status   TEXT NOT NULL DEFAULT 'pending',
      payment_ref      TEXT,
      amount           INTEGER NOT NULL,
      warranty_extended BOOLEAN NOT NULL DEFAULT FALSE,
      status           TEXT NOT NULL DEFAULT 'pending',
      notes            TEXT,
      tracking_number  TEXT,
      device_id        TEXT NOT NULL,
      device_model     TEXT NOT NULL,
      device_storage   TEXT NOT NULL,
      device_grade     TEXT NOT NULL,
      device_price     INTEGER NOT NULL,
      device_photo     TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // Query-performance indexes for order dashboards and account pages
  await sql`CREATE INDEX IF NOT EXISTS orders_buyer_email_idx ON orders (buyer_email);`
  await sql`CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);`
  await sql`CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);`
  await sql`CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);`
  await sql`CREATE INDEX IF NOT EXISTS orders_buyer_email_created_at_idx ON orders (buyer_email, created_at DESC);`
  await sql`CREATE INDEX IF NOT EXISTS orders_status_created_at_idx ON orders (status, created_at DESC);`

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id               TEXT PRIMARY KEY,
      device_id        TEXT NOT NULL,
      user_id          TEXT NOT NULL,
      user_name        TEXT NOT NULL,
      user_initials    TEXT NOT NULL,
      rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      title            TEXT NOT NULL,
      body             TEXT NOT NULL,
      verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
      helpful          INTEGER NOT NULL DEFAULT 0,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS reviews_user_device_unique
    ON reviews (user_id, device_id);
  `

  // Add photos column to reviews (safe migration for existing tables)
  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photos JSONB NOT NULL DEFAULT '[]'::jsonb;`

  usersTableReady = true
}
