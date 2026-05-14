# Portal UI Fixes & Cart System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix progress bar alignment, add green headers to all portal subpages, implement a localStorage-backed cart system with dedicated checkout page, fix the files page runtime error, and redesign the profile and admin pages.

**Architecture:** All changes are frontend-only except Task 14 (live TL invoice fetch) and Task 15 (seed updates). New shared state uses React Context + localStorage. A new `ResellerContext` gives all portal pages access to the logged-in reseller without redundant `/auth/me` fetches.

**Tech Stack:** Next.js 15, React 18, TypeScript, portal.css (CSS vars-based design system)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `tsg-frontend/lib/reseller-context.tsx` | Create | Server-fetched reseller available to all client pages |
| `tsg-frontend/lib/cart-context.tsx` | Create | Cart state — localStorage-backed, portal-wide |
| `tsg-frontend/components/reseller/PageHeader.tsx` | Create | Compact green header component for subpages |
| `tsg-frontend/app/reseller/(portal)/layout.tsx` | Modify | Add ResellerProvider + CartProvider |
| `tsg-frontend/app/reseller/(portal)/dashboard/page.tsx` | Modify | Fix fillPct formula |
| `tsg-frontend/app/reseller/(portal)/tier/page.tsx` | Modify | Fix fillPct formula + add PageHeader |
| `tsg-frontend/app/reseller/(portal)/products/page.tsx` | Modify | Add PageHeader + cart add button |
| `tsg-frontend/app/reseller/(portal)/winkelwagen/page.tsx` | Create | Cart page — review items + submit quotation |
| `tsg-frontend/app/reseller/(portal)/quotations/page.tsx` | Modify | Strip inline cart, add PageHeader, keep history table |
| `tsg-frontend/app/reseller/(portal)/invoices/page.tsx` | Modify | Add PageHeader + fix factuurnr fallback |
| `tsg-frontend/app/reseller/(portal)/files/page.tsx` | Modify | Fix FileListOut shape + add PageHeader |
| `tsg-frontend/app/reseller/(portal)/profile/page.tsx` | Modify | Add PageHeader + styled form card redesign |
| `tsg-frontend/app/reseller/(portal)/admin/page.tsx` | Modify | Add PageHeader + stat cards + nav cards redesign |
| `tsg-frontend/lib/types.ts` | Modify | Add `FileListOut` interface |
| `tsg-frontend/styles/portal.css` | Modify | Fix tier-line CSS + PageHeader styles + cart styles |
| `tsg-backend/app/routers/resellers.py` | Modify | Live TL fetch in invoices endpoint |
| `tsg-backend/scripts/seed_local.py` | Modify | Quotation totals + 4 placeholder marketing files |

---

### Task 1: Fix progress bar CSS

**Files:**
- Modify: `tsg-frontend/styles/portal.css` (`.tier-line` and `.tier-line-fill` blocks)

The dots sit in a `repeat(5, 1fr)` grid. Centers are at 10%/30%/50%/70%/90% of `.tier-track`. The `.tier-line` currently runs `left:0; right:0` so it extends past the first and last dots. `.tier-line-fill` has `top:13px` inside a 1px parent, misaligning it vertically.

- [ ] **Step 1: Find the current tier-line rules**

```bash
grep -n "tier-line" "tsg-frontend/styles/portal.css"
```

Note the exact line numbers for `.tier-line {` and `.tier-line-fill {`.

- [ ] **Step 2: Fix `.tier-line` and `.tier-line-fill`**

Find and replace in `portal.css`:

Old `.tier-line` block:
```css
.tier-line {
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--line-strong);
}
```

New:
```css
.tier-line {
  position: absolute;
  top: 14px;
  left: 10%;
  right: 10%;
  height: 1px;
  background: var(--line-strong);
}
```

Find the `top: 13px` line inside `.tier-line-fill` and change it to `top: -1px` (centers the 3px fill on the 1px track):
```css
.tier-line-fill {
  position: absolute;
  top: -1px;
  left: 0;
```

- [ ] **Step 3: Commit**

```bash
cd "tsg-frontend"
git add styles/portal.css
git commit -m "fix: align tier-line track between first and last dot"
```

---

### Task 2: Fix progress bar fill formula in dashboard and tier pages

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/dashboard/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/tier/page.tsx`

`progress_pct` from the backend = `revenue / next_tier_min * 100` (progress toward the *next* tier only). The fill needs to map this to a position within the 80% track, between the current and next tier dot.

Within `.tier-line` (which runs from first to last dot), the 5 dots are at 0%/25%/50%/75%/100%.

- [ ] **Step 1: Update `dashboard/page.tsx` — replace `fillPct` calculation**

Find this block (around line 30–32):
```tsx
  const currentIdx = tier ? tierIndex(tier.current_tier) : -1
  const fillPct = tier ? tier.progress_pct : 0
```

Replace with:
```tsx
  const currentIdx = tier ? tierIndex(tier.current_tier) : -1
  const TIER_LINE_POS = [0, 25, 50, 75, 100]
  const fillPct = tier
    ? (() => {
        const cur = TIER_LINE_POS[currentIdx] ?? 0
        const next = TIER_LINE_POS[currentIdx + 1] ?? 100
        return cur + (tier.progress_pct / 100) * (next - cur)
      })()
    : 0
```

- [ ] **Step 2: Update `tier/page.tsx` — replace `fillPct` calculation**

Find (around line 60–61):
```tsx
  const currentIdx = tierIndex(tier.current_tier)
  const fillPct = tier.progress_pct
