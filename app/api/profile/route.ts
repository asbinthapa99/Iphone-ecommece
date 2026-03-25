import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = session.user.email
    const body = await request.json()
    const { name, phone, address, city } = body

    // Ensure table has the new columns if they don't exist yet
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT;`
    } catch {
      // safe to ignore
    }

    // Update user profile
    await sql`
      UPDATE users
      SET name = ${name || null},
          phone = ${phone || null},
          address = ${address || null},
          city = ${city || null}
      WHERE email = ${email}
    `

    return NextResponse.json({ success: true, message: 'Profile updated' })

  } catch (err: any) {
    console.error('Failed to update profile:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = session.user.email

    const rows = await sql`
      SELECT name, email, phone, provider, address, city
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (err: any) {
    console.error('Failed to get profile:', err)
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 })
  }
}
