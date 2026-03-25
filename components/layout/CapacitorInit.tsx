'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Dynamically imports Capacitor plugins so they only run in native context
export function CapacitorInit() {
  const pathname = usePathname()

  // One-time setup (runs for both native and PWA)
  useEffect(() => {
    // Block pinch-to-zoom on iOS (viewport meta is ignored by iOS Safari)
    const preventZoom = (e: Event) => e.preventDefault()
    document.addEventListener('gesturestart', preventZoom, { passive: false })
    document.addEventListener('gesturechange', preventZoom, { passive: false })

    const init = async () => {
      const cap = (window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      if (!cap?.isNativePlatform?.()) return

      try {
        const { SplashScreen } = await import('@capacitor/splash-screen')
        const { StatusBar, Style } = await import('@capacitor/status-bar')

        // Hide splash with a slight delay so the first paint is visible
        setTimeout(() => SplashScreen.hide(), 300)

        // Dark status bar (white text on dark bg)
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setBackgroundColor({ color: '#060d0a' })
      } catch {
        // Not on a native platform or plugin not available
      }
    }

    init()

    return () => {
      document.removeEventListener('gesturestart', preventZoom)
      document.removeEventListener('gesturechange', preventZoom)
    }
  }, [])

  // Update status bar style per-route
  useEffect(() => {
    const updateStatusBar = async () => {
      const cap = (window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      if (!cap?.isNativePlatform?.()) return

      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        // Admin and checkout pages use light status bar
        if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
          await StatusBar.setStyle({ style: Style.Light })
          await StatusBar.setBackgroundColor({ color: '#ffffff' })
        } else {
          await StatusBar.setStyle({ style: Style.Dark })
          await StatusBar.setBackgroundColor({ color: '#060d0a' })
        }
      } catch { /* ignore */ }
    }

    updateStatusBar()
  }, [pathname])

  return null
}
