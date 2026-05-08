'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Reseller } from '@/lib/types'
import TierBadge from './TierBadge'
import { createClient } from '@/lib/supabase'

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
  section?: string
}

export default function Sidebar({ reseller }: { reseller: Reseller }) {
  const pathname = usePathname()
  const router = useRouter()

  const links: NavLink[] = [
    // Overzicht
    {
      href: '/reseller/dashboard',
      label: 'Dashboard',
      section: 'Overzicht',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: '/reseller/tier',
      label: 'Tier voordelen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L15 8l6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
        </svg>
      ),
    },
    // Bestellen
    {
      href: '/reseller/products',
      label: 'Producten',
      section: 'Bestellen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M6 2l-2 4v14a2 2 0 002 2h12a2 2 0 002-2V6l-2-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      href: '/reseller/quotations',
      label: 'Bestellingen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 11H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-2" />
          <path d="M9 11V7a3 3 0 016 0v4" />
        </svg>
      ),
    },
    {
      href: '/reseller/invoices',
      label: 'Facturen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      ),
    },
    // Bronnen
    {
      href: '/reseller/files',
      label: 'Marketingmateriaal',
      section: 'Bronnen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    // Account
    {
      href: '/reseller/profile',
      label: 'Mijn gegevens',
      section: 'Account',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  const adminLinks: NavLink[] = reseller.is_admin
    ? [
        {
          href: '/reseller/admin',
          label: 'Admin overzicht',
          section: 'Beheer',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          ),
        },
      ]
    : []

  const allLinks = [...links, ...adminLinks]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/reseller/login')
  }

  function renderNavItems(items: NavLink[]) {
    const rendered: React.ReactNode[] = []
    let lastSection: string | undefined = undefined

    for (const link of items) {
      if (link.section && link.section !== lastSection) {
        rendered.push(
          <div key={`section-${link.section}`} className="nav-section">
            {link.section}
          </div>
        )
        lastSection = link.section
      }
      rendered.push(
        <Link
          key={link.href}
          href={link.href}
          className={`nav-item${pathname === link.href ? ' active' : ''}`}
        >
          {link.icon}
          {link.label}
        </Link>
      )
    }

    return rendered
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-eyebrow">Partner Portaal</div>
        <div className="brand-name">
          The Swedish <em>Glow</em>
        </div>
      </div>

      <nav className="sidebar-nav">{renderNavItems(allLinks)}</nav>

      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <div>
            <div className="name">
              {reseller.first_name} {reseller.last_name}
            </div>
            <div className="company">{reseller.company}</div>
            <TierBadge tier={reseller.tier} />
          </div>
          <button
            className="logout-btn"
            onClick={handleSignOut}
            title="Uitloggen"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
