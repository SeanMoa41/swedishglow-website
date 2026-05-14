'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiJson } from '@/lib/api'
import type { Quotation } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

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
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get('success') === '1'

  useEffect(() => {
    apiJson<Quotation[]>('/resellers/me/quotations')
      .then(setQuotations)
      .catch((e) => console.error('quotations:', e.message))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Bestellen" title="Bestellingen" />

      {showSuccess && (
        <div className="success-banner">
          Offerte ingediend — wij nemen zo snel mogelijk contact op.
        </div>
      )}

      <div className="section-actions">
        <Link href="/reseller/products" className="btn btn-primary">
          Nieuwe bestelling →
        </Link>
      </div>

      <div className="section-eyebrow" style={{ marginTop: '2rem' }}>Eerdere offertes</div>

      {quotations.length === 0
        ? <p style={{ color: 'var(--muted)', padding: '20px 0' }}>Nog geen offertes</p>
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Totaal</th>
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
