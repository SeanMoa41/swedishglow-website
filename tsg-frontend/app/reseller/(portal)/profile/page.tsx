'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { Reseller } from '@/lib/types'

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
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await apiFetch('/resellers/me/profile', {
      method: 'PUT',
      body: JSON.stringify({ first_name: firstName, last_name: lastName, phone }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!reseller) return <div className="loading">Laden...</div>

  return (
    <div className="panel" id="panel-profile">
      <h1>Profiel</h1>
      <form onSubmit={handleSave} className="profile-form">
        <div className="field-group">
          <label htmlFor="firstName">Voornaam</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="lastName">Achternaam</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="phone">Telefoonnummer</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="field-group readonly">
          <label>E-mailadres</label>
          <div className="readonly-value">{reseller.email}</div>
        </div>
        <div className="field-group readonly">
          <label>Bedrijf</label>
          <div className="readonly-value">{reseller.company}</div>
        </div>
        <button type="submit" className="save-btn">Opslaan</button>
      </form>
      {saved && <div className="toast show">Profiel opgeslagen</div>}
    </div>
  )
}
