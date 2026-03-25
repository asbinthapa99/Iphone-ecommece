'use client'

import { useState, useEffect } from 'react'

/**
 * Detects whether the app is running as a standalone PWA
 * (i.e., installed via "Add to Home Screen").
 */
export function usePWA() {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean }
    const iosStandalone = nav.standalone === true
    const mediaStandalone = window.matchMedia('(display-mode: standalone)').matches
    const combined = iosStandalone || mediaStandalone

    // Sync state using microtask to avoid React 19 cascading render lint error
    queueMicrotask(() => setIsStandalone(combined))

    // Listen for changes
    const mq = window.matchMedia('(display-mode: standalone)')
    const handler = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches || iosStandalone)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return { isStandalone }
}
