'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { ResellerStats, TierInfo } from '@/lib/types'

const TIER_NAMES = ['Pearl', 'Rose', 'Pro', 'Elite', 'Black']
const TIER_KEYS = ['pearl', 'rose', 'pro', 'elite', 'black']

function tierIndex(key: string | null) {
  if (!key) return -1
  return TIER_KEYS.indexOf(key.toLowerCase())
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ResellerStats | null>(null)
  const [tier, setTier] = useState<TierInfo | null>(null)

  useEffect(() => {
    apiJson<ResellerStats>('/resellers/me/stats')
      .then(setStats)
      .catch((e) => console.error('stats:', e.message))
    apiJson<TierInfo>('/resellers/me/tier')
      .then(setTier)
      .catch((e) => console.error('tier:', e.message))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const currentIdx = tier ? tierIndex(tier.current_tier) : -1
  const fillPct = tier ? tier.progress_pct : 0

  return (
    <div className="panel-body">
      {/* Welcome banner */}
      <div className="welcome">
        <div className="welcome-content">
          <div className="welcome-eyebrow">Welkom terug</div>
          <h2>Partner Dashboard</h2>
          <p>Bekijk uw omzet, tier-voortgang en voordelen op één plek.</p>
        </div>
        <div className="welcome-tier">
          <div className="label">Uw tier</div>
          <div className="value">
            {tier ? tier.current_tier.charAt(0).toUpperCase() + tier.current_tier.slice(1) : '—'}
          </div>
          <span className="value-flourish" />
        </div>
      </div>

      {/* Stats grid */}
      {!stats && <div className="loading">Laden...</div>}
      {stats && (
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-label">Omzet dit jaar</div>
            <div className="stat-value">{fmt(stats.revenue_ytd_eur)}</div>
            <div className="stat-sub">YTD</div>
          </div>
          <div className="stat">
            <div className="stat-label">Bestellingen</div>
            <div className="stat-value">{stats.orders_ytd}</div>
            <div className="stat-sub">dit jaar</div>
          </div>
          <div className="stat">
            <div className="stat-label">Uw korting</div>
            <div className="stat-value">{stats.discount_pct}%</div>
            <div className="stat-sub">partner tarief</div>
          </div>
          <div className="stat">
            <div className="stat-label">
              {stats.next_tier ? `Naar ${stats.next_tier.charAt(0).toUpperCase() + stats.next_tier.slice(1)}` : 'Hoogste tier'}
            </div>
            <div className="stat-value">
              {stats.next_tier_gap_eur !== null ? fmt(stats.next_tier_gap_eur) : '✓'}
            </div>
            <div className="stat-sub">{stats.next_tier_gap_eur !== null ? 'nog nodig' : 'bereikt'}</div>
          </div>
        </div>
      )}

      {/* Tier progress */}
      {tier && (
        <div className="tier-progress">
          <div className="tier-progress-head">
            <div>Tier voortgang</div>
          </div>

          <div className="tier-track">
            <div className="tier-line">
              <div className="tier-line-fill" style={{ width: `${fillPct}%` }} />
            </div>
            <div className="tier-stops">
              {TIER_NAMES.map((name, i) => {
                let cls = 'tier-stop'
                if (i < currentIdx) cls += ' done'
                else if (i === currentIdx) cls += ' current'
                else cls += ' locked'
                return (
                  <div key={name} className={cls}>
                    <div className="tier-stop-dot" />
                    <div className="tier-stop-name">{name}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="tier-detail">
            <div>
              <div className="tier-detail-label">Voortgang naar volgende tier</div>
              <div className="tier-detail-value">{fmt(tier.revenue_ytd_eur)}</div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${fillPct}%` }} />
              </div>
              <div className="tier-detail-needed">
                {tier.next_tier && tier.next_tier_min_eur !== null
                  ? `${fmt(tier.next_tier_min_eur - tier.revenue_ytd_eur)} nog nodig voor ${tier.next_tier.charAt(0).toUpperCase() + tier.next_tier.slice(1)}`
                  : 'U heeft de hoogste tier bereikt'}
              </div>
            </div>
            <div>
              <div className="tier-detail-label">Uw voordelen</div>
              <ul className="tier-benefits">
                {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
