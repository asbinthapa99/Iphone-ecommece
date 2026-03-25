'use client'

import { useEffect, useState } from 'react'

export function useMobile() {
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    // Capacitor sets this global when running natively
    const win = window as typeof window & { Capacitor?: { isNativePlatform?: () => boolean } }
    const cap = win.Capacitor
    const value = cap?.isNativePlatform?.() ?? false
    queueMicrotask(() => setIsNative(value))
  }, [])

  return { isNative }
}

export function useSafeArea() {
  const [insets, setInsets] = useState({ top: 0, bottom: 0 })
  useEffect(() => {
    const el = document.documentElement
    const top = parseInt(getComputedStyle(el).getPropertyValue('--sat') || '0')
    const bottom = parseInt(getComputedStyle(el).getPropertyValue('--sab') || '0')
    queueMicrotask(() => setInsets({ top, bottom }))
  }, [])
  return insets
}
