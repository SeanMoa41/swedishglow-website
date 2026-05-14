'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { apiJson } from '@/lib/api'
import PageHeader from '@/components/reseller/PageHeader'

export default function WinkelwagenPage() {
  const { items, removeItem, updateQty, clearCart, totalEur } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  async function handleSubmit() {
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await apiJson('/orders/quotation', {
        method: 'POST',
        body: JSON.stringify({
          lines: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        }),
      })
      clearCart()
      router.push('/reseller/quotations?success=1')
    } catch (e: unknown) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="panel-body">
        <PageHeader eyebrow="Bestellen" title="Winkelwagen" />
        <div className="cart-empty">
          <p>Uw winkelwagen is leeg.</p>
          <Link href="/reseller/products" className="btn btn-primary">
            Naar producten →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Bestellen" title="Winkelwagen" />

      <div className="cart-layout">
        <div className="cart-items">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stukprijs</th>
                  <th>Aantal</th>
                  <th>Totaal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.product_id}>
                    <td>{item.name}</td>
                    <td className="td-num">{fmt(item.unit_price)}</td>
                    <td>
                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="td-num">{fmt(item.unit_price * item.quantity)}</td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeItem(item.product_id)}
                        title="Verwijderen"
                      >×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/reseller/products" className="btn btn-ghost">
              ← Verder winkelen
            </Link>
          </div>
        </div>

        <div className="cart-summary">
          <div className="cart-summary-label">Uw bestelling</div>
          <div className="cart-summary-total">{fmt(totalEur)}</div>
          <div className="cart-summary-sub">exclusief BTW</div>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Bezig...' : 'Offerte indienen →'}
          </button>
          {error && <div className="cart-error">{error}</div>}
        </div>
      </div>
    </div>
  )
}
