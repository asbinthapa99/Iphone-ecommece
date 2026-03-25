'use client'

import { useState, useEffect } from 'react'

/**
 * Detects whether the app is running as a standalone PWA
 * (i.e., installed via "Add to Home Screen").
 */
export function usePWA() {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // iOS Safari standalone mode
    const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    // Android / Desktop PWA (display-mode: standalone)
    const mediaStandalone = window.matchMedia('(display-mode: standalone)').matches

    setIsStandalone(iosStandalone || mediaStandalone)

    // Listen for changes (e.g., if installed while page is open)
    const mq = window.matchMedia('(display-mode: standalone)')
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches || iosStandalone)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return { isStandalone }
}
