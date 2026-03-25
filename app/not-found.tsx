import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p style={{ fontSize: 80, lineHeight: 1, marginBottom: 16 }}>📱</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#060d0a', letterSpacing: '-0.8px', marginBottom: 8 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 28 }}>
          This page doesn&apos;t exist or was removed. Browse our verified iPhones instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/phones"
            className="inline-flex items-center justify-center gap-2"
            style={{ background: '#060d0a', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 12, textDecoration: 'none' }}
          >
            <Search size={14} /> Browse Phones
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2"
            style={{ background: '#f4f4f0', color: '#444', fontSize: 14, fontWeight: 500, padding: '12px 24px', borderRadius: 12, textDecoration: 'none' }}
          >
            <ArrowLeft size={14} /> Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}
