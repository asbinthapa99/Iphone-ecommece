'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const MESSAGES = [
  "📣 Exclusive discounts every week!",
  "🔥 New phone models dropping soon.",
  "💻 Apple MacBooks will be available very soon!"
]

export function TopBanner() {
  const pathname = usePathname()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="pwa-hide hidden md:flex w-full bg-[#060d0a] text-[#ffffff] items-center justify-center overflow-hidden z-[60] h-10 border-b border-white/10">
      <div className="relative w-full max-w-lg h-full px-4 text-center flex items-center justify-center">
        {MESSAGES.map((msg, i) => (
          <p
            key={i}
            className="absolute text-[13px] md:text-sm font-medium tracking-wide transition-all duration-700 ease-in-out w-full"
            style={{
              opacity: currentIndex === i ? 1 : 0,
              transform: currentIndex === i ? 'translateY(0)' : 'translateY(10px)',
              pointerEvents: currentIndex === i ? 'auto' : 'none'
            }}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  )
}
