'use client'

import { useEffect, useRef, ReactNode } from 'react'

// CSS-only scroll animations — works reliably on iOS Safari / PWA.
// framer-motion whileInView often doesn't fire on iOS Safari causing invisible elements.

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If IntersectionObserver unavailable (very old browser) just show immediately
    if (!('IntersectionObserver' in window)) {
      el.classList.add('revealed')
      return
    }

    // Already in viewport on mount → show immediately, no animation delay
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      el.classList.add('revealed')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

interface Props {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
}

export function FadeIn({ children, className = '', style = {}, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div
      ref={ref}
      className={`fade-reveal ${className}`}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

export function FadeInStagger({ children, className = '', style = {} }: Omit<Props, 'delay'>) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  return (
    <div ref={ref} className={`fade-stagger ${className}`} style={style}>
      {children}
    </div>
  )
}

export function FadeInChild({ children, className = '', style = {} }: Omit<Props, 'delay'>) {
  return (
    <div className={`fade-child ${className}`} style={style}>
      {children}
    </div>
  )
}
