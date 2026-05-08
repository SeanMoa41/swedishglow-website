# TSG Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `tsg-frontend/` — a Next.js 15 app that replaces the static HTML files with a production site wired to the FastAPI backend and Supabase auth, preserving the existing visual design exactly.

**Architecture:** Next.js App Router with two route groups — `(marketing)` for static Server Component pages converted from HTML, and `reseller/` for the auth-gated portal split from the 171KB prototype. Supabase `@supabase/ssr` stores JWT in httpOnly cookies. `lib/api.ts` attaches the Bearer token to every backend call. `middleware.ts` guards all `/reseller/*` routes.

**Tech Stack:** Next.js 15, TypeScript 5, `@supabase/ssr` ^0.5, React 19, Jest 29 + React Testing Library 14

**Source assets:**
- Marketing HTML: `../assets/the-swedish-glow-website/*.html`
- Portal HTML: `../assets/reseller-portaal-netlify-v2/reseller-portaal-deploy-v2/index.html`
- Backend API: `../tsg-backend/` (running at `NEXT_PUBLIC_API_URL`)

---

## File Map

```
tsg-frontend/
├── app/
│   ├── layout.tsx                        root layout — html/body/fonts
│   ├── (marketing)/
│   │   ├── layout.tsx                    wraps every marketing page with Nav + Footer
│   │   ├── page.tsx                      /
│   │   ├── shop/page.tsx                 /shop
│   │   ├── nordsilk/page.tsx             /nordsilk
│   │   ├── freja/page.tsx                /freja
│   │   ├── hermade/page.tsx              /hermade
│   │   ├── marine-collageen/page.tsx     /marine-collageen
│   │   ├── over-ons/page.tsx             /over-ons
│   │   ├── stories/page.tsx              /stories
│   │   ├── contact/page.tsx              /contact
│   │   ├── reseller-programma/page.tsx   /reseller-programma
│   │   ├── start-hier/page.tsx           /start-hier
│   │   ├── supplementen/page.tsx         /supplementen
│   │   ├── nieuwsbrief/page.tsx          /nieuwsbrief
│   │   ├── levering/page.tsx             /levering
│   │   ├── winkelwagen/page.tsx          /winkelwagen → redirect WooCommerce
│   │   ├── mijn-account/page.tsx         /mijn-account → redirect WooCommerce
│   │   ├── privacy/page.tsx              /privacy
│   │   ├── voorwaarden/page.tsx          /voorwaarden
│   │   └── cookies/page.tsx              /cookies
│   └── reseller/
│       ├── (auth)/
│       │   ├── login/page.tsx            /reseller/login — public
│       │   └── register/page.tsx         /reseller/register — public
│       └── (portal)/
│           ├── layout.tsx                sidebar shell
│           ├── dashboard/page.tsx        /reseller/dashboard
│           ├── products/page.tsx         /reseller/products
│           ├── quotations/page.tsx       /reseller/quotations
│           ├── invoices/page.tsx         /reseller/invoices
│           ├── files/page.tsx            /reseller/files
│           ├── profile/page.tsx          /reseller/profile
│           └── admin/
│               ├── page.tsx              /reseller/admin
│               ├── applications/page.tsx /reseller/admin/applications
│               ├── partners/page.tsx     /reseller/admin/partners
│               └── files/page.tsx        /reseller/admin/files
├── components/
│   ├── Nav.tsx                           marketing nav — extracted from index.html
│   ├── Footer.tsx                        marketing footer — extracted from index.html
│   ├── MobileMenu.tsx                    mobile nav drawer
│   └── reseller/
│       ├── Sidebar.tsx                   portal sidebar + nav links
│       ├── TierBadge.tsx                 tier pill (pearl/rose/pro/elite/black)
│       └── ProgressBar.tsx               tier revenue progress bar
├── lib/
│   ├── api.ts                            apiFetch() — Bearer JWT injected automatically
│   ├── supabase.ts                       browser + server Supabase clients
│   └── types.ts                          shared TypeScript interfaces for API responses
├── styles/
│   └── globals.css                       all CSS from HTML files consolidated here
├── middleware.ts                         auth guard for /reseller/* routes
├── public/
│   └── _redirects                        legacy .html URL redirects for Netlify
├── __tests__/
│   ├── lib/api.test.ts
│   ├── middleware.test.ts
│   ├── reseller/login.test.tsx
│   ├── reseller/register.test.tsx
│   └── reseller/dashboard.test.tsx
├── next.config.ts
├── netlify.toml
├── tsconfig.json
├── jest.config.ts
├── jest.setup.ts
├── package.json
└── .env.local.example
```

---

## Task 1: Project scaffold

**Files:**
- Create: `tsg-frontend/package.json`
- Create: `tsg-frontend/next.config.ts`
- Create: `tsg-frontend/tsconfig.json`
- Create: `tsg-frontend/jest.config.ts`
- Create: `tsg-frontend/jest.setup.ts`
- Create: `tsg-frontend/.env.local.example`
- Create: `tsg-frontend/netlify.toml`

- [ ] **Step 1: Create the project directory and package.json**

Run from the `TSG Website/` root:

```bash
mkdir tsg-frontend && cd tsg-frontend
```

Create `tsg-frontend/package.json`:

```json
{
  "name": "tsg-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.49.0",
    "@supabase/ssr": "^0.5.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd tsg-frontend && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Create next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'theswedishglow.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create jest.config.ts**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
}

export default createJestConfig(config)
```

- [ ] **Step 6: Create jest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Create .env.local.example**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Copy to `.env.local` and fill in your actual values:

```bash
cp .env.local.example .env.local
```

- [ ] **Step 8: Create netlify.toml**