```

Replace with:
```tsx
  const currentIdx = tierIndex(tier.current_tier)
  const TIER_LINE_POS = [0, 25, 50, 75, 100]
  const fillPct = (() => {
    const cur = TIER_LINE_POS[currentIdx] ?? 0
    const next = TIER_LINE_POS[currentIdx + 1] ?? 100
    return cur + (tier.progress_pct / 100) * (next - cur)
  })()
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3001/reseller/dashboard. The gold fill line should stop at ~20% of the track (between Pearl and Rose dots, roughly 83% of the way through the Pearl→Rose segment). The background track line should start at the Pearl dot and end at the Black dot.

- [ ] **Step 4: Commit**

```bash
git add app/reseller/\(portal\)/dashboard/page.tsx app/reseller/\(portal\)/tier/page.tsx
git commit -m "fix: correct tier progress bar fill formula and track alignment"
```

---

### Task 3: Add ResellerContext

**Files:**
- Create: `tsg-frontend/lib/reseller-context.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/layout.tsx`

The portal layout already fetches the reseller server-side. This task makes that data available to all client components via context so PageHeader can show the tier without each page fetching `/auth/me` separately.

- [ ] **Step 1: Create `lib/reseller-context.tsx`**

```tsx
'use client'
import { createContext, useContext } from 'react'
import type { Reseller } from './types'

const ResellerContext = createContext<Reseller | null>(null)

export function ResellerProvider({
  reseller,
  children,
}: {
  reseller: Reseller
  children: React.ReactNode
}) {
  return (
    <ResellerContext.Provider value={reseller}>
      {children}
    </ResellerContext.Provider>
  )
}

export function useReseller(): Reseller | null {
  return useContext(ResellerContext)
}
```

- [ ] **Step 2: Wrap children in `layout.tsx`**

Current layout renders:
```tsx
    <div className="shell" id="portal-shell">
      <Sidebar reseller={DEV_RESELLER} />
      <main className="main-content">
        {children}
      </main>
    </div>
```

Add the import and wrap with `ResellerProvider`. The layout file has two render paths (dev bypass + production). Update both:

```tsx
import { ResellerProvider } from '@/lib/reseller-context'
```

In the dev bypass path:
```tsx
    <div className="shell" id="portal-shell">
      <Sidebar reseller={DEV_RESELLER} />
      <main className="main-content">
        <ResellerProvider reseller={DEV_RESELLER}>
          {children}
        </ResellerProvider>
      </main>
    </div>
```

In the production path:
```tsx
    <div className="shell" id="portal-shell">
      <Sidebar reseller={reseller} />
      <main className="main-content">
        <ResellerProvider reseller={reseller}>
          {children}
        </ResellerProvider>
      </main>
    </div>
```

- [ ] **Step 3: Commit**

```bash
git add lib/reseller-context.tsx app/reseller/\(portal\)/layout.tsx
git commit -m "feat: add ResellerContext so subpages can access reseller without extra fetch"
```

---

### Task 4: Create PageHeader component and CSS

**Files:**
- Create: `tsg-frontend/components/reseller/PageHeader.tsx`
- Modify: `tsg-frontend/styles/portal.css`

- [ ] **Step 1: Create `components/reseller/PageHeader.tsx`**

