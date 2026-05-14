'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: string
  name: string
  unit_price: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (product_id: string) => void
  updateQty: (product_id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalEur: number
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalEur: 0,
})

const STORAGE_KEY = 'tsg_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === item.product_id)
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeItem(product_id: string) {
    setItems(prev => prev.filter(i => i.product_id !== product_id))
  }

  function updateQty(product_id: string, qty: number) {
    if (qty <= 0) { removeItem(product_id); return }
    setItems(prev => prev.map(i => i.product_id === product_id ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalEur = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalEur }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  return useContext(CartContext)
}
