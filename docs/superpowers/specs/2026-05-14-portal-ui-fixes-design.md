# Portal UI Fixes & Cart System — Design Spec
**Date:** 2026-05-14
**Scope:** Reseller portal frontend + minor backend changes

---

## Overview

Eight issues identified through manual testing of the reseller portal. Fixes split into four areas: bug fixes & visual polish, cart system, page redesigns, and backend changes.

---

## Section 1 — Bug Fixes & Visual Polish

### Progress Bar Fix
**Problem:** The tier track line runs `left:0; right:0` but the 5 dots are centered within a `repeat(5, 1fr)` grid at 10%/30%/50%/70%/90%. The fill `%` uses `progress_pct` directly against the full bar width, causing it to overshoot.

**Fix:**
- Constrain track line to `left:10%; right:10%` (80% width) so it starts/ends at first/last dot centers
- The 5 dots sit at 10%/30%/50%/70%/90% of `.tier-track`, which maps to 0%/25%/50%/75%/100% within the `.tier-line` element
- `progress_pct` from the backend = `revenue / next_tier_min * 100` (% toward the next tier only, confirmed in `resellers.py:72`)
- Correct fill formula (computed in the page component, not CSS):
  ```ts
  const TIER_LINE_POS = [0, 25, 50, 75, 100] // % within tier-line per tier index
  const currentPos = TIER_LINE_POS[currentIdx] ?? 0
  const nextPos = TIER_LINE_POS[currentIdx + 1] ?? 100
  const fillPct = currentPos + (tier.progress_pct / 100) * (nextPos - currentPos)
  // Pearl user at 83% → 0 + 0.83 * 25 = 20.75%
  ```
- Apply fix in `portal.css` (`.tier-line`: `left:10%; right:10%`) and in dashboard + tier pages where `fillPct` is passed

### Compact Green Header (`PageHeader` component)
**New component:** `components/reseller/PageHeader.tsx`

Props:
```ts
interface PageHeaderProps {
  eyebrow: string       // e.g. "Financieel"
  title: string         // e.g. "Facturen"
  tier?: string         // shown top-right as italic gold serif
}
```

Styling: dark green gradient (same CSS vars as `.welcome`), gold eyebrow line + label, serif page title (`clamp(1.6rem, 2.4vw, 2.2rem)`), tier badge top-right. No description text. Height ~80px — compact vs dashboard's ~160px.

Pages that get this header: Tier voordelen, Producten, Bestellingen/Winkelwagen, Facturen, Marketingmateriaal, Mijn gegevens, Admin overzicht.

The portal layout (`layout.tsx`) passes `reseller.tier` down. Each page fetches its own reseller data via `/auth/me` (already done on most pages) and passes tier to `PageHeader`.

### Files Page Bug Fix
**Problem:** `GET /files` returns `FileListOut = { accessible: MarketingFile[], locked: MarketingFile[] }` but the frontend does `apiJson<MarketingFile[]>('/files').then(setFiles)` and calls `files.map()` on an object.

**Fix:**
- Update state type: `const [files, setFiles] = useState<FileListOut | null>(null)`
- Destructure: `apiJson<FileListOut>('/files').then(setFiles)`
- Render two sections: "Beschikbaar" (accessible) then "Vergrendeld" (locked) with a section label between them

### Seed Placeholder Files
Add to `seed_local.py`:
| Name | Blob URL | Min tier |
|---|---|---|
| TSG Handleiding 2026 | mock-file.pdf | all |
| Brand Kit 2026 | mock-file.pdf | rose |
| Productpresentatie Video | mock-file.pdf | pro |
| Prijslijst Groothandel | mock-file.pdf | all |

### Minor Fixes
- **Factuurnr column:** Render `invoice.tl_invoice_id` (e.g. "INV-2026-001") instead of "—"
- **Quotation totals:** Fix `seed_local.py` to include `total_eur` on all 3 quotations (currently null)

---

## Section 2 — Cart System

### Architecture
**Pattern:** Option B — dedicated cart page. localStorage + React Context.

**`CartContext`** (`lib/cart-context.tsx`):
```ts
interface CartItem {
  product_id: string
  name: string
  unit_price: number   // tier-discounted price
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
```

- localStorage key: `tsg_cart`
- `addItem`: if product already in cart, increment quantity by 1
- `updateQty(id, 0)`: removes item
- Persisted via `useEffect` on `items` change

**Portal layout:** Wrap `<CartProvider>` around `{children}` in `layout.tsx`.

### Cart Badge
Shown in the sidebar or top of main content. Displays item count when `totalItems > 0`. Links to `/reseller/winkelwagen`. Disappears when cart is empty.

Location: top-right of `.main-content` area (not inside sidebar — keeps sidebar clean).

### Products Page Changes
- "Toevoegen aan offerte" button calls `addItem({ product_id, name, unit_price })`
- On click: button briefly changes to "✓ Toegevoegd" (500ms), then back
- Cart badge updates immediately
- No page navigation triggered

