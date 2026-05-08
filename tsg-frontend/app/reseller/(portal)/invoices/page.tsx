'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Invoice } from '@/lib/types'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    apiJson<Invoice[]>('/resellers/me/invoices').then(setInvoices)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const fmtDate = (d: string | null) =>
    d ? new Intl.DateTimeFormat('nl-NL').format(new Date(d)) : '—'

  const STATUS_LABELS: Record<Invoice['status'], string> = {
    draft: 'Concept', outstanding: 'Openstaand', paid: 'Betaald', overdue: 'Achterstallig',
  }

  return (
    <div className="panel" id="panel-invoices">
      <h1>Facturen</h1>
      {invoices.length === 0 && <div className="loading">Laden...</div>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Factuurnummer</th>
            <th>Datum</th>
            <th>Vervaldatum</th>
            <th>Totaal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.invoice_number ?? '—'}</td>
              <td>{fmtDate(inv.invoice_date)}</td>
              <td>{fmtDate(inv.due_date)}</td>
              <td>{fmt(inv.total_eur)}</td>
              <td><span className={`status-badge status-${inv.status}`}>{STATUS_LABELS[inv.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
