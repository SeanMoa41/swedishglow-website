'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { TierInfo } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const TIER_KEYS = ['pearl', 'rose', 'pro', 'elite', 'black']
const TIER_NAMES = ['Pearl', 'Rose', 'Pro', 'Elite', 'Black']
const TIER_NUMERALS = ['I', 'II', 'III', 'IV', 'V']

const TIER_DATA = [
  {
    key: 'pearl',
    name: 'Pearl',
    min_eur: 0,
    discount_pct: 10,
    perks: ['10% korting', 'Toegang tot productcatalogus'],
  },
  {
    key: 'rose',
    name: 'Rose',
    min_eur: 5000,
    discount_pct: 15,
    perks: ['15% korting', 'Prioriteit support', 'Rose marketingmateriaal'],
  },
  {
    key: 'pro',
    name: 'Pro',
    min_eur: 15000,
    discount_pct: 20,
    perks: ['20% korting', 'Dedicated accountmanager', 'Pro productpresentaties'],
  },
  {
    key: 'elite',
    name: 'Elite',
    min_eur: 40000,
    discount_pct: 25,
    perks: ['25% korting', 'Early access nieuwe producten', 'Elite evenementen'],
  },
  {
    key: 'black',
    name: 'Black',
    min_eur: 100000,
    discount_pct: 30,
    perks: ['30% korting', 'Co-marketing budget', 'Black concierge support'],
  },
]

function tierIndex(key: string | null) {
  if (!key) return -1
  return TIER_KEYS.indexOf(key.toLowerCase())
}

const fmtEur = (n: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export default function TierPage() {
  const [tier, setTier] = useState<TierInfo | null>(null)

  useEffect(() => {
    apiJson<TierInfo>('/resellers/me/tier')
      .then(setTier)
      .catch((e) => console.error('tier:', e.message))
  }, [])

  if (!tier) return <div className="loading">Laden...</div>

  const currentIdx = tierIndex(tier.current_tier)
  const TIER_LINE_POS = [0, 25, 50, 75, 100]
  const fillPct = (() => {
    const cur = TIER_LINE_POS[currentIdx] ?? 0
    const next = TIER_LINE_POS[currentIdx + 1] ?? 100
    return cur + (tier.progress_pct / 100) * (next - cur)
  })()

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Partner programma" title="Tier voordelen" />

      {/* Tier progress track */}
      <div className="tier-progress">
        <div className="tier-progress-head">
          <div>Uw voortgang</div>
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
            <div className="tier-detail-label">Omzet dit jaar</div>
            <div className="tier-detail-value">{fmtEur(tier.revenue_ytd_eur)}</div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${fillPct}%` }} />
            </div>
            <div className="tier-detail-needed">
              {tier.next_tier && tier.next_tier_min_eur !== null
                ? `${fmtEur(tier.next_tier_min_eur - tier.revenue_ytd_eur)} nog nodig voor ${tier.next_tier.charAt(0).toUpperCase() + tier.next_tier.slice(1)}`
                : 'U heeft de hoogste tier bereikt'}
            </div>
          </div>
          <div>
            <div className="tier-detail-label">Huidige voordelen</div>
            <ul className="tier-benefits">
              {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* All tier cards */}
      <div className="tiers-display">
        {TIER_DATA.map((t, i) => {
          const isCurrent = t.key === tier.current_tier.toLowerCase()
          return (
            <div
              key={t.key}
              className={`tier-card${isCurrent ? ' is-current' : ''}`}
              data-tier={t.name}
            >
              <span className="tier-card-numeral">{TIER_NUMERALS[i]}</span>
              {isCurrent && <div className="tier-card-current-badge">Jouw tier</div>}
              <div className="tier-card-eyebrow">Partner tier</div>
              <div className="tier-card-name">{t.name}</div>
              <div className="tier-card-min">Vanaf {fmtEur(t.min_eur)}</div>
              <div className="tier-card-discount">
                <span className="tier-card-discount-num">{t.discount_pct}%</span>
                <span className="tier-card-discount-label">korting</span>
              </div>
              <ul className="tier-perks">
                {t.perks.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
