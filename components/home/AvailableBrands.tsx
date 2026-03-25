'use client'

import { useEffect, useRef } from 'react'

const BRANDS = [
  "Apple", "Samsung", "Google Pixel", "OnePlus", "Xiaomi", "Nothing", "Motorola", "Sony", "Asus ROG", "Oppo", "Vivo"
]

export function AvailableBrands() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logic for the continuous marquee effect
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let animationFrameId: number
    let pos = 0

    const scroll = () => {
      pos += 0.5 // speed
      if (pos >= el.scrollWidth / 2) {
        pos = 0 // reset when first set is fully scrolled
      }
      el.scrollLeft = pos
      animationFrameId = requestAnimationFrame(scroll)
    }
    
    // Setup cloned elements directly in the DOM to avoid React re-render looping complexity
    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <section className="py-12 border-t border-[#f0f0ee] bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 mb-8 text-center">
        <h2 className="text-[12px] font-bold text-[#888] tracking-[0.2em] uppercase">
          Available Brands
        </h2>
      </div>

      <div className="relative w-full flex items-center overflow-x-hidden">
        {/* Left/Right fade gradients for smooth entering/exiting */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className="flex items-center gap-12 md:gap-24 whitespace-nowrap overflow-x-hidden no-scrollbar"
          style={{ width: '100%' }}
        >
          {/* Double map to create seamless looping */}
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div 
              key={i}
              className="px-4 text-[24px] md:text-[32px] font-black tracking-tighter text-[#e0e0dc] hover:text-[#111] transition-colors duration-300 cursor-default"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
