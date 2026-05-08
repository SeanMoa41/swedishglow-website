import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/lib/supabase'
import type { Reseller } from '@/lib/types'
import Sidebar from '@/components/reseller/Sidebar'

async function getReseller(token: string): Promise<Reseller> {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
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
