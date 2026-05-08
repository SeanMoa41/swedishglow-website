import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Public auth pages: redirect to dashboard if already logged in
  if (pathname === '/reseller/login' || pathname === '/reseller/register') {
    if (user) {
      return NextResponse.redirect(new URL('/reseller/dashboard', request.url))
    }
    return supabaseResponse
  }

  // All other /reseller/* routes: require auth
  if (!user) {
    const url = new URL('/reseller/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Admin routes: check is_admin via backend
  if (pathname.startsWith('/reseller/admin')) {
    const { data: { session } } = await supabase.auth.getSession()
    const meRes = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/auth/me',
      { headers: { Authorization: `Bearer ${session?.access_token}` } }
    )
    if (!meRes.ok) {
      return NextResponse.redirect(new URL('/reseller/dashboard', request.url))
    }
    const me = await meRes.json()
    if (!me.is_admin) {
      return NextResponse.redirect(new URL('/reseller/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/reseller/:path*'],
}