```toml
[build]
  base    = "tsg-frontend"
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from   = "/shop.html"
  to     = "/shop"
  status = 301

[[redirects]]
  from   = "/nordsilk.html"
  to     = "/nordsilk"
  status = 301

[[redirects]]
  from   = "/freja.html"
  to     = "/freja"
  status = 301

[[redirects]]
  from   = "/hermade.html"
  to     = "/hermade"
  status = 301

[[redirects]]
  from   = "/marine-collageen-13000-kuur.html"
  to     = "/marine-collageen"
  status = 301

[[redirects]]
  from   = "/over-ons.html"
  to     = "/over-ons"
  status = 301

[[redirects]]
  from   = "/stories.html"
  to     = "/stories"
  status = 301

[[redirects]]
  from   = "/contact.html"
  to     = "/contact"
  status = 301

[[redirects]]
  from   = "/reseller-programma.html"
  to     = "/reseller-programma"
  status = 301

[[redirects]]
  from   = "/reseller-login.html"
  to     = "/reseller/login"
  status = 301

[[redirects]]
  from   = "/privacy.html"
  to     = "/privacy"
  status = 301

[[redirects]]
  from   = "/voorwaarden.html"
  to     = "/voorwaarden"
  status = 301

[[redirects]]
  from   = "/cookies.html"
  to     = "/cookies"
  status = 301
```

- [ ] **Step 9: Verify Next.js runs**

```bash
npx next dev
```

Expected: server starts on http://localhost:3000 (404 page is fine — no pages yet).

- [ ] **Step 10: Commit**

```bash
git add tsg-frontend/
git commit -m "feat: scaffold Next.js 15 frontend project"
```

---

## Task 2: Shared types + API client

**Files:**
- Create: `tsg-frontend/lib/types.ts`
- Create: `tsg-frontend/lib/supabase.ts`
- Create: `tsg-frontend/lib/api.ts`
- Create: `tsg-frontend/__tests__/lib/api.test.ts`

- [ ] **Step 1: Create lib/types.ts**

```typescript
export interface Reseller {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  phone: string | null
  country: string | null
  tier: 'pearl' | 'rose' | 'pro' | 'elite' | 'black'
  is_admin: boolean
  status: 'pending' | 'active' | 'inactive'
}

export interface ResellerStats {
  revenue_ytd_eur: number
  order_count: number
  discount_pct: number
  next_tier_gap_eur: number | null
  next_tier: string | null
}

export interface TierInfo {
  tier: string
  tier_label: string
  discount_pct: number
  min_revenue_eur: number
  benefits: string[]
  progress_pct: number
}

export interface TierThreshold {
  tier: string
  min_revenue_eur: number
  discount_pct: number
  benefits: string[]
}

export interface Product {
  id: string
  name: string
  tag: string | null
  description: string | null
  list_price_eur: number
  net_price_eur: number
  image_url: string | null
}

export interface Quotation {
  id: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  total_eur: number | null
  created_at: string
  line_items: { product_id: string; quantity: number; unit_price: number }[]
}

export interface Invoice {
  id: string
  tl_invoice_id: string
  invoice_number: string | null
  status: 'draft' | 'outstanding' | 'paid' | 'overdue'
  total_eur: number
  invoice_date: string | null
  due_date: string | null
}

export interface MarketingFile {
  id: string
  name: string
  file_size_bytes: number | null
  min_tier: 'all' | 'rose' | 'pro' | 'elite' | 'black'
  download_count: number
  created_at: string
  accessible: boolean
}

export interface Application {
  id: string
  first_name: string
  last_name: string
  company: string
  email: string
  phone: string | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  assigned_tier: string
  created_at: string
}

export interface AdminReseller extends Reseller {
  revenue_ytd_eur: number
  tier_override: boolean
}
```

- [ ] **Step 2: Create lib/supabase.ts**

```typescript
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use in Client Components ('use client')
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Use in Server Components and middleware
export async function createServerSideClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        )
      },
    },
  })
}
```

- [ ] **Step 3: Create lib/api.ts**

```typescript
'use client'
import { createClient } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/reseller/login'
    }
    throw new ApiError(401, 'Session expired')
  }

  return res
}

export async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options)
  if (!res.ok) throw new ApiError(res.status, `API error ${res.status}`)
  return res.json() as Promise<T>
}
```

- [ ] **Step 4: Write the failing tests**

Create `tsg-frontend/__tests__/lib/api.test.ts`:

```typescript
import { apiJson, ApiError } from '@/lib/api'

const mockGetSession = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      signOut: mockSignOut,
    },
  }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue({ data: { session: { access_token: 'test-token' } } })
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('adds Bearer token from session', async () => {
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: '1' }) })
  await apiJson('/auth/me')
  expect(mockFetch).toHaveBeenCalledWith(
    'http://localhost:8000/auth/me',
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    })
  )
})

it('makes request without auth header when no session', async () => {
  mockGetSession.mockResolvedValue({ data: { session: null } })
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
  await apiJson('/auth/register-application', { method: 'POST', body: '{}' })
  const call = mockFetch.mock.calls[0][1]
  expect(call.headers.Authorization).toBeUndefined()
})

it('throws ApiError on 401 and signs out', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) })
  delete (global as Record<string, unknown>).window
  await expect(apiJson('/auth/me')).rejects.toThrow(ApiError)
  expect(mockSignOut).toHaveBeenCalled()
})

it('throws ApiError on non-ok response', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
  await expect(apiJson('/products')).rejects.toThrow(ApiError)
})
```

- [ ] **Step 5: Run tests — expect FAIL**

```bash
cd tsg-frontend && npx jest __tests__/lib/api.test.ts --no-coverage
```

Expected: FAIL — module resolution errors (no `lib/` yet registered).

- [ ] **Step 6: Run tests after implementation — expect PASS**

```bash
npx jest __tests__/lib/api.test.ts --no-coverage
```

Expected: 4 tests pass.

- [ ] **Step 7: Commit**

```bash
git add tsg-frontend/lib/ tsg-frontend/__tests__/lib/
git commit -m "feat: add Supabase client, API fetch helper, and shared types"
```

---

## Task 3: Auth middleware

**Files:**
- Create: `tsg-frontend/middleware.ts`
- Create: `tsg-frontend/__tests__/middleware.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tsg-frontend/__tests__/middleware.test.ts`:

```typescript
import { middleware } from '../middleware'
import { NextRequest, NextResponse } from 'next/server'

const mockGetUser = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser, getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'tok' } } }) },
  }),
}))

function makeRequest(pathname: string) {
  return new NextRequest(new URL(`http://localhost${pathname}`))
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key'
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('allows unauthenticated access to /reseller/login', async () => {
  mockGetUser.mockResolvedValue({ data: { user: null } })
  const req = makeRequest('/reseller/login')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})

