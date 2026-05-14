'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import Link from 'next/link'
import PageHeader from '@/components/reseller/PageHeader'

export default function AdminPage() {
  const [resellerCount, setResellerCount] = useState<number | null>(null)
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [fileCount, setFileCount] = useState<number | null>(null)

  useEffect(() => {
    apiJson<{ id: string }[]>('/admin/resellers')
      .then(r => setResellerCount(r.length))
      .catch(() => setResellerCount(0))
    apiJson<{ id: string; status: string }[]>('/admin/applications')
      .then(apps => setPendingCount(apps.filter(a => a.status === 'pending').length))
      .catch(() => setPendingCount(0))
    apiJson<{ accessible: { id: string }[]; locked: { id: string }[] }>('/files')
      .then(d => setFileCount((d.accessible?.length ?? 0) + (d.locked?.length ?? 0)))
      .catch(() => setFileCount(0))
  }, [])

  const fmt = (n: number | null) => n !== null ? String(n) : '—'

  const navCards = [
    {
      href: '/reseller/admin/applications',
      title: 'Aanvragen beheren',
      description: 'Bekijk en verwerk partneraanvragen',
      icon: '📋',
    },
    {
      href: '/reseller/admin/partners',
      title: 'Partners beheren',
      description: 'Beheer resellers en tier-overschrijvingen',
      icon: '👥',
    },
    {
      href: '/reseller/admin/files',
      title: 'Bestanden beheren',
      description: 'Upload en beheer marketingmateriaal',
      icon: '📁',
    },
  ]

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Beheer" title="Admin overzicht" />

      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat">
          <div className="stat-label">Partners</div>
          <div className="stat-value">{fmt(resellerCount)}</div>
          <div className="stat-sub">actief</div>
        </div>
        <div className="stat">
          <div className="stat-label">Openstaande aanvragen</div>
          <div className="stat-value">{fmt(pendingCount)}</div>
          <div className="stat-sub">te verwerken</div>
        </div>
        <div className="stat">
          <div className="stat-label">Bestanden</div>
          <div className="stat-value">{fmt(fileCount)}</div>
          <div className="stat-sub">marketingmateriaal</div>
        </div>
      </div>

      <div className="section-eyebrow">Beheer</div>
      <div className="admin-nav-cards">
        {navCards.map(card => (
          <Link key={card.href} href={card.href} className="admin-nav-card">
            <span className="admin-nav-card-icon">{card.icon}</span>
            <div className="admin-nav-card-body">
              <div className="admin-nav-card-title">{card.title}</div>
              <div className="admin-nav-card-desc">{card.description}</div>
            </div>
            <span className="admin-nav-card-arrow">→</span>
          </Link>
        ))}
        <div className="admin-nav-card disabled">
          <span className="admin-nav-card-icon">🔮</span>
          <div className="admin-nav-card-body">
            <div className="admin-nav-card-title">Account Intelligence</div>
            <div className="admin-nav-card-desc">Binnenkort beschikbaar</div>
          </div>
        </div>
      </div>
    </div>
  )
}
