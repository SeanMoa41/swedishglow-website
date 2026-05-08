'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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
    <div id="login-overlay">
      <div className="login-utility-bar">
        Reseller Programma &mdash; Premium Nordic Beauty &mdash;{' '}
        <span>Familiemerk uit Zweden</span>
      </div>

      <div className="login-header">
        <div className="login-logo">
          <span className="logo-text">
            The Swedish <em>Glow</em>
          </span>
        </div>
      </div>

      <div className="login-stage">
        <aside className="login-aside">
          <div className="login-aside-overlay" />
          <div className="login-aside-content">
            <div className="login-aside-eyebrow">Reseller Portaal &mdash; sinds 2022</div>
            <h1>
              Een ritueel,
              <br />
              gedeeld in <em>vertrouwen</em>.
            </h1>
            <p className="login-aside-tagline">
              Voor partners die zorg dragen voor onze essences.
            </p>
          </div>
        </aside>

        <div className="login-form-wrap">
          <div className="login-form">
            <div className="login-screen active" id="screen-login">
              <div className="eyebrow">Inloggen</div>
              <h2>
                Welkom <em>terug</em>
              </h2>
              <p className="lead">Voer je gegevens in om door te gaan naar het portaal.</p>

              {error && (
                <div className="login-error" id="login-err">
                  Ongeldig e-mailadres of wachtwoord.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="field-label">E-mailadres</label>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="E-mailadres"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="field">
                  <label className="field-label">Wachtwoord</label>
                  <input
                    type="password"
                    id="login-pass"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button className="btn btn-block" type="submit" disabled={loading}>
                  {loading ? 'Bezig...' : 'Inloggen'}
                </button>
              </form>

              <div className="login-footer">
                Nog geen partner?{' '}
                <Link href="/reseller/register">Aanmelden als reseller</Link>
                <br />
                <Link href="/reseller/reset-password">Wachtwoord vergeten?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
