'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { AdminReseller, Application } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'
import Link from 'next/link'

export default function AdminPage() {
  const [resellers, setResellers] = useState<AdminReseller[]>([])
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    apiJson<AdminReseller[]>('/admin/resellers').then(setResellers)
    apiJson<Application[]>('/admin/applications').then(apps =>
      setPendingCount(apps.filter(a => a.status === 'pending').length)
    )
  }, [])

  return (
    <div className="panel" id="panel-admin">
      <PageHeader eyebrow="Beheer" title="Admin overzicht" />
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Partners</div>
          <div className="stat-value">{resellers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Openstaande aanvragen</div>
          <div className="stat-value">{pendingCount}</div>
        </div>
      </div>
      <nav className="admin-nav">
        <Link href="/reseller/admin/applications" className="admin-link">
          Aanvragen beheren
        </Link>
        <Link href="/reseller/admin/partners" className="admin-link">
          Partners beheren
        </Link>
        <Link href="/reseller/admin/files" className="admin-link">
          Bestanden beheren
        </Link>
      </nav>
    </div>
  )
}
