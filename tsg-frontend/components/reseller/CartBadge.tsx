'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartBadge() {
  const { totalItems } = useCart()
  if (totalItems === 0) return null

  return (
    <Link href="/reseller/winkelwagen" className="cart-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span className="cart-badge-count">{totalItems}</span>
      <span className="cart-badge-label">Winkelwagen</span>
    </Link>
  )
}
