'use client'

import { useEffect, useState } from 'react'

export function useMobile() {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    // Capacitor sets this global when running natively
    const cap = (window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
    setIsNative(cap?.isNativePlatform?.() ?? false)
  }, [])

  return { isNative }
}

export function useSafeArea() {
  const [insets, setInsets] = useState({ top: 0, bottom: 0 })
  useEffect(() => {
    const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0')
    const bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0')
    setInsets({ top, bottom })
  }, [])
  return insets
}
