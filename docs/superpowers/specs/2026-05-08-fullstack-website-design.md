# TSG Full-Stack Website Design

**Date:** 2026-05-08  
**Status:** Approved  
**Scope:** Next.js frontend combining marketing site + reseller portal, wired to the existing FastAPI backend

---

## Overview

Convert the existing static HTML pages and prototype reseller portal into a single production-grade Next.js 14 application hosted on Netlify. The app talks to the existing FastAPI backend on Azure for all dynamic data, and to Supabase for authentication.

The visual design stays identical — all existing CSS variables and class names are preserved as-is in `globals.css`. The HTML-to-JSX conversion is mechanical. The meaningful work is replacing hardcoded portal data with real API calls and replacing the client-side password check with Supabase auth.

---

## Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| B2C checkout | Keep WooCommerce | Phase 1 scope; Phase 2 = Mollie |
| Hosting | Single Netlify site, path-based | Shared nav/footer, cleaner URLs |
| Tech stack | Next.js 14 App Router + existing CSS | No visual redesign; shared components |
| Migration scope | Whole site — marketing + portal | One codebase, one deploy |
| CSS approach | Keep existing CSS variables unchanged | Already well-structured; Tailwind rewrite not worth the cost |

---

## Architecture

```
Browser
  └── Netlify — theswedishglow.com
        Next.js 14 App Router
        ├── (marketing) route group  →  static Server Components
        └── reseller/ route group    →  dynamic, auth-gated
              ├── Supabase Auth (@supabase/ssr — cookie-based sessions)
              └── FastAPI Backend (Azure Container Apps)
                    fetch() with Bearer JWT from Supabase session
```

### Key principle

Marketing pages are pure Server Components — rendered to static HTML at build time. No client JS is shipped unless a specific page needs it. The reseller portal is fully dynamic (Client Components where interactivity is needed).

---

## Project Structure

```
TSG Website/
├── tsg-backend/          ← existing FastAPI backend (unchanged)
└── tsg-frontend/         ← new Next.js app
    ├── app/
    │   ├── (marketing)/
    │   │   ├── layout.tsx          shared marketing layout (Nav + Footer)
    │   │   ├── page.tsx            → /
    │   │   ├── shop/page.tsx       → /shop
    │   │   ├── nordsilk/page.tsx   → /nordsilk
    │   │   ├── freja/page.tsx      → /freja
    │   │   ├── hermade/page.tsx    → /hermade
    │   │   ├── marine-collageen/page.tsx → /marine-collageen
    │   │   ├── over-ons/page.tsx   → /over-ons
    │   │   ├── stories/page.tsx    → /stories
    │   │   ├── contact/page.tsx    → /contact
    │   │   ├── reseller-programma/page.tsx → /reseller-programma
    │   │   ├── start-hier/page.tsx → /start-hier
    │   │   ├── supplementen/page.tsx → /supplementen
    │   │   ├── nieuwsbrief/page.tsx → /nieuwsbrief
    │   │   ├── levering/page.tsx   → /levering
    │   │   ├── winkelwagen/page.tsx → /winkelwagen (redirect to WooCommerce)
    │   │   ├── mijn-account/page.tsx → /mijn-account (redirect to WooCommerce)
    │   │   ├── privacy/page.tsx    → /privacy
    │   │   ├── voorwaarden/page.tsx → /voorwaarden
    │   │   └── cookies/page.tsx    → /cookies
    │   └── reseller/
    │       ├── (auth)/                     no sidebar — public pages
    │       │   ├── login/page.tsx          → /reseller/login
    │       │   └── register/page.tsx       → /reseller/register
    │       └── (portal)/                   sidebar layout — auth-gated
    │           ├── layout.tsx              ResellerSidebar shell
    │           ├── dashboard/page.tsx      → /reseller/dashboard
    │           ├── products/page.tsx       → /reseller/products
    │           ├── quotations/page.tsx     → /reseller/quotations
    │           ├── invoices/page.tsx       → /reseller/invoices
    │           ├── files/page.tsx          → /reseller/files
    │           ├── profile/page.tsx        → /reseller/profile
    │           └── admin/
    │               ├── page.tsx                → /reseller/admin
    │               ├── applications/page.tsx   → /reseller/admin/applications
    │               ├── partners/page.tsx       → /reseller/admin/partners
    │               └── files/page.tsx          → /reseller/admin/files
    ├── components/
    │   ├── Nav.tsx                 marketing nav (written once, used everywhere)
    │   ├── Footer.tsx
    │   ├── MobileMenu.tsx
    │   └── reseller/
    │       ├── Sidebar.tsx         portal sidebar shell
    │       ├── TierBadge.tsx       tier pill component
    │       └── ProgressBar.tsx     tier progress bar
    ├── lib/
    │   ├── api.ts                  apiFetch() — adds Bearer JWT automatically
    │   └── supabase.ts             Supabase client (browser + server)
    ├── styles/
    │   └── globals.css             existing CSS variables, unchanged
    ├── middleware.ts               auth guard for /reseller/* routes
    ├── next.config.ts
    └── netlify.toml
```

---

## Route Map

### Marketing (static, no auth)

