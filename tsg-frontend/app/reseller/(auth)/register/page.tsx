'use client'
import { useState } from 'react'
import Link from 'next/link'

interface FormData {
  first_name: string
  last_name: string
  company: string
  email: string
  phone: string
  message: string
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', company: '',
    email: '', phone: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register-application', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="login-overlay">
        <p>Aanvraag ontvangen — je hoort zo snel mogelijk van ons.</p>
        <Link href="/reseller/login">Terug naar inloggen</Link>
      </div>
    )
  }

  return (
    <div className="login-overlay">
      <h2>Partner aanmelden</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Voornaam"
          value={form.first_name}
          onChange={update('first_name')}
          required
        />
        <input
          type="text"
          placeholder="Achternaam"
          value={form.last_name}
          onChange={update('last_name')}
          required
        />
        <input
          type="text"
          placeholder="Bedrijfsnaam"
          value={form.company}
          onChange={update('company')}
        />
        <input
          type="email"
          placeholder="E-mailadres"
          value={form.email}
          onChange={update('email')}
          required
        />
        <input
          type="tel"
          placeholder="Telefoonnummer"
          value={form.phone}
          onChange={update('phone')}
        />
        <textarea
          placeholder="Bericht (optioneel)"
          value={form.message}
          onChange={update('message')}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Bezig...' : 'Aanvragen'}
        </button>
      </form>
      <p>Al een account? <Link href="/reseller/login">Inloggen</Link></p>
    </div>
  )
}
