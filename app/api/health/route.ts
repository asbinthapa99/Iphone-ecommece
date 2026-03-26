import { NextResponse } from 'next/server'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars
  checks.DATABASE_URL = process.env.DATABASE_URL ? 'set' : 'MISSING'
  checks.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING'
  checks.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? 'MISSING'
  checks.ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'MISSING'
  checks.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'MISSING'

  // Test DB connection
  try {
    const { neon } = await import('@neondatabase/serverless')
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set')
    const sql = neon(process.env.DATABASE_URL)
    const rows = await sql`SELECT 1 AS ok`
    checks.db_connection = rows[0] ? 'OK' : 'FAILED'
  } catch (err) {
    checks.db_connection = `ERROR: ${err instanceof Error ? err.message : String(err)}`
  }

  const allOk = Object.values(checks).every((v) => v === 'set' || v === 'OK' || v.startsWith('https://'))
  return NextResponse.json({ status: allOk ? 'ok' : 'degraded', checks }, { status: allOk ? 200 : 500 })
}