it('redirects unauthenticated user from /reseller/dashboard to /reseller/login', async () => {
  mockGetUser.mockResolvedValue({ data: { user: null } })
  const req = makeRequest('/reseller/dashboard')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/reseller/login')
})

it('redirects authenticated user from /reseller/login to /reseller/dashboard', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'abc' } } })
  const req = makeRequest('/reseller/login')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/reseller/dashboard')
})

it('allows authenticated user through /reseller/dashboard', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'abc' } } })
  const req = makeRequest('/reseller/dashboard')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/middleware.test.ts --no-coverage
```

Expected: FAIL — middleware module not found.

- [ ] **Step 3: Create middleware.ts**

```typescript
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/middleware.test.ts --no-coverage
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/middleware.ts tsg-frontend/__tests__/middleware.test.ts
git commit -m "feat: add auth middleware for /reseller/* routes"
```

---

## Task 4: Global CSS + root layout

**Files:**
- Create: `tsg-frontend/styles/globals.css`
- Create: `tsg-frontend/app/layout.tsx`

- [ ] **Step 1: Build globals.css**

Open `../assets/the-swedish-glow-website/index.html`. Find the `<style>` block. Copy its entire content into `tsg-frontend/styles/globals.css`.

Then open each remaining HTML file and append its `<style>` block content to `globals.css`:
`shop.html`, `nordsilk.html`, `freja.html`, `hermade.html`, `marine-collageen-13000-kuur.html`, `over-ons.html`, `stories.html`, `contact.html`, `reseller-programma.html`, `start-hier.html`, `supplementen.html`, `nieuwsbrief.html`, `levering.html`, `privacy.html`, `voorwaarden.html`, `cookies.html`, `winkelwagen.html`, `mijn-account.html`.

Then append the portal styles from `../assets/reseller-portaal-netlify-v2/reseller-portaal-deploy-v2/index.html` (its `<style>` block).

The CSS variables block at the top of the file should be deduplicated — keep one `:root { }` block with all variables from all files merged. CSS class names across pages do not conflict (each page uses its own naming conventions).

- [ ] **Step 2: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'The Swedish Glow', template: '%s | The Swedish Glow' },
  description: 'Premium Nordic beauty supplementen voor huid, haar en welzijn.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter+Tight:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build compiles**

```bash
npx next build 2>&1 | tail -20
```

Expected: no TypeScript errors. (Build may warn about missing pages — that's fine.)

- [ ] **Step 4: Commit**

```bash
git add tsg-frontend/styles/ tsg-frontend/app/layout.tsx
git commit -m "feat: add global CSS and root layout"
```

---

## Task 5: Nav, Footer, and marketing layout

**Files:**
- Create: `tsg-frontend/components/Nav.tsx`
- Create: `tsg-frontend/components/Footer.tsx`
- Create: `tsg-frontend/components/MobileMenu.tsx`
- Create: `tsg-frontend/app/(marketing)/layout.tsx`

- [ ] **Step 1: Extract Nav from index.html**

Open `../assets/the-swedish-glow-website/index.html`. Find the `<header>` or `<nav>` element (look for the TSG logo + nav links). Copy the full HTML block.

Create `tsg-frontend/components/Nav.tsx`. Apply JSX transformations:
- `class=` → `className=`
- `onclick="..."` → extract into `const handleX = () => { ... }` functions using `useState`
- `<img>` → keep as `<img>` (not Next.js `<Image>` — no optimization needed for the logo)
- Self-close void elements: `<br>` → `<br />`, `<input>` → `<input />`
- `for=` → `htmlFor=`
- Inline event handlers that toggle mobile menu → `useState<boolean>` for open/close

Example structure:

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header>
      {/* paste converted nav HTML here */}
      {/* replace href="page.html" with href="/page" */}
      {/* replace href="index.html" with href="/" */}
    </header>
  )
}
```

Replace all `.html` hrefs with clean routes:
- `index.html` → `/`
- `shop.html` → `/shop`
- `nordsilk.html` → `/nordsilk`
- `freja.html` → `/freja`
- `hermade.html` → `/hermade`
- `marine-collageen-13000-kuur.html` → `/marine-collageen`
- `over-ons.html` → `/over-ons`
- `stories.html` → `/stories`
- `contact.html` → `/contact`
- `reseller-programma.html` → `/reseller-programma`
- `reseller-login.html` → `/reseller/login`
- `winkelwagen.html` → `/winkelwagen`
- `mijn-account.html` → `/mijn-account`

- [ ] **Step 2: Extract Footer from index.html**

Find the `<footer>` element in `index.html`. Copy and convert to JSX. Apply the same href → route replacements as above.

Create `tsg-frontend/components/Footer.tsx`:

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      {/* paste converted footer HTML here */}
    </footer>
  )
}
```

- [ ] **Step 3: Create marketing layout**

```tsx
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Create homepage page.tsx to test the layout**

Create `tsg-frontend/app/(marketing)/page.tsx` temporarily:

```tsx
export default function HomePage() {
  return <main><p>Test</p></main>
}
```

- [ ] **Step 5: Start dev server and verify nav + footer render**

```bash
npx next dev
```

Open http://localhost:3000 — verify the nav and footer appear with correct styles. Check mobile menu toggle works. Check all nav links have correct `/` prefixed paths (not `.html`).

- [ ] **Step 6: Commit**

```bash
git add tsg-frontend/components/ tsg-frontend/app/'(marketing)'/layout.tsx tsg-frontend/app/'(marketing)'/page.tsx
git commit -m "feat: add Nav, Footer, and marketing layout"
```

---

## Task 6: Homepage

**Files:**
- Modify: `tsg-frontend/app/(marketing)/page.tsx`

- [ ] **Step 1: Convert index.html body to JSX**

Open `../assets/the-swedish-glow-website/index.html`. Extract everything between the closing `</nav>` (or `</header>`) and the opening `<footer>` — this is the main page content.

Replace the placeholder `page.tsx` content with the converted JSX:

