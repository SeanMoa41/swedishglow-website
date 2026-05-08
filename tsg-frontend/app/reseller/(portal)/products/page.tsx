'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Product } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    apiJson<Product[]>('/products').then(setProducts)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-products">
      <h1>Producten</h1>
      {products.length === 0 && <div className="loading">Laden...</div>}
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            {p.image_url && <img src={p.image_url} alt={p.name} className="product-img" />}
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              {p.tag && <div className="product-tag">{p.tag}</div>}
              {p.description && <div className="product-desc">{p.description}</div>}
              <div className="product-prices">
                <span className="list-price">Advies: {fmt(p.list_price_eur)}</span>
                <span className="net-price">Uw prijs: {fmt(p.net_price_eur)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
