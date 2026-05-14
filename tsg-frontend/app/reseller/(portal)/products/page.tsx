'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

const TAG_IMAGES: Record<string, string> = {
  'collageen':   '/images/marine-collageen-13000-het-ochtendritueel-van-the-.jpg',
  'omega-3':     '/images/freja.jpg',
  'biotine':     '/images/nordsilk.jpg',
  'serum':       '/images/hermade-product.jpg',
  'q10':         '/images/marine-collageen-13000-lifestyle.jpg',
  'probiotica':  '/images/nordsilk-het-haarritueel-van-the-swedish-glow.jpg',
  'vitamine-d':  '/images/hermade-2.jpg',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const { addItem } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  useEffect(() => {
    apiJson<Product[]>('/products')
      .then(setProducts)
      .catch((e) => console.error('products:', e.message))
  }, [])

  function handleAdd(p: Product) {
    addItem({ product_id: p.id, name: p.name, unit_price: p.net_price_eur })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 600)
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.tag ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Assortiment" title="Producten" />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Zoeken..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {products.length === 0 && <div className="loading">Laden...</div>}

      <div className="products-grid">
        {filtered.map((p, i) => {
          const numeral = NUMERALS[i] ?? String(i + 1)
          const imgSrc = p.tag ? TAG_IMAGES[p.tag] : undefined
          return (
            <div key={p.id} className="product-card">
              <div className="product-image-wrap">
                <span className="product-image-num">{numeral}</span>
                {imgSrc
                  ? <img src={imgSrc} alt={p.name} />
                  : <div className="product-image-fallback">
                      <span className="num">{numeral}</span>
                      <span className="label">Product</span>
                    </div>
                }
              </div>
              <div className="product-body">
                {p.tag && <div className="product-tag">{p.tag}</div>}
                <div className="product-name">{p.name}</div>
                <div className="product-pricing">
                  <span className="product-price-list">{fmt(p.list_price_eur)}</span>
                  <span className="product-price-net">{fmt(p.net_price_eur)}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAdd(p)}
                >
                  {added === p.id ? '✓ Toegevoegd' : 'Toevoegen aan offerte →'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
