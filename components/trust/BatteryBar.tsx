'use client'

import { useEffect, useState } from 'react'

export function BatteryBar({ health }: { health: number }) {
  const [width, setWidth] = useState(0)
  const color =
    health >= 90 ? '#1D9E75' : health >= 80 ? '#BA7517' : '#E24B4A'

  useEffect(() => {
    const t = setTimeout(() => setWidth(health), 100)
    return () => clearTimeout(t)
  }, [health])

  return (
    <div className="flex items-center gap-[5px]">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 3, background: '#f0f0ee' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      <span
        className="text-[10px] font-medium"
        style={{ color, minWidth: 28 }}
      >
        {health}%
      </span>
    </div>
  )
}
