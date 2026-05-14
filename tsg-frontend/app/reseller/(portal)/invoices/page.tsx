'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Invoice } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const STATUS_LABELS: Record<Invoice['status'], string> = {
  draft: 'Concept',
  outstanding: 'Openstaand',
  paid: 'Betaald',
  overdue: 'Te laat',
}

const STATUS_CSS: Record<Invoice['status'], string> = {
  draft: 'status-draft',
  outstanding: 'status-pending',
  paid: 'status-delivered',
  overdue: 'status-processing',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    apiJson<Invoice[]>('/resellers/me/invoices')
      .then(setInvoices)
      .catch((e) => console.error('invoices:', e.message))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const fmtDate = (d: string | null) =>
    d ? new Intl.DateTimeFormat('nl-NL').format(new Date(d)) : '—'

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Financieel" title="Facturen" />

      {invoices.length === 0 && <div className="loading">Laden...</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>FACTUURNR</th>
              <th>DATUM</th>
              <th>VERVALDATUM</th>
              <th>TOTAAL</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoice_number ?? inv.tl_invoice_id}</td>
                <td>{fmtDate(inv.invoice_date)}</td>
                <td>{fmtDate(inv.due_date)}</td>
                <td className="td-num">{fmt(inv.total_eur)}</td>
                <td>
                  <span className={`badge-status ${STATUS_CSS[inv.status]}`}>
                    {STATUS_LABELS[inv.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
