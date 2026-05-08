'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { Application } from '@/lib/types'

const TIERS = ['pearl', 'rose', 'pro', 'elite', 'black'] as const
type Tier = typeof TIERS[number]

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [assignedTiers, setAssignedTiers] = useState<Record<string, Tier>>({})

  useEffect(() => {
    apiJson<Application[]>('/admin/applications').then(apps => {
      setApplications(apps)
      const tiers: Record<string, Tier> = {}
      apps.forEach(a => { tiers[a.id] = (a.assigned_tier as Tier) || 'pearl' })
      setAssignedTiers(tiers)
    })
  }, [])

  async function approve(id: string) {
    await apiFetch(`/admin/applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ assigned_tier: assignedTiers[id] ?? 'pearl' }),
    })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a))
  }

  async function reject(id: string) {
    await apiFetch(`/admin/applications/${id}/reject`, { method: 'POST' })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a))
  }

  const pending = applications.filter(a => a.status === 'pending')
  const processed = applications.filter(a => a.status !== 'pending')

  return (
    <div className="panel" id="panel-applications">
      <h1>Aanvragen</h1>
      <h2>Openstaand ({pending.length})</h2>
      {pending.length === 0 && <p>Geen openstaande aanvragen</p>}
      {pending.map(app => (
        <div key={app.id} className="application-card">
          <div className="app-info">
            <strong>{app.first_name} {app.last_name}</strong> — {app.company}
            <div>{app.email}</div>
            {app.message && <div className="app-message">{app.message}</div>}
          </div>
          <div className="app-actions">
            <select
              value={assignedTiers[app.id] ?? 'pearl'}
              onChange={e => setAssignedTiers(prev => ({ ...prev, [app.id]: e.target.value as Tier }))}
            >
              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => approve(app.id)} className="approve-btn">Goedkeuren</button>
            <button onClick={() => reject(app.id)} className="reject-btn">Afwijzen</button>
          </div>
        </div>
      ))}
      {processed.length > 0 && (
        <>
          <h2>Verwerkt ({processed.length})</h2>
          <table className="data-table">
            <thead><tr><th>Naam</th><th>Bedrijf</th><th>Status</th></tr></thead>
            <tbody>
              {processed.map(app => (
                <tr key={app.id}>
                  <td>{app.first_name} {app.last_name}</td>
                  <td>{app.company}</td>
                  <td>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
