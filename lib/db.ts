import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export async function initUsersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT,
      email       TEXT UNIQUE NOT NULL,
      phone       TEXT,
      password    TEXT,
      provider    TEXT NOT NULL DEFAULT 'credentials',
      address     TEXT,
      city        TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `

  // Safely add new columns to existing tables
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;`
  } catch {
    // Columns might already exist, safe to ignore
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
}
