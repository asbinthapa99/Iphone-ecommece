'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// iOS-style page slide-in on every route change
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('page-entered')
    // Force reflow so animation re-fires
    void el.offsetHeight
    el.classList.add('page-entered')
  }, [pathname])

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  )
}
