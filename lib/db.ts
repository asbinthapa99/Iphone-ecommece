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
}
