'use client'

import { useState } from 'react'

const QUICK = [
  { key: 'all', label: 'All' },
  { key: 'grade-a', label: 'Grade A' },
  { key: 'under-50k', label: 'Under 50k' },
]

const SERIES = [
  { key: 'iPhone 16', label: '16' },
  { key: 'iPhone 15', label: '15' },
  { key: 'iPhone 14', label: '14' },
  { key: 'iPhone 13', label: '13' },
  { key: 'iPhone 12', label: '12' },
  { key: 'iPhone 11', label: '11' },
  { key: 'iPhone XS', label: 'XS' },
  { key: 'iPhone XR', label: 'XR' },
  { key: 'iPhone X', label: 'X' },
  { key: 'iPhone 8', label: '8' },
  { key: 'iPhone 7', label: '7' },
  { key: 'iPhone 6', label: '6' },
  { key: 'iPhone SE', label: 'SE' },
]

interface FilterChipsProps {
  onFilterChange: (filter: string) => void
}

export function FilterChips({ onFilterChange }: FilterChipsProps) {
  const [active, setActive] = useState('all')

  const handleClick = (key: string) => {
    setActive(key)
    onFilterChange(key)
  }

  const chipStyle = (key: string) =>
    active === key
      ? { background: '#060d0a', color: '#1D9E75', border: '1px solid transparent' }
      : { background: '#f4f4f0', color: '#444', border: '1px solid #e8e8e4' }

  return (
    <div className="flex flex-col gap-2">
      {/* Quick filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK.map((f) => (
          <button
            key={f.key}
            onClick={() => handleClick(f.key)}
            className="shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-full"
            style={chipStyle(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Model series */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {SERIES.map((f) => (
          <button
            key={f.key}
            onClick={() => handleClick(f.key)}
            className="shrink-0 rounded-full"
            style={{
              ...chipStyle(f.key),
              fontSize: 11,
              fontWeight: 600,
              padding: '5px 12px',
              letterSpacing: '0.01em',
            }}
          >
            {`iPhone ${f.label}`}
          </button>
        ))}
      </div>
    </div>
  )
}
