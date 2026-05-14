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
  const [saved, setSaved] = useState(false)

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
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('save profile:', e)
    }
  }

  if (!reseller) return <div className="loading">Laden...</div>

  const initials = [reseller.first_name, reseller.last_name]
    .filter(Boolean)
    .map(n => n![0].toUpperCase())
    .join('') || reseller.email[0].toUpperCase()

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Account" title="Mijn gegevens" />

      <div className="profile-head">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-id">
          <div className="name">
            {[reseller.first_name, reseller.last_name].filter(Boolean).join(' ') || reseller.email}
          </div>
          <div className="company">{reseller.company ?? '—'}</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="form-grid">
          <div>
            <label className="field-label">Voornaam</label>
            <input
              className="field-input"
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Achternaam</label>
            <input
              className="field-input"
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Telefoonnummer</label>
            <input
              className="field-input"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
          <div>
            <div className="field-label">E-mailadres</div>
            <div style={{ paddingTop: '10px' }}>{reseller.email}</div>
          </div>
          <div>
            <div className="field-label">Bedrijf</div>
            <div style={{ paddingTop: '10px' }}>{reseller.company ?? '—'}</div>
          </div>
          <div className="full">
            <button type="submit" className="btn btn-primary">Opslaan</button>
          </div>
        </div>
      </form>

      {saved && <div className="toast show">Profiel opgeslagen</div>}
    </div>
  )
}
