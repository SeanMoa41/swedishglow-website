import type { Reseller } from '@/lib/types'

type Tier = Reseller['tier']

const TIER_COLOURS: Record<Tier, string> = {
  pearl: '#c8c2b6',
  rose:  '#a06b7a',
  pro:   '#4a6b52',
  elite: '#b8924a',
  black: '#1c1c1a',
}

export default function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className="tier-pill"
      style={{ background: TIER_COLOURS[tier] ?? '#c8c2b6', color: '#f6f1e8' }}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}
