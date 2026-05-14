'use client'
import { useReseller } from '@/lib/reseller-context'

interface PageHeaderProps {
  eyebrow: string
  title: string
}

export default function PageHeader({ eyebrow, title }: PageHeaderProps) {
  const reseller = useReseller()
  const tier = reseller?.tier ?? null
  const tierLabel = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : null

  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-header-eyebrow">{eyebrow}</div>
        <h1 className="page-header-title">{title}</h1>
      </div>
      {tierLabel && (
        <div className="page-header-tier">
          <div className="page-header-tier-label">Uw tier</div>
          <div className="page-header-tier-value">{tierLabel}</div>
        </div>
      )}
    </div>
  )
}