```tsx
'use client'
import { useReseller } from '@/lib/reseller-context'

interface PageHeaderProps {
  eyebrow: string
  title: string
}

export default function PageHeader({ eyebrow, title }: PageHeaderProps) {
  const reseller = useReseller()
  const tier = reseller?.tier ?? null
  const tierLabel = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : null

  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-header-eyebrow">{eyebrow}</div>
        <h1 className="page-header-title">{title}</h1>
      </div>
      {tierLabel && (
        <div className="page-header-tier">
          <div className="page-header-tier-label">Uw tier</div>
          <div className="page-header-tier-value">{tierLabel}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add CSS to `portal.css`**

Find the `/* DASHBOARD */` comment block (around line 712). Add these rules just before it:

```css
/* PAGE HEADER (compact green header for subpages) */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:
    radial-gradient(ellipse at 80% 0%, rgba(212, 180, 120, 0.12) 0%, transparent 50%),
    linear-gradient(135deg, var(--moss) 0%, var(--moss-deep) 100%);
  padding: 24px 48px;
  margin: 0 0 32px;
  position: relative;
}
.page-header::before {
  content: '';
  position: absolute;
  top: 10px; left: 10px; right: 10px; bottom: 10px;
  border: 1px solid rgba(212, 180, 120, 0.12);
  pointer-events: none;
}
.page-header-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.62rem;
  font-weight: 500;
  color: var(--gold-soft);
  margin-bottom: 8px;
}
.page-header-eyebrow::before {
  content: '';
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-soft) 100%);
}
.page-header-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.6rem, 2.4vw, 2.2rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--bone);
}
.page-header-tier {
  text-align: right;
  position: relative;
  padding-right: 4px;
}
.page-header-tier::before {
  content: '';
  position: absolute;
  right: -16px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent 0%, rgba(212, 180, 120, 0.4) 50%, transparent 100%);
}
.page-header-tier-label {
  font-size: 0.6rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(246, 241, 232, 0.55);
  margin-bottom: 4px;
}
.page-header-tier-value {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.8rem;
  background: linear-gradient(135deg, #f0d896 0%, var(--gold) 50%, #b8924a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/reseller/PageHeader.tsx styles/portal.css
git commit -m "feat: add PageHeader component with compact green header style"
```

---

### Task 5: Add PageHeader to all subpages

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/tier/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/products/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/quotations/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/invoices/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/files/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/profile/page.tsx`
- Modify: `tsg-frontend/app/reseller/(portal)/admin/page.tsx`

For each page: add `import PageHeader from '@/components/reseller/PageHeader'` and replace the `<div className="page-head">...</div>` block (or the bare `<h1>` in admin) with `<PageHeader eyebrow="..." title="..." />`. Also remove the `panel-body` wrapping div where it wraps the header (keep it for the content below). Actually keep `panel-body` as-is — just swap the header block.

- [ ] **Step 1: Update `tier/page.tsx`**

Add import at top:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Partner programma</div>
          <h1 className="page-title">Tier voordelen</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Partner programma" title="Tier voordelen" />
```

- [ ] **Step 2: Update `products/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Assortiment</div>
          <h1 className="page-title">Producten</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Assortiment" title="Producten" />
```

- [ ] **Step 3: Update `quotations/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Bestellen</div>
          <h1 className="page-title">Offerte aanvragen</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Bestellen" title="Bestellingen" />
```

- [ ] **Step 4: Update `invoices/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Financieel</div>
          <h1 className="page-title">Facturen</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Financieel" title="Facturen" />
```

- [ ] **Step 5: Update `files/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Downloads</div>
          <h1 className="page-title">Marketingmateriaal</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Downloads" title="Marketingmateriaal" />
```

- [ ] **Step 6: Update `profile/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <div className="page-head">
        <div className="page-head-left">
          <div className="page-eyebrow">Account</div>
          <h1 className="page-title">Mijn gegevens</h1>
        </div>
      </div>
```

With:
```tsx
      <PageHeader eyebrow="Account" title="Mijn gegevens" />
```

- [ ] **Step 7: Update `admin/page.tsx`**

Add import:
```tsx
import PageHeader from '@/components/reseller/PageHeader'
```

Replace:
```tsx
      <h1>Beheer</h1>
```

With:
```tsx
      <PageHeader eyebrow="Beheer" title="Admin overzicht" />
```

Also change the outer `<div className="panel" id="panel-admin">` to `<div className="panel-body">` to match other pages.

- [ ] **Step 8: Verify in browser**

Open each page and confirm the green header appears with gold eyebrow, serif title, and tier badge.

- [ ] **Step 9: Commit**

```bash
git add app/reseller/\(portal\)/tier/page.tsx \
        app/reseller/\(portal\)/products/page.tsx \
        app/reseller/\(portal\)/quotations/page.tsx \
        app/reseller/\(portal\)/invoices/page.tsx \
        app/reseller/\(portal\)/files/page.tsx \
        app/reseller/\(portal\)/profile/page.tsx \
        app/reseller/\(portal\)/admin/page.tsx
git commit -m "feat: add compact green PageHeader to all portal subpages"
```

---

### Task 6: Create CartContext

**Files:**
- Create: `tsg-frontend/lib/cart-context.tsx`
- Create: `tsg-frontend/__tests__/lib/cart-context.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/cart-context.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/lib/cart-context'
import React from 'react'

// Clear localStorage between tests
beforeEach(() => localStorage.clear())

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null, children)

test('starts empty', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  expect(result.current.items).toEqual([])
  expect(result.current.totalItems).toBe(0)
  expect(result.current.totalEur).toBe(0)
})

test('addItem adds a new item with qty 1', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
  })
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0]).toEqual({ product_id: 'p1', name: 'Test', unit_price: 10, quantity: 1 })
})

test('addItem increments quantity if product already in cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
  })
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].quantity).toBe(2)
})

test('removeItem removes an item', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.removeItem('p1')
  })
  expect(result.current.items).toHaveLength(0)
})

test('updateQty changes item quantity', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.updateQty('p1', 5)
  })
  expect(result.current.items[0].quantity).toBe(5)
})

test('updateQty(id, 0) removes the item', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.updateQty('p1', 0)
  })
  expect(result.current.items).toHaveLength(0)
})

test('clearCart empties the cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.clearCart()
  })
  expect(result.current.items).toHaveLength(0)
})

test('totalItems is sum of quantities', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'A', unit_price: 10 })
    result.current.addItem({ product_id: 'p2', name: 'B', unit_price: 20 })
    result.current.updateQty('p1', 3)
  })
  expect(result.current.totalItems).toBe(4)
})

test('totalEur is sum of unit_price * quantity', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'A', unit_price: 10 })
    result.current.updateQty('p1', 3)
    result.current.addItem({ product_id: 'p2', name: 'B', unit_price: 20 })
  })
  expect(result.current.totalEur).toBe(50) // 10*3 + 20*1
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd tsg-frontend && npx jest __tests__/lib/cart-context.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/cart-context'`

- [ ] **Step 3: Create `lib/cart-context.tsx`**

```tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: string
  name: string
  unit_price: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (product_id: string) => void
  updateQty: (product_id: string, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalEur: number
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalEur: 0,
})

const STORAGE_KEY = 'tsg_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === item.product_id)
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeItem(product_id: string) {
    setItems(prev => prev.filter(i => i.product_id !== product_id))
  }

  function updateQty(product_id: string, qty: number) {
    if (qty <= 0) { removeItem(product_id); return }
    setItems(prev => prev.map(i => i.product_id === product_id ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalEur = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalEur }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  return useContext(CartContext)
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest __tests__/lib/cart-context.test.ts
```

Expected: all 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/cart-context.tsx __tests__/lib/cart-context.test.ts
git commit -m "feat: add CartContext with localStorage persistence"
```

---

### Task 7: Wire CartProvider into portal layout + add cart badge

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/layout.tsx`
- Modify: `tsg-frontend/styles/portal.css`

