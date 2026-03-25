'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface CartItem {
  deviceId: string
  model: string
  storage: string
  color: string
  grade: string
  price: number
  originalPrice?: number
  photo?: string
}

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (deviceId: string) => void
  hasItem: (deviceId: string) => boolean
  clearCart: () => void
}

const CartContext = createContext<CartContextValue>({
  items: [], count: 0, total: 0,
  addItem: () => {}, removeItem: () => {}, hasItem: () => false, clearCart: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount (Client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('inexa_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        queueMicrotask(() => setItems(parsed))
      } catch (err) {
        console.error('Failed to load cart', err)
      }
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('inexa_cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.deviceId === item.deviceId)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((deviceId: string) => {
    setItems((prev) => prev.filter((i) => i.deviceId !== deviceId))
  }, [])

  const hasItem = useCallback((deviceId: string) => {
    return items.some((i) => i.deviceId === deviceId)
  }, [items])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const count = items.length
  const total = items.reduce((s, i) => s + i.price, 0)

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, hasItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
