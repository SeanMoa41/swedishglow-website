'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import s from './page.module.css'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(true)
      setLoading(false)
      return
    }
    const next = searchParams.get('next') ?? '/reseller/dashboard'
    router.push(next)
  }

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <nav className={s.nav}>
          <Link href="/" className={s.logo}>
            <img src="/images/the-swedish-glow-logo.png" className={s.logoMark} alt="" />
            <span className={s.logoText}>The Swedish <em>Glow</em></span>
          </Link>
          <Link href="/" className={s.backLink}>← Terug naar de website</Link>
        </nav>
      </header>

      <main className={s.main}>
        {/* Left visual panel */}
        <section className={s.visual}>
          <img src="/images/the-swedish-glow-logo.png" className={s.visualBg} alt="" aria-hidden="true" />
          <div className={s.visualTop}>
            <div className={s.visualEyebrow}>Reseller Portal</div>
            <h1 className={s.visualHeading}>
              Welkom terug bij <em>The Swedish Glow</em>.
            </h1>
            <p className={s.visualBody}>
              Een exclusieve omgeving voor onze partners. Hier vind je actuele voorraad,
              marketingmateriaal, bestelmodules en alles wat je nodig hebt om jouw klanten
              optimaal te bedienen.
            </p>
          </div>
          <div className={s.features}>
            {[
              'Toegang tot exclusieve reseller-prijzen en bundels',
              'Marketingmateriaal: foto\'s, video\'s en social templates',
              'Real-time voorraad en directe bestelmodule',
              'Persoonlijke contactpersoon en trainingsmateriaal',
            ].map((text) => (
              <div key={text} className={s.feature}>
                <span className={s.featureCheck}>
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6 L5 9 L10 3" />
                  </svg>
                </span>
                <span className={s.featureLabel}>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right form panel */}
        <section className={s.formWrap}>
          <div className={s.formContent}>
            <div className={s.formEyebrow}>Inloggen</div>
            <h2 className={s.formHeading}>Welkom <em>terug</em>.</h2>
            <p className={s.formLead}>
              Voer je e-mailadres en wachtwoord in om toegang te krijgen tot het reseller portaal.
            </p>

            {error && (
              <div className={s.error}>Ongeldig e-mailadres of wachtwoord.</div>
            )}

            <form className={s.form} onSubmit={handleSubmit}>
              <div className={s.field}>
                <label className={s.fieldLabel} htmlFor="email">E-mailadres</label>
                <input
                  className={s.fieldInput}
                  type="email"
                  id="email"
                  placeholder="naam@salon.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className={s.field}>
                <label className={s.fieldLabel} htmlFor="password">Wachtwoord</label>
                <input
                  className={s.fieldInput}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className={s.formRow}>
                <label className={s.rememberLabel}>
                  <input type="checkbox" />
                  <span>Onthoud mij</span>
                </label>
                <Link href="/reseller/reset-password" className={s.forgotLink}>
                  Wachtwoord vergeten?
                </Link>
              </div>
              <button className={s.submitBtn} type="submit" disabled={loading}>
                {loading ? 'Bezig...' : <>Inloggen <span className={s.arrow}>→</span></>}
              </button>
            </form>

            <div className={s.divider}>of</div>

            <div className={s.noAccount}>
              Nog geen account? <Link href="/reseller/register">Word reseller</Link>
            </div>

            <div className={s.securityNote}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 1 L3 3 v5 c0 4 5 7 5 7 s5-3 5-7 V3 L8 1z" />
                <path d="M6 8 L7 9 L10 6" strokeWidth="1.6" />
              </svg>
              <span>SSL-beveiligd · Jouw gegevens zijn versleuteld en veilig</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