```tsx
export const metadata = {
  title: 'Vloeibare Marine Collageen & Omega 3 Supplementen',
  description: 'Premium beauty rituelen uit Zweden. Marine Collageen 13.000, Omega 3, Nordsilk en HÉRMADE.',
}

export default function HomePage() {
  return (
    <main>
      {/* converted body content from index.html — nav and footer excluded */}
      {/* apply: class= → className=, inline style strings → style objects */}
      {/* replace .html hrefs with /route paths */}
      {/* remove <script> blocks — no JS needed for static content */}
    </main>
  )
}
```

The metadata export replaces the `<title>` and `<meta name="description">` tags from the HTML `<head>`. Remove those from the JSX — Next.js handles them via the `metadata` export.

- [ ] **Step 2: Verify in browser**

```bash
npx next dev
```

Open http://localhost:3000 — confirm the homepage looks identical to opening `assets/the-swedish-glow-website/index.html` in a browser. Check:
- Fonts load (Cormorant Garamond + Inter Tight)
- Images render (product photos from WooCommerce CDN URLs)
- All internal links use `/route` not `.html`

- [ ] **Step 3: Commit**

```bash
git add tsg-frontend/app/'(marketing)'/page.tsx
git commit -m "feat: convert homepage to Next.js page"
```

---

## Task 7: Product pages

**Files:**
- Create: `tsg-frontend/app/(marketing)/nordsilk/page.tsx`
- Create: `tsg-frontend/app/(marketing)/freja/page.tsx`
- Create: `tsg-frontend/app/(marketing)/hermade/page.tsx`
- Create: `tsg-frontend/app/(marketing)/marine-collageen/page.tsx`

Repeat the conversion pattern from Task 6 for each product page:

1. Open the source HTML file
2. Extract body content (between nav and footer)
3. Convert HTML → JSX (class→className, etc.)
4. Add metadata export with the page's title + description from its `<head>`
5. Wrap in `export default function [Name]Page() { return <main>...</main> }`

- [ ] **Step 1: Convert nordsilk.html → nordsilk/page.tsx**

Source: `../assets/the-swedish-glow-website/nordsilk.html`

```tsx
export const metadata = {
  title: 'Nordsilk',
  description: 'Voedend ritueel voor sterk en glanzend haar, met biotine en zink.',
}

export default function NordsilkPage() {
  return (
    <main>
      {/* body content from nordsilk.html, nav and footer excluded */}
    </main>
  )
}
```

- [ ] **Step 2: Convert freja.html → freja/page.tsx**

Source: `../assets/the-swedish-glow-website/freja.html`

```tsx
export const metadata = {
  title: 'FREJA',
  description: 'Plantaardige Omega 3 essence met vitamines A, D3, E en K2.',
}

export default function FrejaPage() {
  return (
    <main>
      {/* body content from freja.html */}
    </main>
  )
}
```

- [ ] **Step 3: Convert hermade.html → hermade/page.tsx**

Source: `../assets/the-swedish-glow-website/hermade.html`

```tsx
export const metadata = {
  title: 'HÉRMADE',
  description: 'Gerichte ondersteuning voor vrouwen in elke fase van het leven.',
}

export default function HermadePage() {
  return (
    <main>
      {/* body content from hermade.html */}
    </main>
  )
}
```

- [ ] **Step 4: Convert marine-collageen-13000-kuur.html → marine-collageen/page.tsx**

Source: `../assets/the-swedish-glow-website/marine-collageen-13000-kuur.html`

```tsx
export const metadata = {
  title: 'Marine Collageen 13.000',
  description: '13.000 mg vloeibaar marine collageen voor stralende huid, sterke nagels en gezond haar.',
}

export default function MarineCollageenPage() {
  return (
    <main>
      {/* body content from marine-collageen-13000-kuur.html */}
    </main>
  )
}
```

- [ ] **Step 5: Open each page in browser and verify**

```bash
npx next dev
```

Check: http://localhost:3000/nordsilk, /freja, /hermade, /marine-collageen — each should look identical to its HTML file.

- [ ] **Step 6: Commit**

```bash
git add tsg-frontend/app/'(marketing)'/nordsilk tsg-frontend/app/'(marketing)'/freja tsg-frontend/app/'(marketing)'/hermade tsg-frontend/app/'(marketing)'/marine-collageen
git commit -m "feat: convert product pages (nordsilk, freja, hermade, marine-collageen)"
```

---

## Task 8: Remaining marketing pages

**Files:**
- Create: `tsg-frontend/app/(marketing)/shop/page.tsx`
- Create: `tsg-frontend/app/(marketing)/over-ons/page.tsx`
- Create: `tsg-frontend/app/(marketing)/stories/page.tsx`
- Create: `tsg-frontend/app/(marketing)/contact/page.tsx`
- Create: `tsg-frontend/app/(marketing)/reseller-programma/page.tsx`
- Create: `tsg-frontend/app/(marketing)/start-hier/page.tsx`
- Create: `tsg-frontend/app/(marketing)/supplementen/page.tsx`
- Create: `tsg-frontend/app/(marketing)/nieuwsbrief/page.tsx`
- Create: `tsg-frontend/app/(marketing)/levering/page.tsx`
- Create: `tsg-frontend/app/(marketing)/privacy/page.tsx`
- Create: `tsg-frontend/app/(marketing)/voorwaarden/page.tsx`
- Create: `tsg-frontend/app/(marketing)/cookies/page.tsx`
- Create: `tsg-frontend/app/(marketing)/winkelwagen/page.tsx`
- Create: `tsg-frontend/app/(marketing)/mijn-account/page.tsx`

Apply the same conversion pattern as Tasks 6–7 for each page. Additionally:

- [ ] **Step 1: Convert content pages**

Convert `shop.html`, `over-ons.html`, `stories.html`, `contact.html` following the exact same pattern as Task 6.

For `reseller-programma.html`: find the CTA button that currently links to `reseller-login.html` and change it to `/reseller/register`.

- [ ] **Step 2: Convert utility pages**

Convert `start-hier.html`, `supplementen.html`, `nieuwsbrief.html`, `levering.html`, `privacy.html`, `voorwaarden.html`, `cookies.html`.

- [ ] **Step 3: Create redirect pages for WooCommerce**

`winkelwagen/page.tsx` — redirect to WooCommerce cart:

```tsx
import { redirect } from 'next/navigation'

export default function WinkelwagenPage() {
  redirect('https://theswedishglow.com/winkelwagen/')
}
```

