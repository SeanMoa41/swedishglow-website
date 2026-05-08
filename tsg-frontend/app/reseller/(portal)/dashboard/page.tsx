'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { ResellerStats, TierInfo } from '@/lib/types'
import TierBadge from '@/components/reseller/TierBadge'
import ProgressBar from '@/components/reseller/ProgressBar'

export default function DashboardPage() {
  const [stats, setStats] = useState<ResellerStats | null>(null)
  const [tier, setTier] = useState<TierInfo | null>(null)

  useEffect(() => {
    apiJson<ResellerStats>('/resellers/me/stats').then(setStats)
    apiJson<TierInfo>('/resellers/me/tier').then(setTier)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-dashboard">
      <h1>Dashboard</h1>
      {!stats && <div className="loading">Laden...</div>}
      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Omzet dit jaar</div>
            <div className="stat-value">{fmt(stats.revenue_ytd_eur)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Bestellingen</div>
            <div className="stat-value">{stats.order_count}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Uw korting</div>
            <div className="stat-value">{stats.discount_pct}%</div>
          </div>
          {stats.next_tier && stats.next_tier_gap_eur !== null && (
            <div className="stat-card">
              <div className="stat-label">Naar {stats.next_tier}</div>
              <div className="stat-value">{fmt(stats.next_tier_gap_eur)} te gaan</div>
            </div>
          )}
        </div>
      )}
      {tier && (
        <div className="tier-section">
          <TierBadge tier={tier.tier as 'pearl' | 'rose' | 'pro' | 'elite' | 'black'} />
          <ProgressBar pct={tier.progress_pct} />
          <ul className="benefits-list">
            {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