| Route | Source HTML | Notes |
|---|---|---|
| `/` | index.html | |
| `/shop` | shop.html | |
| `/marine-collageen` | marine-collageen-13000-kuur.html | URL simplified |
| `/nordsilk` | nordsilk.html | |
| `/freja` | freja.html | |
| `/hermade` | hermade.html | |
| `/over-ons` | over-ons.html | |
| `/stories` | stories.html | |
| `/contact` | contact.html | |
| `/reseller-programma` | reseller-programma.html | CTA → /reseller/register |
| `/start-hier` | start-hier.html | |
| `/supplementen` | supplementen.html | |
| `/nieuwsbrief` | nieuwsbrief.html | |
| `/levering` | levering.html | |
| `/winkelwagen` | winkelwagen.html | Redirect to WooCommerce cart |
| `/mijn-account` | mijn-account.html | Redirect to WooCommerce account |
| `/privacy` | privacy.html | |
| `/voorwaarden` | voorwaarden.html | |
| `/cookies` | cookies.html | |

Legacy HTML URLs get Netlify redirect rules (`_redirects`) to avoid 404s during DNS cutover.

### Reseller Portal (auth-gated)

| Route | Auth | API Endpoints |
|---|---|---|
| `/reseller/login` | Public | Supabase signInWithPassword |
| `/reseller/register` | Public | POST /auth/register-application |
| `/reseller/dashboard` | Required | GET /resellers/me/stats, /resellers/me/tier |
| `/reseller/products` | Required | GET /products |
| `/reseller/quotations` | Required | GET /resellers/me/quotations, POST /orders/quotation |
| `/reseller/invoices` | Required | GET /resellers/me/invoices |
| `/reseller/files` | Required | GET /files, GET /files/{id}/download |
| `/reseller/profile` | Required | GET /auth/me, PUT /resellers/me/profile |
| `/reseller/admin` | Admin only | GET /admin/resellers |
| `/reseller/admin/applications` | Admin only | GET /admin/applications, POST …/approve, POST …/reject |
| `/reseller/admin/partners` | Admin only | GET /admin/resellers, PUT /admin/resellers/{id}/tier |
| `/reseller/admin/files` | Admin only | POST /files, DELETE /files/{id} |

---

## Authentication

### Library

`@supabase/ssr` — the official Supabase package for Next.js. Stores JWT and refresh token in **httpOnly cookies** (not localStorage). Handles token refresh automatically.

### Middleware (`middleware.ts`)

Runs before every request matching `/reseller/:path*`:

1. Read Supabase session from cookie
2. If no valid session → redirect to `/reseller/login`
3. If path matches `/reseller/admin/:path*` → call `GET /auth/me` and check `is_admin: true`. If false → redirect to `/reseller/dashboard`
4. Otherwise → allow through

Login and register routes are explicitly excluded from the middleware guard.

### Login flow

1. User submits email + password on `/reseller/login`
2. `supabase.auth.signInWithPassword()` called
3. On success: session stored in cookie, redirect to `/reseller/dashboard`
4. On failure: show existing error UI (no changes to visual design)

### Sign-out

`supabase.auth.signOut()` clears the cookie. Redirect to `/reseller/login`.

---

## API Integration

### `lib/api.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(path: string, options?: RequestInit) {
  const supabase = createBrowserClient(...)
  const { data: { session } } = await supabase.auth.getSession()
  
  return fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options?.headers,
    },
  })
}
```

All portal pages import `apiFetch` instead of raw `fetch`. No page manages the JWT directly.

### Error handling

- 401 response → sign out and redirect to `/reseller/login`
- 403 response → redirect to `/reseller/dashboard` (admin check failed)
- Network error → show inline error state (not a full-page crash)

---

## CSS Strategy

`styles/globals.css` contains all existing CSS variables (`--bone`, `--moss`, `--gold`, etc.) and class names, copied verbatim from the existing HTML files. No changes to visual design.

HTML-to-JSX mechanical changes:
- `class=` → `className=`
- `for=` → `htmlFor=`
- `onclick=` → `onClick={...}`
- Void elements self-closed (`<br>` → `<br />`)
- Inline styles → object syntax (`style={{ color: 'red' }}`)
- `<script>` tags removed; logic moved to React state/hooks

---

## Deployment

### Netlify config (`netlify.toml`)

```toml
[build]
  base    = "tsg-frontend"
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment variables (set in Netlify dashboard)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL          # Azure Container App URL
```

### CI/CD

Push to `main` → Netlify auto-builds and deploys. Preview deployments on every PR. No manual steps after initial setup.

### DNS cutover

Point `theswedishglow.com` to the new Netlify site. Add legacy redirect rules for old `.html` URLs (e.g. `/shop.html` → `/shop`) so no existing links break.

---

## Estimated Timeline

| Phase | Work | Days |
|---|---|---|
| 1 | Scaffold: Next.js setup, globals.css, Nav, Footer, middleware | 1 |
| 2 | Marketing pages: HTML → JSX for all 19 pages | 3–4 |
| 3 | Portal pages: split 171KB file into route segments | 2 |
| 4 | Auth wiring: Supabase login, session, middleware | 1 |
| 5 | API wiring: replace all hardcoded data with fetch() calls | 2–3 |
| 6 | Testing + Netlify deploy + DNS cutover | 1 |
| **Total** | | **~10–12 days** |

---

## Out of Scope

- Mollie/custom B2C checkout (Phase 2)
- Tailwind CSS migration
- `mijn-account` B2C login (redirects to WooCommerce for now)
- Email notifications on tier upgrade