`mijn-account/page.tsx` — redirect to WooCommerce account:

```tsx
import { redirect } from 'next/navigation'

export default function MijnAccountPage() {
  redirect('https://theswedishglow.com/mijn-account/')
}
```

- [ ] **Step 4: Verify all routes**

```bash
npx next build 2>&1 | grep -E "error|Error"
```

Expected: no build errors.

Open each route in browser and verify visual match to source HTML.

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/app/'(marketing)'/
git commit -m "feat: convert all remaining marketing pages"
```

---

## Task 9: Portal shared components

**Files:**
- Create: `tsg-frontend/components/reseller/Sidebar.tsx`
- Create: `tsg-frontend/components/reseller/TierBadge.tsx`
- Create: `tsg-frontend/components/reseller/ProgressBar.tsx`
- Create: `tsg-frontend/app/reseller/(portal)/layout.tsx`

Open `../assets/reseller-portaal-netlify-v2/reseller-portaal-deploy-v2/index.html`. Find the `.shell` / `.sidebar` element (the left navigation panel inside the portal).

- [ ] **Step 1: Create TierBadge.tsx**

```tsx
type Tier = 'pearl' | 'rose' | 'pro' | 'elite' | 'black'

const TIER_COLOURS: Record<Tier, string> = {
  pearl: '#c8c2b6',
  rose:  '#a06b7a',
  pro:   '#4a6b52',
  elite: '#b8924a',
  black: '#1c1c1a',
}

export default function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className="tier-pill"
      style={{ background: TIER_COLOURS[tier] ?? '#c8c2b6', color: '#f6f1e8' }}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}
```

- [ ] **Step 2: Create ProgressBar.tsx**

```tsx
export default function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  )
}
```

- [ ] **Step 3: Create Sidebar.tsx**

Extract the `.sidebar` HTML from the portal `index.html`. This is the left nav panel with links to Dashboard, Products, Quotations, Invoices, Files, Profile, and optionally Admin (shown only for `is_admin`).

```tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { Reseller } from '@/lib/types'
import TierBadge from './TierBadge'
import { createClient } from '@/lib/supabase'

export default function Sidebar({ reseller }: { reseller: Reseller }) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/reseller/dashboard',   label: 'Dashboard' },
    { href: '/reseller/products',    label: 'Producten' },
    { href: '/reseller/quotations',  label: 'Offertes' },
    { href: '/reseller/invoices',    label: 'Facturen' },
    { href: '/reseller/files',       label: 'Bestanden' },
    { href: '/reseller/profile',     label: 'Profiel' },
    ...(reseller.is_admin ? [{ href: '/reseller/admin', label: 'Admin' }] : []),
  ]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/reseller/login')
  }

  return (
    <aside className="sidebar">
      {/* paste sidebar HTML content from index.html, converted to JSX */}
      {/* replace hardcoded name/tier with reseller.first_name, reseller.tier */}
      <div className="sidebar-user">
        <div className="sidebar-name">{reseller.first_name} {reseller.last_name}</div>
        <TierBadge tier={reseller.tier} />
      </div>
      <nav className="sidebar-nav">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link${pathname.startsWith(href) ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <button className="sidebar-signout" onClick={handleSignOut}>
        Uitloggen
      </button>
    </aside>
  )
}
```

- [ ] **Step 4: Create portal layout**

```tsx
import { redirect } from 'next/navigation'
import { createServerSideClient } from '@/lib/supabase'
import { apiJson } from '@/lib/api'  // Note: use server-side fetch here
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

  const reseller = await getReseller(session.access_token)

  return (
    <div className="shell">
      <Sidebar reseller={reseller} />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/components/reseller/ tsg-frontend/app/reseller/
git commit -m "feat: add portal sidebar, tier badge, progress bar, and portal layout"
```

---

## Task 10: Login page

**Files:**
- Create: `tsg-frontend/app/reseller/(auth)/login/page.tsx`
- Create: `tsg-frontend/__tests__/reseller/login.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tsg-frontend/__tests__/reseller/login.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/reseller/(auth)/login/page'

const mockSignIn = jest.fn()
const mockPush = jest.fn()

jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: { signInWithPassword: mockSignIn },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}))

beforeEach(() => jest.clearAllMocks())

it('renders email and password inputs', () => {
  render(<LoginPage />)
  expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/wachtwoord/i)).toBeInTheDocument()
})

it('redirects to dashboard on successful login', async () => {
  mockSignIn.mockResolvedValue({ error: null })
  render(<LoginPage />)
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'test@example.com')
  await userEvent.type(screen.getByPlaceholderText(/wachtwoord/i), 'password')
  fireEvent.click(screen.getByRole('button', { name: /inloggen/i }))
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/reseller/dashboard'))
})