### Cart Page (`/reseller/winkelwagen`)
- `PageHeader` with eyebrow "Bestellen", title "Winkelwagen"
- Two-column layout:
  - **Left (2/3):** Line items table — product name, unit price, qty stepper (−/+), line total, remove (×) button
  - **Right (1/3):** Order summary card — subtotal, discount %, net total, "Offerte indienen" CTA button
- Empty state: gold divider, "Uw winkelwagen is leeg", link back to producten
- Qty stepper: min 1, max 999

### Checkout Flow
1. "Offerte indienen" → loading state on button
2. `POST /orders/quotation` with `{ lines: [{ product_id, quantity }] }`
3. **Success:** `clearCart()`, redirect to `/reseller/quotations`, show inline success banner ("Offerte ingediend — wij nemen zo snel mogelijk contact op") that auto-dismisses after 4 seconds. No toast library needed — a fixed-position `<div>` with CSS transition.
4. **Error:** inline error message below the CTA, button re-enables

### Bestellingen Page (`/reseller/quotations`)
Remove the inline product list (replaced by cart). Keep only:
- `PageHeader` eyebrow "Bestellen", title "Bestellingen"
- "Eerdere offertes" table: datum, status badge, totaal (with `total_eur` from fix above)
- Button: "Nieuwe offerte →" linking to `/reseller/producten`

---

## Section 3 — Page Redesigns

### Mijn gegevens
Layout:
- `PageHeader` eyebrow "Account", title "Mijn gegevens", tier shown
- Single card below, two columns divided by a vertical rule:
  - **Left — Persoonsgegevens:** Voornaam, Achternaam, Telefoonnummer (editable underline inputs matching `.field` CSS class)
  - **Right — Accountgegevens:** E-mailadres (read-only), Bedrijf (read-only), Tier badge (visual, not editable)
- Avatar initials circle integrated into the header (top-left of card, showing "DR" initials style)
- "Opslaan" CTA button bottom-right of card
- Inline success ("Wijzigingen opgeslagen") / error feedback below button

### Admin overzicht
Layout:
- `PageHeader` eyebrow "Beheer", title "Admin overzicht"
- Stat cards row (3 cards): Partners (count), Openstaande aanvragen (count), Bestanden (count)
- Navigation cards row (4 cards):
  | Card | Icon | Description | Link |
  |---|---|---|---|
  | Aanvragen beheren | 📋 | Bekijk en verwerk partneraanvragen | `/reseller/admin/applications` |
  | Partners beheren | 👥 | Beheer resellers en tier-overschrijvingen | `/reseller/admin/partners` |
  | Bestanden beheren | 📁 | Upload en beheer marketingmateriaal | `/reseller/admin/files` |
  | Account Intelligence | 🔮 | Binnenkort beschikbaar | disabled |
- Each nav card: icon, title, description, `→` arrow. "Account Intelligence" card is muted/disabled style.

---

## Section 4 — Backend Changes

### Live Invoice Fetch
**File:** `app/routers/resellers.py` — `GET /resellers/me/invoices`

Current: reads only from DB.

New flow:
1. Call `teamleader.list_invoices(customer_id=reseller.teamleader_id)`
2. Upsert results into `invoices` table (by `tl_invoice_id`)
3. Return full list from DB ordered by `invoice_date DESC`

In `LOCAL_DEV` mode: `list_invoices()` already returns `[]` — no change to behavior, seeded invoices still display.

### Seed Updates
- Add `total_eur` to all 3 quotations in `seed_local.py`
- Add 4 marketing file records (see Section 1 above)
- Use stable UUIDs (same pattern as existing seed) for idempotency

---

## Files Changed

### Frontend
- `lib/cart-context.tsx` — new
- `components/reseller/PageHeader.tsx` — new
- `app/reseller/(portal)/layout.tsx` — add CartProvider
- `app/reseller/(portal)/dashboard/page.tsx` — progress bar fill fix
- `app/reseller/(portal)/tier/page.tsx` — add PageHeader, progress bar fill fix
- `app/reseller/(portal)/products/page.tsx` — add PageHeader, cart add button
- `app/reseller/(portal)/winkelwagen/page.tsx` — new cart page
- `app/reseller/(portal)/quotations/page.tsx` — strip product list, add PageHeader
- `app/reseller/(portal)/invoices/page.tsx` — add PageHeader, fix factuurnr column
- `app/reseller/(portal)/files/page.tsx` — fix FileListOut shape, add PageHeader
- `app/reseller/(portal)/profile/page.tsx` — add PageHeader, redesign form card
- `app/reseller/(portal)/admin/page.tsx` — add PageHeader, redesign layout
- `styles/portal.css` — fix tier track CSS, add PageHeader styles, cart styles

### Backend
- `app/routers/resellers.py` — live TL fetch in invoices endpoint
- `tsg-backend/scripts/seed_local.py` — quotation totals, extra marketing files
