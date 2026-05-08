'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Quotation, Product } from '@/lib/types'

interface LineItem { product_id: string; quantity: number }

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<LineItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    apiJson<Quotation[]>('/resellers/me/quotations').then(setQuotations)
    apiJson<Product[]>('/products').then(setProducts)
  }, [])

  function addToCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(l => l.product_id === productId)
      if (existing) {
        return prev.map(l => l.product_id === productId ? { ...l, quantity: l.quantity + 1 } : l)
      }
      return [...prev, { product_id: productId, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(l => l.product_id !== productId))
  }

  async function submitQuotation() {
    if (cart.length === 0) return
    setSubmitting(true)
    await apiJson('/orders/quotation', {
      method: 'POST',
      body: JSON.stringify({ line_items: cart }),
    })
    const updated = await apiJson<Quotation[]>('/resellers/me/quotations')
    setQuotations(updated)
    setCart([])
    setSuccess(true)
    setSubmitting(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const STATUS_LABELS: Record<Quotation['status'], string> = {
    draft: 'Concept', sent: 'Verzonden', accepted: 'Geaccepteerd',
    rejected: 'Afgewezen', expired: 'Verlopen',
  }

  return (
    <div className="panel" id="panel-quotations">
      <h1>Offerte aanvragen</h1>
      <section className="product-select">
        <h2>Producten toevoegen</h2>
        <div className="product-list">
          {products.map(p => (
            <div key={p.id} className="product-row">
              <span className="product-name">{p.name}</span>
              <span className="net-price">{fmt(p.net_price_eur)}</span>
              <button onClick={() => addToCart(p.id)}>+</button>
            </div>
          ))}
        </div>
      </section>
      {cart.length > 0 && (
        <section className="cart">
          <h2>Uw selectie</h2>
          {cart.map(item => {
            const p = products.find(x => x.id === item.product_id)
            return (
              <div key={item.product_id} className="cart-row">
                <span>{p?.name} × {item.quantity}</span>
                <button onClick={() => removeFromCart(item.product_id)}>Verwijder</button>
              </div>
            )
          })}
          <button
            className="submit-btn"
            onClick={submitQuotation}
            disabled={submitting}
          >
            {submitting ? 'Bezig...' : 'Offerte aanvragen'}
          </button>
        </section>
      )}
      {success && <div className="toast show">Offerte aangemaakt</div>}
      <section className="quotations-history">
        <h2>Eerdere offertes</h2>
        {quotations.length === 0 && <p>Nog geen offertes</p>}
        <table className="data-table">
          <thead><tr><th>Datum</th><th>Status</th><th>Totaal</th></tr></thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q.id}>
                <td>{new Intl.DateTimeFormat('nl-NL').format(new Date(q.created_at))}</td>
                <td>{STATUS_LABELS[q.status]}</td>
                <td>{q.total_eur !== null ? fmt(q.total_eur) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