- [ ] **Step 1: Add CartProvider to layout**

Add import:
```tsx
import { CartProvider } from '@/lib/cart-context'
```

Wrap `ResellerProvider` with `CartProvider` in both render paths (dev bypass and production):

```tsx
      <main className="main-content">
        <CartProvider>
          <ResellerProvider reseller={DEV_RESELLER}>
            {children}
          </ResellerProvider>
        </CartProvider>
      </main>
```

(Same pattern for the production path with `reseller` instead of `DEV_RESELLER`.)

- [ ] **Step 2: Create `components/reseller/CartBadge.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartBadge() {
  const { totalItems } = useCart()
  if (totalItems === 0) return null

  return (
    <Link href="/reseller/winkelwagen" className="cart-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span className="cart-badge-count">{totalItems}</span>
      <span className="cart-badge-label">Winkelwagen</span>
    </Link>
  )
}
```

- [ ] **Step 3: Add CartBadge to layout**

Import and render inside `<main>`, above `{children}`:

```tsx
import CartBadge from '@/components/reseller/CartBadge'
```

```tsx
      <main className="main-content">
        <CartProvider>
          <ResellerProvider reseller={DEV_RESELLER}>
            <CartBadge />
            {children}
          </ResellerProvider>
        </CartProvider>
      </main>
```

- [ ] **Step 4: Add cart badge CSS to `portal.css`**

Add after the page-header block:

```css
/* CART BADGE */
.cart-badge {
  position: fixed;
  top: 20px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--moss-deep);
  color: var(--bone);
  padding: 8px 16px;
  border: 1px solid rgba(212, 180, 120, 0.25);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-decoration: none;
  z-index: 100;
  transition: background 0.2s ease;
}
.cart-badge:hover { background: var(--moss); }
.cart-badge-count {
  background: var(--gold);
  color: var(--moss-deep);
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.cart-badge-label { font-weight: 400; }
```

- [ ] **Step 5: Commit**

```bash
git add app/reseller/\(portal\)/layout.tsx components/reseller/CartBadge.tsx styles/portal.css
git commit -m "feat: add CartProvider to portal layout and cart badge"
```

---

### Task 8: Update products page — add to cart

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/products/page.tsx`

- [ ] **Step 1: Update `products/page.tsx`**

Add import:
```tsx
import { useCart } from '@/lib/cart-context'
```

Inside the component, add:
```tsx
  const { addItem } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  function handleAdd(p: Product) {
    addItem({ product_id: p.id, name: p.name, unit_price: p.net_price_eur })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 600)
  }
```

Replace the button in the product card:
```tsx
                <button
                  className="btn btn-primary"
                  onClick={() => handleAdd(p)}
                >
                  {added === p.id ? '✓ Toegevoegd' : 'Toevoegen aan offerte →'}
                </button>
```

- [ ] **Step 2: Verify in browser**

Go to http://localhost:3001/reseller/products. Click "Toevoegen aan offerte →" on a product — button should briefly show "✓ Toegevoegd", then the cart badge should appear in the top-right.

- [ ] **Step 3: Commit**

```bash
git add app/reseller/\(portal\)/products/page.tsx
git commit -m "feat: connect products page to cart context"
```

---

### Task 9: Create winkelwagen (cart) page

**Files:**
- Create: `tsg-frontend/app/reseller/(portal)/winkelwagen/page.tsx`
- Modify: `tsg-frontend/styles/portal.css`

- [ ] **Step 1: Create `app/reseller/(portal)/winkelwagen/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { apiJson } from '@/lib/api'
import PageHeader from '@/components/reseller/PageHeader'

export default function WinkelwagenPage() {
  const { items, removeItem, updateQty, clearCart, totalEur } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  async function handleSubmit() {
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      await apiJson('/orders/quotation', {
        method: 'POST',
        body: JSON.stringify({
          lines: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        }),
      })
      clearCart()
      router.push('/reseller/quotations?success=1')
    } catch (e: unknown) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="panel-body">
        <PageHeader eyebrow="Bestellen" title="Winkelwagen" />
        <div className="cart-empty">
          <p>Uw winkelwagen is leeg.</p>
          <Link href="/reseller/products" className="btn btn-primary">
            Naar producten →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Bestellen" title="Winkelwagen" />

      <div className="cart-layout">
        {/* Line items */}
        <div className="cart-items">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stukprijs</th>
                  <th>Aantal</th>
                  <th>Totaal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.product_id}>
                    <td>{item.name}</td>
                    <td className="td-num">{fmt(item.unit_price)}</td>
                    <td>
                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity - 1)}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.product_id, item.quantity + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="td-num">{fmt(item.unit_price * item.quantity)}</td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeItem(item.product_id)}
                        title="Verwijderen"
                      >×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/reseller/products" className="btn btn-ghost">
              ← Verder winkelen
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="cart-summary">
          <div className="cart-summary-label">Uw bestelling</div>
          <div className="cart-summary-total">{fmt(totalEur)}</div>
          <div className="cart-summary-sub">exclusief BTW</div>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Bezig...' : 'Offerte indienen →'}
          </button>
          {error && <div className="cart-error">{error}</div>}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add cart page CSS to `portal.css`**

