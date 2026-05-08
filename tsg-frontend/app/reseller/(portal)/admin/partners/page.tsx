'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { AdminReseller } from '@/lib/types'
import TierBadge from '@/components/reseller/TierBadge'

const TIERS = ['pearl', 'rose', 'pro', 'elite', 'black'] as const
type Tier = typeof TIERS[number]

export default function PartnersPage() {
  const [partners, setPartners] = useState<AdminReseller[]>([])

  useEffect(() => {
    apiJson<AdminReseller[]>('/admin/resellers').then(setPartners)
  }, [])

  async function setTier(id: string, tier: Tier) {
    await apiFetch(`/admin/resellers/${id}/tier`, {
      method: 'PUT',
      body: JSON.stringify({ tier, tier_override: true }),
    })
    setPartners(prev => prev.map(p => p.id === id ? { ...p, tier } : p))
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-partners">
      <h1>Partners</h1>
      {partners.length === 0 && <div className="loading">Laden...</div>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Bedrijf</th>
            <th>Tier</th>
            <th>Omzet YTD</th>
            <th>Override</th>
            <th>Wijzig tier</th>
          </tr>
        </thead>
        <tbody>
          {partners.map(p => (
            <tr key={p.id}>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.company}</td>
              <td><TierBadge tier={p.tier} /></td>
              <td>{fmt(p.revenue_ytd_eur)}</td>
              <td>{p.tier_override ? '✓' : '—'}</td>
              <td>
                <select
                  defaultValue={p.tier}
                  onChange={e => setTier(p.id, e.target.value as Tier)}
                >
                  {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