it('shows error on failed login', async () => {
  mockSignIn.mockResolvedValue({ error: { message: 'Invalid login' } })
  render(<LoginPage />)
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'bad@example.com')
  await userEvent.type(screen.getByPlaceholderText(/wachtwoord/i), 'wrong')
  fireEvent.click(screen.getByRole('button', { name: /inloggen/i }))
  await waitFor(() => expect(screen.getByText(/ongeldig/i)).toBeVisible())
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/reseller/login.test.tsx --no-coverage
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create login page**

Open the portal `index.html`. Find the `#screen-login` div (the login form). Extract and convert it:

```tsx
'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(true)
      setLoading(false)
      return
    }

    const next = searchParams.get('next') ?? '/reseller/dashboard'
    router.push(next)
  }

  return (
    <div className="login-overlay">
      {/* paste login screen HTML from index.html — the #screen-login section */}
      {/* convert: class= → className=, onclick="doLogin()" → onSubmit={handleSubmit} */}
      {/* wire inputs: value={email} onChange={e => setEmail(e.target.value)} */}
      {/* show error div when error===true: className={`login-err${error ? ' show' : ''}`} */}
      {/* show loading state on button: disabled={loading} */}
      {/* link to register: href="/reseller/register" */}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/reseller/login.test.tsx --no-coverage
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/app/reseller/'(auth)'/login/ tsg-frontend/__tests__/reseller/login.test.tsx
git commit -m "feat: add reseller login page with Supabase auth"
```

---

## Task 11: Register page

**Files:**
- Create: `tsg-frontend/app/reseller/(auth)/register/page.tsx`
- Create: `tsg-frontend/__tests__/reseller/register.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tsg-frontend/__tests__/reseller/register.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/reseller/(auth)/register/page'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('renders the registration form fields', () => {
  render(<RegisterPage />)
  expect(screen.getByPlaceholderText(/voornaam/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/achternaam/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/bedrijf/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
})

it('shows success message after submission', async () => {
  mockFetch.mockResolvedValue({ ok: true })
  render(<RegisterPage />)
  await userEvent.type(screen.getByPlaceholderText(/voornaam/i), 'Jan')
  await userEvent.type(screen.getByPlaceholderText(/achternaam/i), 'Smit')
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'jan@voorbeeld.nl')
  fireEvent.click(screen.getByRole('button', { name: /aanvragen/i }))
  await waitFor(() => expect(screen.getByText(/aanvraag ontvangen/i)).toBeInTheDocument())
})

it('calls POST /auth/register-application with form data', async () => {
  mockFetch.mockResolvedValue({ ok: true })
  render(<RegisterPage />)
  await userEvent.type(screen.getByPlaceholderText(/voornaam/i), 'Jan')
  await userEvent.type(screen.getByPlaceholderText(/achternaam/i), 'Smit')
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'jan@voorbeeld.nl')
  fireEvent.click(screen.getByRole('button', { name: /aanvragen/i }))
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/register-application',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/reseller/register.test.tsx --no-coverage
```

- [ ] **Step 3: Create register page**

Extract the `#screen-register` div from the portal `index.html`:

```tsx
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
        {/* success state HTML from register-success div in index.html */}
        <p>Aanvraag ontvangen — je hoort zo snel mogelijk van ons.</p>
        <Link href="/reseller/login">Terug naar inloggen</Link>
      </div>
    )
  }

  return (
    <div className="login-overlay">
      {/* paste #screen-register HTML, converted to JSX */}
      {/* wire all inputs with value={form.field} onChange={update('field')} */}
      {/* form onSubmit={handleSubmit}, button disabled={loading} */}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/reseller/register.test.tsx --no-coverage
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/app/reseller/'(auth)'/register/ tsg-frontend/__tests__/reseller/register.test.tsx
git commit -m "feat: add partner application register page"
```

---

## Task 12: Dashboard page

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/dashboard/page.tsx`
- Create: `tsg-frontend/__tests__/reseller/dashboard.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tsg-frontend/__tests__/reseller/dashboard.test.tsx`:

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/reseller/(portal)/dashboard/page'
import type { ResellerStats, TierInfo } from '@/lib/types'

const mockApiJson = jest.fn()
jest.mock('@/lib/api', () => ({ apiJson: mockApiJson }))

const mockStats: ResellerStats = {
  revenue_ytd_eur: 4500,
  order_count: 12,
  discount_pct: 40,
  next_tier_gap_eur: 500,
  next_tier: 'Rose',
}

const mockTier: TierInfo = {
  tier: 'pearl',
  tier_label: 'Pearl',
  discount_pct: 40,
  min_revenue_eur: 0,
  benefits: ['Inkoopkorting 40%'],
  progress_pct: 90,
}

beforeEach(() => {
  jest.clearAllMocks()
  mockApiJson.mockImplementation((path: string) => {
    if (path === '/resellers/me/stats') return Promise.resolve(mockStats)
    if (path === '/resellers/me/tier') return Promise.resolve(mockTier)
  })
})

it('renders revenue YTD from API', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getByText(/€4\.500/)).toBeInTheDocument())
})

it('renders discount percentage', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getByText(/40%/)).toBeInTheDocument())
})

it('renders progress toward next tier', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getByText(/Rose/)).toBeInTheDocument())
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npx jest __tests__/reseller/dashboard.test.tsx --no-coverage
```

- [ ] **Step 3: Create dashboard page**

Find the dashboard panel in the portal `index.html` (the `#panel-dashboard` div or equivalent). Extract the HTML and convert:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { ResellerStats, TierInfo } from '@/lib/types'
import TierBadge from '@/components/reseller/TierBadge'
import ProgressBar from '@/components/reseller/ProgressBar'

export default function DashboardPage() {
  const [stats, setStats] = useState<ResellerStats | null>(null)
  const [tier, setTier] = useState<TierInfo | null>(null)

  useEffect(() => {
    apiJson<ResellerStats>('/resellers/me/stats').then(setStats)
    apiJson<TierInfo>('/resellers/me/tier').then(setTier)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-dashboard">
      {/* paste dashboard panel HTML, converted to JSX */}
      {/* replace hardcoded revenue/discount/tier values with: */}
      {/*   stats?.revenue_ytd_eur → fmt(stats.revenue_ytd_eur)  */}
      {/*   stats?.discount_pct → `${stats.discount_pct}%`        */}
      {/*   stats?.order_count                                     */}
      {/*   stats?.next_tier_gap_eur → fmt(stats.next_tier_gap_eur) */}
      {/*   tier?.tier → <TierBadge tier={tier.tier} />           */}
      {/*   tier?.progress_pct → <ProgressBar pct={tier.progress_pct} /> */}
      {/* Show loading skeleton when stats === null */}
      {!stats && <div className="loading">Laden...</div>}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx jest __tests__/reseller/dashboard.test.tsx --no-coverage
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/dashboard/ tsg-frontend/__tests__/reseller/dashboard.test.tsx
git commit -m "feat: add dashboard page with live stats from API"
```

---

## Task 13: Products page

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/products/page.tsx`

Find the products panel in the portal `index.html`. The existing JS renders products from the hardcoded `PRODUCTS` array. Replace with API fetch.

- [ ] **Step 1: Create products page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Product } from '@/lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    apiJson<Product[]>('/products').then(setProducts)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-products">
      {/* paste product catalog panel HTML converted to JSX */}
      {/* replace PRODUCTS.map(...) with products.map(p => ( */}
      {/*   <div key={p.id} className="product-card">           */}
      {/*     <img src={p.image_url ?? ''} alt={p.name} />      */}
      {/*     <div className="product-name">{p.name}</div>       */}
      {/*     <div className="product-tag">{p.tag}</div>         */}
      {/*     <div className="list-price">{fmt(p.list_price_eur)}</div> */}
      {/*     <div className="net-price">{fmt(p.net_price_eur)}</div>   */}
      {/*   </div>                                               */}
      {/* )) */}
      {products.length === 0 && <div className="loading">Laden...</div>}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Log in as a test reseller and check http://localhost:3000/reseller/products. Products should load from the API with real discounted prices.

- [ ] **Step 3: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/products/
git commit -m "feat: add products page with live catalog from API"
```

---

## Task 14: Quotations page

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/quotations/page.tsx`

- [ ] **Step 1: Create quotations page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Quotation, Product } from '@/lib/types'

interface LineItem { product_id: string; quantity: number }

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<LineItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    apiJson<Quotation[]>('/resellers/me/quotations').then(setQuotations)
    apiJson<Product[]>('/products').then(setProducts)
  }, [])

  function addToCart(productId: string) {
    setCart(prev => {
      const existing = prev.find(l => l.product_id === productId)
      if (existing) {
        return prev.map(l => l.product_id === productId ? { ...l, quantity: l.quantity + 1 } : l)
      }
      return [...prev, { product_id: productId, quantity: 1 }]
    })
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(l => l.product_id !== productId))
  }

  async function submitQuotation() {
    if (cart.length === 0) return
    setSubmitting(true)
    await apiJson('/orders/quotation', {
      method: 'POST',
      body: JSON.stringify({ line_items: cart }),
    })
    const updated = await apiJson<Quotation[]>('/resellers/me/quotations')
    setQuotations(updated)
    setCart([])
    setSuccess(true)
    setSubmitting(false)
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-quotations">
      {/* paste quotations panel HTML converted to JSX */}
      {/* product list with addToCart(p.id) buttons */}
      {/* cart summary showing cart items, removeFromCart button */}
      {/* submit button: onClick={submitQuotation} disabled={submitting || cart.length === 0} */}
      {/* quotations history table: quotations.map(q => ...) */}
      {/* status badges, formatted dates, fmt(q.total_eur) */}
      {success && <div className="toast show">Offerte aangemaakt</div>}
    </div>
  )
}
```

- [ ] **Step 2: Test manually**

Log in, go to /reseller/quotations, add products to cart, submit. Verify the quotation appears in history and in the backend (`GET /resellers/me/quotations`).

- [ ] **Step 3: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/quotations/
git commit -m "feat: add quotations page with cart and TL submission"
```

