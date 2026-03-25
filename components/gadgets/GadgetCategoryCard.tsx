import Link from 'next/link'
import type { ReactNode } from 'react'

interface CategoryCardProps {
  name: string
  href: string
  logo: ReactNode
  count?: number
}

export function GadgetCategoryCard({ name, href, logo, count }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group relative cursor-pointer bg-white hover:bg-[#fafaf8] transition-colors duration-300 rounded-[20px] flex flex-col items-center justify-center gap-3"
      style={{
        border: '1px solid #ebebeb',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        padding: '20px 12px 16px',
        minHeight: 150,
      }}
    >
      {/* Count badge */}
      {count != null && count > 0 && (
        <div className="absolute top-3 right-3 rounded-full px-2 py-0.5" style={{ background: '#f0f0ee' }}>
          <span className="text-[10px] font-bold text-[#555]">{count}</span>
        </div>
      )}

      <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
        {logo}
      </div>

      <span style={{ fontSize: 13, fontWeight: 600, color: '#111', textAlign: 'center', lineHeight: 1.3, width: '100%' }}>
        {name}
      </span>
    </Link>
  )
}
