'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { Reseller } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

export default function ProfilePage() {
  const [reseller, setReseller] = useState<Reseller | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    apiJson<Reseller>('/auth/me').then(r => {
      setReseller(r)
      setFirstName(r.first_name ?? '')
      setLastName(r.last_name ?? '')
      setPhone(r.phone ?? '')
    }).catch((e) => console.error('me:', e.message))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      await apiFetch('/resellers/me/profile', {
        method: 'PUT',
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone }),
      })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  if (!reseller) return <div className="loading">Laden...</div>

  const initials = [reseller.first_name, reseller.last_name]
    .filter(Boolean).map(n => n![0].toUpperCase()).join('') || reseller.email[0].toUpperCase()

  const tierLabel = reseller.tier
    ? reseller.tier.charAt(0).toUpperCase() + reseller.tier.slice(1)
    : '—'

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Account" title="Mijn gegevens" />

      <div className="profile-card">
        <div className="profile-card-head">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-card-id">
            <div className="profile-card-name">
              {[reseller.first_name, reseller.last_name].filter(Boolean).join(' ') || reseller.email}
            </div>
            <div className="profile-card-company">{reseller.company ?? '—'}</div>
            <span className="tier-badge">{tierLabel}</span>
          </div>
        </div>

        <div className="profile-card-divider" />

        <form onSubmit={handleSave}>
          <div className="profile-form-grid">
            <div className="profile-section">
              <div className="profile-section-label">Persoonsgegevens</div>
              <div className="form-grid">
                <div>
                  <label className="field-label">Voornaam</label>
                  <input className="field-input" type="text" value={firstName}
                    onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Achternaam</label>
                  <input className="field-input" type="text" value={lastName}
                    onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="full">
                  <label className="field-label">Telefoonnummer</label>
                  <input className="field-input" type="tel" value={phone}
                    onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-label">Accountgegevens</div>
              <div className="form-grid">
                <div className="full">
                  <div className="field-label">E-mailadres</div>
                  <div className="field-readonly">{reseller.email}</div>
                </div>
                <div className="full">
                  <div className="field-label">Bedrijf</div>
                  <div className="field-readonly">{reseller.company ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-save-row">
            {status === 'saved' && <span className="profile-status-ok">Wijzigingen opgeslagen</span>}
            {status === 'error' && <span className="profile-status-err">Er is iets misgegaan</span>}
            <button type="submit" className="btn btn-primary">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  )
}