```css
/* CART PAGE */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  align-items: start;
}
.cart-items { min-width: 0; }
.cart-summary {
  background: var(--bone-dark, #ede8df);
  border: 1px solid var(--line);
  padding: 28px 24px;
  position: sticky;
  top: 24px;
}
.cart-summary-label {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--ink-soft);
  margin-bottom: 12px;
}
.cart-summary-total {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  color: var(--ink);
  margin-bottom: 4px;
}
.cart-summary-sub {
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 20px;
}
.cart-summary .btn-primary { width: 100%; }
.cart-error {
  margin-top: 10px;
  font-size: 0.82rem;
  color: #c0392b;
}
.cart-empty {
  padding: 60px 0;
  text-align: center;
  color: var(--ink-soft);
}
.cart-empty p { margin-bottom: 20px; font-size: 1.05rem; }
.qty-stepper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line-strong);
  padding: 2px 6px;
}
.qty-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--ink);
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.qty-btn:hover { color: var(--gold); }
.qty-value { min-width: 24px; text-align: center; font-size: 0.9rem; }
.btn-remove {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: var(--muted);
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}
.btn-remove:hover { color: var(--ink); }
```

- [ ] **Step 3: Verify in browser**

Add a product to cart, click the cart badge → should go to `/reseller/winkelwagen`. Adjust quantity with +/−, remove items, and verify the summary total updates. Click "Offerte indienen" and confirm redirect to `/reseller/quotations`.

- [ ] **Step 4: Commit**

```bash
git add app/reseller/\(portal\)/winkelwagen/page.tsx styles/portal.css
git commit -m "feat: add winkelwagen (cart) page with qty stepper and order summary"
```

---

### Task 10: Gut quotations page — remove inline cart, keep history

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/quotations/page.tsx`

The current quotations page has an inline cart + product list. The cart is now in the winkelwagen page. This page should only show previous quotations and a link to start a new order.

- [ ] **Step 1: Rewrite `quotations/page.tsx`**

Replace the entire file with:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiJson } from '@/lib/api'
import type { Quotation } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const STATUS_LABELS: Record<Quotation['status'], string> = {
  draft: 'Concept',
  sent: 'Verzonden',
  accepted: 'Geaccepteerd',
  rejected: 'Afgewezen',
  expired: 'Verlopen',
}

const STATUS_CSS: Record<Quotation['status'], string> = {
  draft: 'status-draft',
  sent: 'status-pending',
  accepted: 'status-delivered',
  rejected: 'status-processing',
  expired: 'status-draft',
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get('success') === '1'

  useEffect(() => {
    apiJson<Quotation[]>('/resellers/me/quotations')
      .then(setQuotations)
      .catch((e) => console.error('quotations:', e.message))
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Bestellen" title="Bestellingen" />

      {showSuccess && (
        <div className="success-banner">
          Offerte ingediend — wij nemen zo snel mogelijk contact op.
        </div>
      )}

      <div className="section-actions">
        <Link href="/reseller/products" className="btn btn-primary">
          Nieuwe bestelling →
        </Link>
      </div>

      <div className="section-eyebrow" style={{ marginTop: '2rem' }}>Eerdere offertes</div>

      {quotations.length === 0
        ? <p style={{ color: 'var(--muted)', padding: '20px 0' }}>Nog geen offertes</p>
        : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Totaal</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map(q => (
                  <tr key={q.id}>
                    <td>{new Intl.DateTimeFormat('nl-NL').format(new Date(q.created_at))}</td>
                    <td>
                      <span className={`badge-status ${STATUS_CSS[q.status]}`}>
                        {STATUS_LABELS[q.status]}
                      </span>
                    </td>
                    <td className="td-num">{q.total_eur !== null ? fmt(q.total_eur) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}
```

- [ ] **Step 2: Add success banner + section-actions CSS to `portal.css`**

```css
/* SUCCESS BANNER */
.success-banner {
  background: linear-gradient(135deg, var(--moss) 0%, var(--moss-deep) 100%);
  color: var(--bone);
  padding: 14px 24px;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  margin-bottom: 24px;
  border-left: 3px solid var(--gold-soft);
}
.section-actions { margin-bottom: 8px; }
```

- [ ] **Step 3: Commit**

```bash
git add app/reseller/\(portal\)/quotations/page.tsx styles/portal.css
git commit -m "refactor: gut quotations page inline cart, add success banner and new order CTA"
```

---

### Task 11: Fix files page — handle FileListOut shape

**Files:**
- Modify: `tsg-frontend/lib/types.ts`
- Modify: `tsg-frontend/app/reseller/(portal)/files/page.tsx`

The backend returns `{ accessible: MarketingFile[], locked: MarketingFile[] }` but the page does `.then(setFiles)` and calls `files.map()` on the object.

- [ ] **Step 1: Add `FileListOut` to `lib/types.ts`**

Add after the `MarketingFile` interface:
```ts
export interface FileListOut {
  accessible: MarketingFile[]
  locked: MarketingFile[]
}
```

- [ ] **Step 2: Rewrite `files/page.tsx`**

Replace the entire file:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api'
import type { FileListOut } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'

const TIER_ORDER = ['all', 'pearl', 'rose', 'pro', 'elite', 'black']