---

## Task 15: Invoices and Files pages

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/invoices/page.tsx`
- Create: `tsg-frontend/app/reseller/(portal)/files/page.tsx`

- [ ] **Step 1: Create invoices page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { Invoice } from '@/lib/types'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    apiJson<Invoice[]>('/resellers/me/invoices').then(setInvoices)
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  const fmtDate = (d: string | null) =>
    d ? new Intl.DateTimeFormat('nl-NL').format(new Date(d)) : '—'

  const STATUS_LABELS: Record<Invoice['status'], string> = {
    draft: 'Concept', outstanding: 'Openstaand', paid: 'Betaald', overdue: 'Achterstallig',
  }

  return (
    <div className="panel" id="panel-invoices">
      {/* paste invoice panel HTML converted to JSX */}
      {/* invoices.map(inv => <tr key={inv.id}> */}
      {/*   <td>{inv.invoice_number ?? '—'}</td> */}
      {/*   <td>{fmtDate(inv.invoice_date)}</td>  */}
      {/*   <td>{fmt(inv.total_eur)}</td>          */}
      {/*   <td>{STATUS_LABELS[inv.status]}</td>   */}
      {/* </tr>) */}
      {invoices.length === 0 && <div className="empty-row">Geen facturen gevonden</div>}
    </div>
  )
}
```

- [ ] **Step 2: Create files page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { MarketingFile } from '@/lib/types'

