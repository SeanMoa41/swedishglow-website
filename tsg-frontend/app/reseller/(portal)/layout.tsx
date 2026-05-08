import '@/styles/portal.css'
import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/lib/supabase-server'
import type { Reseller } from '@/lib/types'
import Sidebar from '@/components/reseller/Sidebar'

const DEV_RESELLER: Reseller = {
  id: 'dev-bypass',
  email: 'dev@example.com',
  first_name: 'Dev',
  last_name: 'User',
  company: 'Dev Company',
  phone: '+31 6 00000000',
  country: 'NL',
  tier: 'pro',
  is_admin: true,
  status: 'active',
}

async function getReseller(token: string): Promise<Reseller> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
    return (
      <div className="shell" id="portal-shell">
        <Sidebar reseller={DEV_RESELLER} />
        <main className="main-content">
          {children}
        </main>
      </div>
    )
  }

  const supabase = await createServerSideClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/reseller/login')

  let reseller: Reseller
  try {
    reseller = await getReseller(session.access_token)
  } catch {
    redirect('/reseller/login')
  }

  return (
    <div className="shell" id="portal-shell">
      <Sidebar reseller={reseller} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
