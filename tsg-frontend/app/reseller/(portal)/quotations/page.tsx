'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Quotation, Product } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

interface LineItem { product_id: string; quantity: number }

const STATUS_LABELS: Record<Quotation['status'], string> = {
  draft: 'Concept',
  sent: 'Verzonden',
  accepted: 'Geaccepteerd',
  rejected: 'Afgewezen',
  expired: 'Verlopen',
}

const STATUS_CSS: Record<Quotation['status'], string> = {
  draft: 'status-draft',
  sent: 'status-pending',
  accepted: 'status-delivered',
  rejected: 'status-processing',
  expired: 'status-draft',
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<LineItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    apiJson<Quotation[]>('/resellers/me/quotations')
      .then(setQuotations)
      .catch((e) => console.error('quotations:', e.message))
    apiJson<Product[]>('/products')
      .then(setProducts)
      .catch((e) => console.error('products:', e.message))
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

  function updateQty(productId: string, qty: number) {
    if (qty < 1) { removeFromCart(productId); return }
    setCart(prev => prev.map(l => l.product_id === productId ? { ...l, quantity: qty } : l))
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(l => l.product_id !== productId))
  }

  async function submitQuotation() {
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      await apiJson('/orders/quotation', {
        method: 'POST',
        body: JSON.stringify({ line_items: cart }),
      })
      const updated = await apiJson<Quotation[]>('/resellers/me/quotations')
      setQuotations(updated)
      setCart([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      console.error('submit quotation:', e instanceof Error ? e.message : e)
    } finally {
      setSubmitting(false)
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Bestellen" title="Bestellingen" />

      {/* Product selection */}
      <div className="section-eyebrow">Producten toevoegen</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Uw prijs</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="td-num">{fmt(p.net_price_eur)}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => addToCart(p.id)}>+ Toevoegen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <>
          <div className="section-eyebrow">Uw selectie</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Prijs</th>
                  <th>Aantal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => {
                  const p = products.find(x => x.id === item.product_id)
                  return (
                    <tr key={item.product_id} className="cart-row">
                      <td>{p?.name ?? '—'}</td>
                      <td className="td-num">{p ? fmt(p.net_price_eur * item.quantity) : '—'}</td>
                      <td>
                        <input
                          type="number"
                          className="field-input"
                          style={{ width: '4rem' }}
                          value={item.quantity}
                          min={1}
                          onChange={e => updateQty(item.product_id, parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td>
                        <button className="btn btn-ghost" onClick={() => removeFromCart(item.product_id)}>
                          Verwijder
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={submitQuotation}
              disabled={submitting}
            >
              {submitting ? 'Bezig...' : 'Offerte versturen →'}
            </button>
          </div>
        </>
      )}

      {success && <div className="toast show">Offerte aangemaakt</div>}

      {/* Previous quotations */}
      <div className="section-eyebrow" style={{ marginTop: '2rem' }}>Eerdere offertes</div>
      {quotations.length === 0
        ? <p style={{ color: 'var(--muted)' }}>Nog geen offertes</p>
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>DATUM</th>
                  <th>STATUS</th>
                  <th>TOTAAL</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(q => (
                  <tr key={q.id}>
                    <td>{new Intl.DateTimeFormat('nl-NL').format(new Date(q.created_at))}</td>
                    <td>
                      <span className={`badge-status ${STATUS_CSS[q.status]}`}>
                        {STATUS_LABELS[q.status]}
                      </span>
                    </td>
                    <td className="td-num">{q.total_eur !== null ? fmt(q.total_eur) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