export default function FilesPage() {
  const [files, setFiles] = useState<MarketingFile[]>([])

  useEffect(() => {
    apiJson<MarketingFile[]>('/files').then(setFiles)
  }, [])

  async function download(fileId: string, name: string) {
    const res = await apiFetch(`/files/${fileId}/download`)
    const { url } = await res.json()
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
  }

  const fmtBytes = (n: number | null) =>
    n ? `${(n / 1024 / 1024).toFixed(1)} MB` : '—'

  return (
    <div className="panel" id="panel-files">
      {/* paste files panel HTML converted to JSX */}
      {/* files.map(f => ...) */}
      {/* accessible files: download button → onClick={() => download(f.id, f.name)} */}
      {/* locked files (f.accessible === false): show tier lock icon */}
      {/* fmtBytes(f.file_size_bytes) for size display */}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/invoices/ tsg-frontend/app/reseller/'(portal)'/files/
git commit -m "feat: add invoices and files pages"
```

---

## Task 16: Profile page

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/profile/page.tsx`

- [ ] **Step 1: Create profile page**

```tsx
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
      {/* paste profile panel HTML converted to JSX */}
      {/* form onSubmit={handleSave} */}
      {/* inputs wired to state: firstName, lastName, phone */}
      {/* static display: reseller.email, reseller.company, reseller.tier */}
      {saved && <div className="toast show">Profiel opgeslagen</div>}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/profile/
git commit -m "feat: add profile page with editable fields"
```

---

## Task 17: Admin pages

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/admin/page.tsx`
- Create: `tsg-frontend/app/reseller/(portal)/admin/applications/page.tsx`
- Create: `tsg-frontend/app/reseller/(portal)/admin/partners/page.tsx`
- Create: `tsg-frontend/app/reseller/(portal)/admin/files/page.tsx`

- [ ] **Step 1: Create admin overview page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { AdminReseller, Application } from '@/lib/types'
import Link from 'next/link'

export default function AdminPage() {
  const [resellers, setResellers] = useState<AdminReseller[]>([])

  useEffect(() => {
    apiJson<AdminReseller[]>('/admin/resellers').then(setResellers)
  }, [])

  return (
    <div className="panel" id="panel-admin">
      {/* paste admin overview panel from index.html converted to JSX */}
      {/* summary stats: resellers.length, count by tier, count by status */}
      {/* quick links to sub-pages via Link components */}
    </div>
  )
}
```

- [ ] **Step 2: Create applications page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { Application } from '@/lib/types'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    apiJson<Application[]>('/admin/applications').then(setApplications)
  }, [])

  async function approve(id: string, tier: string) {
    await apiFetch(`/admin/applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ assigned_tier: tier }),
    })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a))
  }

  async function reject(id: string) {
    await apiFetch(`/admin/applications/${id}/reject`, { method: 'POST' })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a))
  }

  return (
    <div className="panel" id="panel-applications">
      {/* paste applications panel HTML converted to JSX */}
      {/* applications.map(app => ...) */}
      {/* approve button: onClick={() => approve(app.id, 'pearl')} */}
      {/* reject button: onClick={() => reject(app.id)} */}
    </div>
  )
}
```

- [ ] **Step 3: Create partners page**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { AdminReseller } from '@/lib/types'
import TierBadge from '@/components/reseller/TierBadge'

type Tier = 'pearl' | 'rose' | 'pro' | 'elite' | 'black'

export default function PartnersPage() {
  const [partners, setPartners] = useState<AdminReseller[]>([])

  useEffect(() => {
    apiJson<AdminReseller[]>('/admin/resellers').then(setPartners)
  }, [])

  async function setTier(id: string, tier: Tier) {
    await apiFetch(`/admin/resellers/${id}/tier`, {
      method: 'PUT',
      body: JSON.stringify({ tier, tier_override: true }),
    })
    setPartners(prev => prev.map(p => p.id === id ? { ...p, tier } : p))
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel" id="panel-partners">
      {/* paste partners table HTML converted to JSX */}
      {/* partners.map(p => <tr key={p.id}> */}
      {/*   <td>{p.first_name} {p.last_name}</td> */}
      {/*   <td>{p.company}</td> */}
      {/*   <td><TierBadge tier={p.tier} /></td> */}
      {/*   <td>{fmt(p.revenue_ytd_eur)}</td> */}
      {/*   <td><select onChange={e => setTier(p.id, e.target.value as Tier)}> */}
      {/*     {['pearl','rose','pro','elite','black'].map(t => <option key={t}>{t}</option>)} */}
      {/*   </select></td> */}
      {/* </tr>) */}
    </div>
  )
}
```

- [ ] **Step 4: Create admin files page**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { MarketingFile } from '@/lib/types'

export default function AdminFilesPage() {
  const [files, setFiles] = useState<MarketingFile[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    apiJson<MarketingFile[]>('/files').then(setFiles)
  }, [])

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    const body = new FormData()
    body.append('file', file)
    body.append('min_tier', (e.currentTarget.elements.namedItem('min_tier') as HTMLSelectElement).value)
    await apiFetch('/files', { method: 'POST', body, headers: {} }) // no Content-Type — let browser set multipart boundary
    const updated = await apiJson<MarketingFile[]>('/files')
    setFiles(updated)
    setUploading(false)
    e.currentTarget.reset()
  }

  async function deleteFile(id: string) {
    await apiFetch(`/files/${id}`, { method: 'DELETE' })
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="panel" id="panel-admin-files">
      {/* paste admin files panel HTML converted to JSX */}
      {/* upload form: onSubmit={upload}, file input ref={fileRef} */}
      {/* files table with delete button: onClick={() => deleteFile(f.id)} */}
      {uploading && <div className="loading">Uploaden...</div>}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add tsg-frontend/app/reseller/'(portal)'/admin/
git commit -m "feat: add admin pages (overview, applications, partners, files)"
```

---

## Task 18: First Netlify deploy

**Files:**
- Create: `tsg-frontend/public/_redirects`

- [ ] **Step 1: Create _redirects for legacy .html URLs**

```
/shop.html                      /shop                       301
/nordsilk.html                  /nordsilk                   301
/freja.html                     /freja                      301
/hermade.html                   /hermade                    301
/marine-collageen-13000-kuur.html /marine-collageen         301
/over-ons.html                  /over-ons                   301
/stories.html                   /stories                    301
/contact.html                   /contact                    301
/reseller-programma.html        /reseller-programma         301
/reseller-login.html            /reseller/login             301
/privacy.html                   /privacy                    301
/voorwaarden.html               /voorwaarden                301
/cookies.html                   /cookies                    301
/start-hier.html                /start-hier                 301
/levering.html                  /levering                   301
/supplementen.html              /supplementen               301
/nieuwsbrief.html               /nieuwsbrief                301
/winkelwagen.html               /winkelwagen                301
/mijn-account.html              /mijn-account               301
```

- [ ] **Step 2: Full test run**

```bash
cd tsg-frontend && npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 3: Production build**

```bash
npx next build
```

Expected: build completes with no errors. Note any warnings.

- [ ] **Step 4: Connect to Netlify**

1. Push branch to GitHub
2. Go to https://app.netlify.com → New site from Git
3. Select the `TSG Website` repo
4. Set build settings:
   - Base directory: `tsg-frontend`
   - Build command: `next build`
   - Publish directory: `tsg-frontend/.next`
5. Install the Netlify Next.js plugin: add `@netlify/plugin-nextjs` to `netlify.toml` (already done in Task 1)
6. Set environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (Azure Container App URL once deployed)

- [ ] **Step 5: Trigger deploy and verify**

Push to main branch. Netlify builds automatically. Check the deploy log for errors.

Once deployed, verify:
- https://your-site.netlify.app/ — homepage renders
- https://your-site.netlify.app/nordsilk — product page renders
- https://your-site.netlify.app/reseller/login — login page renders
- https://your-site.netlify.app/reseller/dashboard — redirects to login (not authenticated)

- [ ] **Step 6: Final commit**

```bash
git add tsg-frontend/public/_redirects
git commit -m "feat: add legacy URL redirects and Netlify deploy config"
git push origin main
```

---

## Run all tests

```bash
cd tsg-frontend && npx jest --no-coverage
```

Expected output:
```
PASS __tests__/lib/api.test.ts
PASS __tests__/middleware.test.ts
PASS __tests__/reseller/login.test.tsx
PASS __tests__/reseller/register.test.tsx
PASS __tests__/reseller/dashboard.test.tsx

Test Suites: 5 passed, 5 total
Tests:       17 passed, 17 total
```