function tierLabel(tier: string): string {
  if (tier === 'all') return 'Alle tiers'
  return tier.charAt(0).toUpperCase() + tier.slice(1) + ' en hoger'
}

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function FilesPage() {
  const [data, setData] = useState<FileListOut | null>(null)

  useEffect(() => {
    apiJson<FileListOut>('/files')
      .then(setData)
      .catch((e) => console.error('files:', e.message))
  }, [])

  async function download(fileId: string, name: string) {
    try {
      const res = await apiFetch(`/files/${fileId}/download`)
      const { download_url } = await res.json()
      const a = document.createElement('a')
      a.href = download_url
      a.download = name
      a.click()
    } catch (e) {
      console.error('download:', e)
    }
  }

  const accessible = data?.accessible ?? []
  const locked = data?.locked ?? []

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Downloads" title="Marketingmateriaal" />

      {!data && <div className="loading">Laden...</div>}

      {data && (
        <>
          {accessible.length > 0 && (
            <>
              <div className="section-eyebrow">Beschikbaar</div>
              <div className="table-wrap">
                {accessible.map(f => (
                  <div key={f.id} className="file-row">
                    <div className="file-icon"><FileIcon /></div>
                    <div className="file-info">
                      <div className="file-name">{f.name}</div>
                      <div className="file-meta">{f.download_count} downloads · {tierLabel(f.min_tier)}</div>
                    </div>
                    <button className="btn btn-ghost" onClick={() => download(f.id, f.name)}>
                      Downloaden ↓
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {locked.length > 0 && (
            <>
              <div className="section-eyebrow" style={{ marginTop: '2rem' }}>Vergrendeld</div>
              <div className="table-wrap">
                {locked.map(f => (
                  <div key={f.id} className="file-row locked">
                    <div className="file-icon"><LockIcon /></div>
                    <div className="file-info">
                      <div className="file-name">{f.name}</div>
                      <div className="file-meta">Vereist {tierLabel(f.min_tier)}</div>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Geen toegang</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Go to http://localhost:3001/reseller/files — page should load without the `files.map is not a function` error. Should show available files and locked files in separate sections.

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts app/reseller/\(portal\)/files/page.tsx
git commit -m "fix: handle FileListOut shape on files page, fix runtime TypeError"
```

---

### Task 12: Fix invoices — factuurnr fallback

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/invoices/page.tsx`

The `Invoice.invoice_number` is null in the DB (only `tl_invoice_id` is set by the seed). The page currently renders `inv.invoice_number ?? '—'`. Fix: fall back to `tl_invoice_id`.

- [ ] **Step 1: Update factuurnr cell in `invoices/page.tsx`**

Find:
```tsx
                <td>{inv.invoice_number ?? '—'}</td>
```

Replace:
```tsx
                <td>{inv.invoice_number ?? inv.tl_invoice_id}</td>
```

- [ ] **Step 2: Commit**

```bash
git add app/reseller/\(portal\)/invoices/page.tsx
git commit -m "fix: show tl_invoice_id as fallback when invoice_number is null"
```

---

### Task 13: Redesign profile page

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/profile/page.tsx`
- Modify: `tsg-frontend/styles/portal.css`

- [ ] **Step 1: Rewrite `profile/page.tsx`**

Replace the entire file:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson, apiFetch } from '@/lib/api'
import type { Reseller } from '@/lib/types'
import PageHeader from '@/components/reseller/PageHeader'
import TierBadge from '@/components/reseller/TierBadge'

export default function ProfilePage() {
  const [reseller, setReseller] = useState<Reseller | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  useEffect(() => {
    apiJson<Reseller>('/auth/me').then(r => {
      setReseller(r)
      setFirstName(r.first_name ?? '')
      setLastName(r.last_name ?? '')
      setPhone(r.phone ?? '')
    }).catch((e) => console.error('me:', e.message))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      await apiFetch('/resellers/me/profile', {
        method: 'PUT',
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone }),
      })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  if (!reseller) return <div className="loading">Laden...</div>

  const initials = [reseller.first_name, reseller.last_name]
    .filter(Boolean).map(n => n![0].toUpperCase()).join('') || reseller.email[0].toUpperCase()

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Account" title="Mijn gegevens" />

      <div className="profile-card">
        <div className="profile-card-head">
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-card-id">
            <div className="profile-card-name">
              {[reseller.first_name, reseller.last_name].filter(Boolean).join(' ') || reseller.email}
            </div>
            <div className="profile-card-company">{reseller.company ?? '—'}</div>
            <TierBadge tier={reseller.tier} />
          </div>
        </div>

        <div className="profile-card-divider" />

        <form onSubmit={handleSave}>
          <div className="profile-form-grid">
            <div className="profile-section">
              <div className="profile-section-label">Persoonsgegevens</div>
              <div className="form-grid">
                <div>
                  <label className="field-label">Voornaam</label>
                  <input className="field-input" type="text" value={firstName}
                    onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Achternaam</label>
                  <input className="field-input" type="text" value={lastName}
                    onChange={e => setLastName(e.target.value)} />
                </div>
                <div className="full">
                  <label className="field-label">Telefoonnummer</label>
                  <input className="field-input" type="tel" value={phone}
                    onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-label">Accountgegevens</div>
              <div className="form-grid">
                <div className="full">
                  <div className="field-label">E-mailadres</div>
                  <div className="field-readonly">{reseller.email}</div>
                </div>
                <div className="full">
                  <div className="field-label">Bedrijf</div>
                  <div className="field-readonly">{reseller.company ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-save-row">
            {status === 'saved' && <span className="profile-status-ok">Wijzigingen opgeslagen</span>}
            {status === 'error' && <span className="profile-status-err">Er is iets misgegaan</span>}
            <button type="submit" className="btn btn-primary">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add profile card CSS to `portal.css`**

```css
/* PROFILE PAGE */
.profile-card {
  background: var(--bone);
  border: 1px solid var(--line);
  padding: 32px 40px 28px;
  max-width: 860px;
}
.profile-card-head {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
}
.profile-avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--moss) 0%, var(--moss-deep) 100%);
  color: var(--gold-soft);
  font-family: var(--font-display);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.profile-card-id { flex: 1; }
.profile-card-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--ink);
  margin-bottom: 2px;
}
.profile-card-company { font-size: 0.88rem; color: var(--ink-soft); margin-bottom: 8px; }
.profile-card-divider { height: 1px; background: var(--line); margin-bottom: 28px; }
.profile-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 28px;
}
.profile-section-label {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.66rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: 16px;
}
.field-readonly {
  padding: 10px 0 8px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 15px;
}
.profile-save-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}
.profile-status-ok { font-size: 0.85rem; color: var(--moss); }
.profile-status-err { font-size: 0.85rem; color: #c0392b; }
```

- [ ] **Step 3: Commit**

```bash
git add app/reseller/\(portal\)/profile/page.tsx styles/portal.css
git commit -m "feat: redesign profile page with styled card layout"
```

---

### Task 14: Redesign admin page

**Files:**
- Modify: `tsg-frontend/app/reseller/(portal)/admin/page.tsx`
- Modify: `tsg-frontend/styles/portal.css`

- [ ] **Step 1: Rewrite `admin/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { apiJson } from '@/lib/api'
import type { AdminReseller, Application, MarketingFile } from '@/lib/types'
import Link from 'next/link'
import PageHeader from '@/components/reseller/PageHeader'

export default function AdminPage() {
  const [resellerCount, setResellerCount] = useState<number | null>(null)
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [fileCount, setFileCount] = useState<number | null>(null)

  useEffect(() => {
    apiJson<AdminReseller[]>('/admin/resellers')
      .then(r => setResellerCount(r.length))
      .catch(() => setResellerCount(0))
    apiJson<Application[]>('/admin/applications')
      .then(apps => setPendingCount(apps.filter(a => a.status === 'pending').length))
      .catch(() => setPendingCount(0))
    apiJson<{ accessible: MarketingFile[]; locked: MarketingFile[] }>('/files')
      .then(d => setFileCount((d.accessible?.length ?? 0) + (d.locked?.length ?? 0)))
      .catch(() => setFileCount(0))
  }, [])

  const fmt = (n: number | null) => n !== null ? String(n) : '—'

  const navCards = [
    {
      href: '/reseller/admin/applications',
      title: 'Aanvragen beheren',
      description: 'Bekijk en verwerk partneraanvragen',
      icon: '📋',
    },
    {
      href: '/reseller/admin/partners',
      title: 'Partners beheren',
      description: 'Beheer resellers en tier-overschrijvingen',
      icon: '👥',
    },
    {
      href: '/reseller/admin/files',
      title: 'Bestanden beheren',
      description: 'Upload en beheer marketingmateriaal',
      icon: '📁',
    },
  ]

  return (
    <div className="panel-body">
      <PageHeader eyebrow="Beheer" title="Admin overzicht" />

      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat">
          <div className="stat-label">Partners</div>
          <div className="stat-value">{fmt(resellerCount)}</div>
          <div className="stat-sub">actief</div>
        </div>
        <div className="stat">
          <div className="stat-label">Openstaande aanvragen</div>
          <div className="stat-value">{fmt(pendingCount)}</div>
          <div className="stat-sub">te verwerken</div>
        </div>
        <div className="stat">
          <div className="stat-label">Bestanden</div>
          <div className="stat-value">{fmt(fileCount)}</div>
          <div className="stat-sub">marketingmateriaal</div>
        </div>
      </div>

      <div className="section-eyebrow">Beheer</div>
      <div className="admin-nav-cards">
        {navCards.map(card => (
          <Link key={card.href} href={card.href} className="admin-nav-card">
            <span className="admin-nav-card-icon">{card.icon}</span>
            <div className="admin-nav-card-body">
              <div className="admin-nav-card-title">{card.title}</div>
              <div className="admin-nav-card-desc">{card.description}</div>
            </div>
            <span className="admin-nav-card-arrow">→</span>
          </Link>
        ))}
        <div className="admin-nav-card disabled">
          <span className="admin-nav-card-icon">🔮</span>
          <div className="admin-nav-card-body">
            <div className="admin-nav-card-title">Account Intelligence</div>
            <div className="admin-nav-card-desc">Binnenkort beschikbaar</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add admin nav cards CSS to `portal.css`**

```css
/* ADMIN NAV CARDS */
.admin-nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.admin-nav-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: var(--bone);
  border: 1px solid var(--line);
  text-decoration: none;
  color: var(--ink);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.admin-nav-card:hover:not(.disabled) {
  border-color: var(--gold-soft);
  box-shadow: 0 4px 16px -4px rgba(28, 42, 35, 0.1);
}
.admin-nav-card.disabled { opacity: 0.45; cursor: default; pointer-events: none; }
.admin-nav-card-icon { font-size: 1.4rem; flex-shrink: 0; }
.admin-nav-card-body { flex: 1; min-width: 0; }
.admin-nav-card-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 2px;
}
.admin-nav-card-desc { font-size: 0.8rem; color: var(--ink-soft); }
.admin-nav-card-arrow {
  color: var(--gold);
  font-size: 1.1rem;
  flex-shrink: 0;
  opacity: 0.7;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/reseller/\(portal\)/admin/page.tsx styles/portal.css
git commit -m "feat: redesign admin page with stat cards and nav cards"
```

---

### Task 15: Backend — live TeamLeader invoice fetch

**Files:**
- Modify: `tsg-backend/app/routers/resellers.py`

The `GET /resellers/me/invoices` endpoint only reads from the DB. Update it to call TeamLeader first, upsert results, then return the full list. In LOCAL_DEV mode `list_invoices()` returns `[]` so seeded data is unaffected.

- [ ] **Step 1: Update `resellers.py` invoices endpoint**

Add imports at top of file (if not already present):
```python
from app.integrations import teamleader
from app.models import Invoice
```

Replace the `get_invoices` function (from `@router.get("/me/invoices")` to end of function):

```python
@router.get("/me/invoices")
async def get_invoices(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    # Fetch live from TeamLeader and upsert into DB
    tl_invoices = await teamleader.list_invoices(customer_id=reseller.teamleader_id)
    for tl_inv in tl_invoices:
        tl_id = tl_inv.get("id")
        if not tl_id:
            continue
        existing = await db.execute(
            select(Invoice).where(Invoice.tl_invoice_id == tl_id)
        )
        inv = existing.scalar_one_or_none()
        if inv is None:
            inv = Invoice(
                tl_invoice_id=tl_id,
                reseller_id=reseller.id,
                status=tl_inv.get("status", "outstanding"),
                total_eur=float(tl_inv.get("total", {}).get("tax_exclusive", 0) or 0),
                invoice_date=tl_inv.get("date"),
                due_date=tl_inv.get("due_on"),
            )
            db.add(inv)
        else:
            inv.status = tl_inv.get("status", inv.status)
            inv.total_eur = float(tl_inv.get("total", {}).get("tax_exclusive", inv.total_eur) or inv.total_eur)
    if tl_invoices:
        await db.commit()

    result = await db.execute(
        select(Invoice)
        .where(Invoice.reseller_id == reseller.id)
        .order_by(Invoice.invoice_date.desc())
    )
    return result.scalars().all()
```

- [ ] **Step 2: Verify locally (LOCAL_DEV mode)**

Hit the endpoint — seeded invoices should still appear unchanged since `list_invoices()` returns `[]` in LOCAL_DEV.

```bash
curl http://localhost:8001/resellers/me/invoices
```

Expected: JSON array with 5 seeded invoices.

- [ ] **Step 3: Commit**

```bash
cd tsg-backend
git add app/routers/resellers.py
git commit -m "feat: live TeamLeader invoice fetch on GET /resellers/me/invoices"
```

---

### Task 16: Seed updates — quotation totals + marketing files

**Files:**
- Modify: `tsg-backend/scripts/seed_local.py`

- [ ] **Step 1: Update `seed_local.py` — add totals to quotations and 4 more marketing files**

Find the quotations seed block and replace:
```python
        for i, (tl_q_id, tl_d_id, status) in enumerate(quotations, start=1):
```

Update the `quotations` list to include totals:
```python
        quotations = [
            ("QUO-2026-001", "DEAL-2026-001", "draft",     450.00),
            ("QUO-2026-002", "DEAL-2026-002", "sent",      675.00),
            ("QUO-2026-003", "DEAL-2026-003", "accepted", 1125.00),
        ]
        line_items = json.dumps([{"product": "Marine Collageen Poeder", "qty": 10, "unit_price": 45.00}])
        for i, (tl_q_id, tl_d_id, status, total) in enumerate(quotations, start=1):
            stable_id = uuid.UUID(f"b0000000-0000-0000-0000-{i:012d}")
            await db.execute(text("""
                INSERT INTO quotations (id, tl_quotation_id, tl_deal_id, reseller_id, status, line_items, total_eur)
                VALUES (:id, :tl_q_id, :tl_d_id, :reseller_id, :status, CAST(:items AS jsonb), :total)
                ON CONFLICT (id) DO NOTHING
            """), {
                "id": stable_id,
                "tl_q_id": tl_q_id,
                "tl_d_id": tl_d_id,
                "reseller_id": reseller_id,
                "status": status,
                "items": line_items,
                "total": total,
            })
        print("✓ 3 quotations")
```

Then find the end of the seed function (after `print("✓ 1 marketing file")`) and add:

```python
        # 7. Additional placeholder marketing files
        extra_files = [
            (uuid.UUID("f0000000-0000-0000-0000-000000000002"), "Brand Kit 2026",            "mock-file.pdf", "rose"),
            (uuid.UUID("f0000000-0000-0000-0000-000000000003"), "Productpresentatie Video",  "mock-file.pdf", "pro"),
            (uuid.UUID("f0000000-0000-0000-0000-000000000004"), "Prijslijst Groothandel",    "mock-file.pdf", "all"),
        ]
        for fid, fname, fblob, ftier in extra_files:
            await db.execute(text("""
                INSERT INTO marketing_files (id, name, blob_url, min_tier, download_count, uploaded_by)
                VALUES (:id, :name, :blob_url, :min_tier, 0, :uploaded_by)
                ON CONFLICT (id) DO NOTHING
            """), {"id": fid, "name": fname, "blob_url": fblob, "min_tier": ftier, "uploaded_by": reseller_id})
        print("✓ 3 extra marketing files")
```

- [ ] **Step 2: Re-run the seed**

```bash
cd tsg-backend
$env:PYTHONIOENCODING='utf-8'; python scripts/seed_local.py
```

Expected output includes `✓ 3 quotations` and `✓ 3 extra marketing files` (ON CONFLICT DO NOTHING means re-runs are safe).

- [ ] **Step 3: Verify quotation totals in browser**

Go to http://localhost:3001/reseller/bestellingen — the three previous quotations should show €450,00 / €675,00 / €1.125,00 instead of "—".

- [ ] **Step 4: Verify files page in browser**

Go to http://localhost:3001/reseller/files — should show 2 files accessible (all-tier) and 2 locked (rose, pro).

- [ ] **Step 5: Commit**

```bash
git add scripts/seed_local.py
git commit -m "fix: add total_eur to seed quotations, add 3 placeholder marketing files"
```
