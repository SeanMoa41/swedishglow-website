'use client'
import { useState } from 'react'
import Link from 'next/link'
import s from './page.module.css'

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

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <nav className={s.nav}>
          <Link href="/" className={s.logo}>
            <img src="/images/the-swedish-glow-logo.png" className={s.logoMark} alt="" />
            <span className={s.logoText}>The Swedish <em>Glow</em></span>
          </Link>
          <Link href="/reseller/login" className={s.backLink}>← Terug naar inloggen</Link>
        </nav>
      </header>

      <main className={s.main}>
        <div className={s.card}>
          {submitted ? (
            <div className={s.success}>
              <div className={s.successIcon}>
                <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11 L9 16 L18 6" />
                </svg>
              </div>
              <h1 className={s.successHeading}>Aanvraag <em>ontvangen</em>.</h1>
              <p className={s.successBody}>
                Bedankt voor je interesse in het reseller programma van The Swedish Glow.
                Ons team neemt zo snel mogelijk contact met je op.
              </p>
              <Link href="/reseller/login" className={s.backLink}>← Terug naar inloggen</Link>
            </div>
          ) : (
            <>
              <div className={s.eyebrow}>Partner aanmelden</div>
              <h1 className={s.heading}>Word <em>reseller</em>.</h1>
              <p className={s.lead}>
                Vul het formulier in en ons team neemt contact op zodra je aanvraag is beoordeeld.
                Gemiddelde verwerkingstijd: 2 werkdagen.
              </p>

              <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.fieldLabel} htmlFor="first_name">Voornaam</label>
                    <input
                      className={s.fieldInput}
                      id="first_name"
                      type="text"
                      placeholder="Anna"
                      value={form.first_name}
                      onChange={update('first_name')}
                      required
                    />
                  </div>
                  <div className={s.field}>
                    <label className={s.fieldLabel} htmlFor="last_name">Achternaam</label>
                    <input
                      className={s.fieldInput}
                      id="last_name"
                      type="text"
                      placeholder="Lindström"
                      value={form.last_name}
                      onChange={update('last_name')}
                      required
                    />
                  </div>
                </div>

                <div className={s.field}>
                  <label className={s.fieldLabel} htmlFor="company">Bedrijfsnaam</label>
                  <input
                    className={s.fieldInput}
                    id="company"
                    type="text"
                    placeholder="Salon De Glow"
                    value={form.company}
                    onChange={update('company')}
                  />
                </div>

                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.fieldLabel} htmlFor="email">E-mailadres</label>
                    <input
                      className={s.fieldInput}
                      id="email"
                      type="email"
                      placeholder="naam@salon.nl"
                      value={form.email}
                      onChange={update('email')}
                      required
                    />
                  </div>
                  <div className={s.field}>
                    <label className={s.fieldLabel} htmlFor="phone">Telefoonnummer</label>
                    <input
                      className={s.fieldInput}
                      id="phone"
                      type="tel"
                      placeholder="+31 6 00000000"
                      value={form.phone}
                      onChange={update('phone')}
                    />
                  </div>
                </div>

                <div className={s.field}>
                  <label className={s.fieldLabel} htmlFor="message">Toelichting <span style={{opacity:0.5}}>(optioneel)</span></label>
                  <textarea
                    className={s.fieldTextarea}
                    id="message"
                    placeholder="Vertel ons kort over je salon of winkel..."
                    value={form.message}
                    onChange={update('message')}
                  />
                </div>

                <button className={s.submitBtn} type="submit" disabled={loading}>
                  {loading ? 'Bezig...' : <>Aanvraag versturen <span className={s.arrow}>→</span></>}
                </button>
              </form>

              <div className={s.formFooter}>
                Al een account? <Link href="/reseller/login">Inloggen</Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
