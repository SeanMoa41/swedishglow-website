# The Swedish Glow — Platform Overview

Nordic beauty supplements brand. Two customer-facing frontends backed by a Python API connecting TeamLeader (B2B) and WooCommerce (B2C).

---

## Table of Contents

- [Platform Structure](#platform-structure)
- [Frontend 1 — Marketing Website](#frontend-1--marketing-website-theswedishglowcom)
- [Frontend 2 — Reseller Portal](#frontend-2--reseller-portal)
- [Backend API](#backend-api)
- [Database](#database)
- [ETL Pipelines](#etl-pipelines)
- [Integrations](#integrations)
- [Local Development](#local-development)
- [Deployment](#deployment)

---

## Platform Structure

```
theswedishglow.com (Netlify)          reseller-portaal (Netlify)
        │                                       │
        │ B2C shop + marketing                  │ B2B partner portal
        │                                       │
        └───────────────┬───────────────────────┘
                        │ HTTPS + JWT
                        ▼
              FastAPI — Azure Container App
                        │
          ┌─────────────┼─────────────────┐
          ▼             ▼                 ▼
   Azure PostgreSQL  Supabase Auth   Azure Blob Storage
          ▲
          │ ETL (Azure Functions)
   ┌──────┴──────┐
   │             │
TeamLeader    WooCommerce
(B2B invoices) (B2C orders)
```

**Two sales channels, one backend:**
- **B2C** — individual customers buy through WooCommerce with Mollie iDEAL/Wero payment. Orders sync into the database for admin analytics.
- **B2B** — reseller companies are managed in TeamLeader. They order through the portal, which creates TeamLeader quotations. TSG staff approves quotations → invoices.

---

## Frontend 1 — Marketing Website (theswedishglow.com)

Static HTML/CSS/JS site deployed on Netlify. Dutch-language brand and e-commerce front.

### Pages

| Page | Path | Description |
|---|---|---|
| Homepage | `/` | Hero, product grid, rituals, testimonials, FAQ |
| Shop | `/shop` | Full product catalogue |
| Marine Collageen 13.000 | `/marine-collageen-13000-kuur` | Product detail |
| Nordsilk | `/nordsilk` | Product detail |
| FREJA | `/freja` | Product detail |
| HÉRMADE | `/hermade` | Product detail |
| Over ons | `/over-ons` | Brand story + founder |
| Stories | `/stories` | Customer testimonials |
| Reseller Programma | `/reseller-programma` | Partner programme info |
| Start hier | `/start-hier` | Onboarding guide |
| Winkelwagen | `/winkelwagen` | Shopping cart |
| Mijn Account | `/mijn-account` | Customer account |
| Reseller Login | `/reseller-login` | Redirects to partner portal |
| Contact | `/contact` | Contact form |
| Nieuwsbrief | `/nieuwsbrief` | Newsletter signup |
| Levering | `/levering` | Shipping information |
| Privacy | `/privacy` | Privacy policy |
| Voorwaarden | `/voorwaarden` | Terms & conditions |
| Cookies | `/cookies` | Cookie policy |

### Product Range

| # | Product | Tag | List Price |
|---|---|---|---|
| I | Marine Collageen 13.000 | Het ochtendritueel | €59 |
| II | Nordsilk | Het haarritueel | €47 |
| III | FREJA (Plantique Omega 3) | Het basisritueel | €42 |
| IV | HÉRMADE | Het maandritueel | €39 |

### Frontend Features

**Chat Widget**
Floating live chat with keyword-matched Dutch responses. Covers product recommendations, the 100-day ritual, ingredient questions, shipping, and menopause-related queries. Falls back to email/WhatsApp for unmatched questions.

**FAQ**
Expandable `<details>` FAQ with six entries covering common questions on safety, production, and vegan options.

**Checkout (Phase 1)**
Cart shell redirects to WooCommerce store. Payment handled by WooCommerce + Mollie plugin (iDEAL, Wero).

**Checkout (Phase 2 — future)**
Custom checkout built into the Netlify frontend. FastAPI backend creates a Mollie payment link directly. WooCommerce removed.

**Design System**
```
Colours:   --bone #f6f1e8  --moss #2d3a32  --gold #b8924a  --ink #1c1c1a
Fonts:     Cormorant Garamond (display)  ·  Inter Tight (body)
```

**Forms needing backend (Phase 1):**
- Contact form → email delivery
- Newsletter signup → email service integration
- Account page → user authentication

---

## Frontend 2 — Reseller Portal

Single-page application deployed on Netlify. Dutch-language B2B partner portal for wholesale resellers.

### Authentication Screens

| Screen | Description |
|---|---|
| Login | Email + password via Supabase Auth |
| Register | New partner application form (name, company, email, phone, message) |
| Reset | Password reset — Supabase sends reset email |

### Portal Pages

| Page | Description |
|---|---|
| Dashboard | KPI stats, tier progress bar, recent orders, current + next tier benefits |
| Tier Status | All 5 tiers displayed with discounts, minimums, and benefits |
| Products | Catalogue with tier-discounted net prices |
| Orders | Quotation history with status |
| Invoices | Invoice history from TeamLeader |
| Marketing | Tier-gated downloadable assets (images, PDFs, guidelines) |
| Contact | Support contact details |
| Account | Profile editing, password reset |
| Admin | Applications, analytics, partner management *(admin only)* |

### Tier System

| Tier | Key | Behaviour |
|---|---|---|
| Pearl | `pearl` | Entry level |
| Rose | `rose` | First milestone |
| Pro | `pro` | Mid tier |
| Elite | `elite` | High performer |
| Black | `black` | Top tier, no ceiling |

- Thresholds (min revenue EUR/year) are stored in the database, not hardcoded
- **Auto-upgrade:** nightly ETL sums paid TeamLeader invoices YTD and upgrades tier if threshold crossed
- **No auto-downgrade:** tiers only go up automatically
- **Manual override:** admin can set any tier and lock it (`tier_override = true`), skipping auto-calc

### Admin Panel Features

- **Applications** — review pending partner applications, approve with tier assignment or reject
- **Partners table** — all resellers with tier, revenue, expandable detail modal
- **Revenue chart** — monthly/quarterly B2B revenue (SVG, from TeamLeader invoices)
- **Top products** — ranked by units sold
- **Tier distribution** — partner count per tier
- **Geographic data** — countries and cities
- **B2C analytics** — WooCommerce order summary
- **File downloads** — download count per marketing asset
- **Tier override** — manually lock any reseller to a specific tier

### Marketing Files (Tier-Gated)

Files are stored in Azure Blob Storage. Access is controlled by tier:

| File Tier | Accessible to |
|---|---|
| `all` | Pearl and above |
| `rose` | Rose and above |
| `pro` | Pro and above |
| `elite` | Elite and above |
| `black` | Black only |

Locked files show a lock icon with the required tier. Download links are short-lived signed Azure SAS URLs.

---

## Backend API

**FastAPI** on **Azure Container Apps** (Python 3.12). Scales to zero when idle.

### Authentication

Every request (except public endpoints) requires:
```
Authorization: Bearer <supabase_jwt>
```

Supabase Auth issues JWTs. The FastAPI `get_current_reseller` dependency decodes and verifies the token, then loads the reseller row from the database. Admin endpoints additionally check `reseller.is_admin = true`.

**Public endpoints (no auth required):**
- `POST /auth/register-application`
- `POST /webhooks/*` (verified by `X-Webhook-Secret` header)

### API Endpoints

#### Auth
```
POST  /auth/register-application    Submit partner application (public)
GET   /auth/me                      Current reseller profile + tier
```

#### Reseller Portal
```
GET   /resellers/me/stats           Revenue YTD, orders, discount %, next tier gap
GET   /resellers/me/tier            Tier details, benefits, progress percentage
GET   /resellers/me/invoices        Paginated TeamLeader invoice history
GET   /resellers/me/quotations      Paginated quotation history
PUT   /resellers/me/profile         Update name, phone, country
```

#### Products
```
GET   /products                     Catalogue with tier-discounted net prices
```

#### Orders
```
POST  /orders/quotation             Create TeamLeader quotation
                                    Body: [{product_id, quantity}]
```

#### Files
```
GET   /files                        Accessible + locked files for reseller's tier
GET   /files/{id}/download          Signed Azure Blob URL + increment download count
POST  /files              (admin)   Upload file to Blob + record in DB
DELETE /files/{id}        (admin)   Remove file from Blob + DB
```

#### Admin
```
GET   /admin/applications                       Pending partner applications
POST  /admin/applications/{id}/approve          Create Supabase user + reseller row
POST  /admin/applications/{id}/reject
GET   /admin/resellers                          All partners with stats
PUT   /admin/resellers/{id}/tier               Manual tier override
GET   /admin/analytics/revenue                  Monthly + quarterly B2B revenue
GET   /admin/analytics/b2c                      WooCommerce order summary
GET   /admin/analytics/downloads                File download stats per asset
```

#### Webhooks
```
POST  /webhooks/woocommerce         Order status changes (X-Webhook-Secret)
POST  /webhooks/teamleader          Invoice status changes (X-Webhook-Secret)
```

#### System
```
GET   /health                       {"status": "ok"}
```

---

## Database

**Azure PostgreSQL Flexible Server**

### Tables

| Table | Purpose |
|---|---|
| `resellers` | Partner accounts. Links to Supabase Auth user by UUID. |
| `tier_thresholds` | Configurable tier thresholds (min EUR, discount %, benefits). |
| `applications` | Pending partner applications before account creation. |
| `products` | Product catalogue with list prices. |
| `quotations` | B2B orders created in TeamLeader via the portal. |
| `invoices` | B2B invoices synced from TeamLeader (ETL). |
| `wc_orders` | B2C orders synced from WooCommerce (admin analytics only). |
| `marketing_files` | Tier-gated downloadable assets metadata. |
| `file_downloads` | Download audit log per reseller per file. |

### Key Fields

```sql
resellers.tier_override     -- true = admin locked, ETL skips this reseller
resellers.teamleader_id     -- TL company UUID, required for quotation creation
invoices.tl_invoice_id      -- UNIQUE — upsert key for ETL sync
wc_orders.wc_order_id       -- UNIQUE — upsert key for ETL sync
```

---

## ETL Pipelines

Three **Azure Functions** (Python, timer triggers) running alongside the existing ETL infrastructure.

### WooCommerce Order Sync
**Schedule:** every 30 minutes  
**Function:** `etl/wc_orders_sync/`

```
GET /wp-json/wc/v3/orders?after={last_sync}&status=completed
→ Upsert into wc_orders ON CONFLICT (wc_order_id) DO UPDATE
```
Used for admin B2C analytics only. No reseller-facing data.

### TeamLeader Invoice Sync
**Schedule:** every 30 minutes  
**Function:** `etl/tl_invoices_sync/`

```
POST /invoices.list  {filter: {updated_since, status: [outstanding, matched]}}
→ Match to reseller via teamleader_id
→ Upsert into invoices ON CONFLICT (tl_invoice_id) DO UPDATE
```

### Tier Recalculation
**Schedule:** nightly at 02:00  
**Function:** `etl/tier_recalculate/`

```
For each active reseller WHERE tier_override = false:
  SELECT SUM(total_eur) FROM invoices
  WHERE status = 'paid' AND YEAR(invoice_date) = current_year
→ Compare to tier_thresholds
→ Upgrade tier if threshold crossed (never downgrade)
```

---

## Integrations

### TeamLeader Focus
- **Auth:** OAuth2 Bearer token
- **Base URL:** `https://api.focus.teamleader.eu`
- **Used for:** Creating quotations (`POST /quotations.create`), syncing invoices (`POST /invoices.list`)
- **Note:** Each reseller must have a `teamleader_id` (company UUID) and a linked deal before placing their first order

### WooCommerce REST API
- **Auth:** Consumer key + secret
- **Base URL:** `https://theswedishglow.com/wp-json/wc/v3`
- **Used for:** Syncing completed B2C orders for analytics
- **Phase 2:** Replaced by direct Mollie integration when WooCommerce is removed

### Supabase Auth
- **Used for:** JWT issuance and verification, user creation on partner approval, invite emails
- **Admin API:** Called by FastAPI when approving partner applications

### Azure Blob Storage
- **Used for:** Storing tier-gated marketing files
- **Downloads:** Short-lived SAS tokens (60 min expiry), generated per-request

### Mollie (Phase 2)
- **Used for:** Direct iDEAL/Wero payment processing in custom checkout
- **Flow:** FastAPI creates payment → Mollie redirects → webhook confirms → order stored in `b2c_orders`

---

## Local Development

**Requirements:** Docker, Python 3.12, Azure Functions Core Tools

```bash
# Clone and install
cd tsg-backend
pip install -r requirements.txt

# Start PostgreSQL
docker-compose up db -d

# Copy and configure env
cp .env.example .env
# Fill in: DATABASE_URL, SUPABASE_*, TEAMLEADER_*, WC_*, AZURE_*, WEBHOOK_SECRET

# Run migrations
alembic upgrade head

# Seed development data (tiers + products)
python -m scripts.seed_dev

# Start API
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (interactive API docs)
```

**Run tests:**
```bash
pytest tests/ -v
```

**Start full stack (app + db):**
```bash
docker-compose up
```

---

## Deployment

### API — Azure Container Apps

```bash
# Build and push to Azure Container Registry
az acr build --registry tsgbackendacr --image tsg-backend:latest .

# Deploy or update Container App
az containerapp update \
  --name tsg-backend \
  --resource-group tsg-backend-rg \
  --image tsgbackendacr.azurecr.io/tsg-backend:latest
```

See `deploy.sh` for full first-time setup script.

### ETL Functions — Azure Functions

```bash
cd etl/
func azure functionapp publish tsg-etl-functions
```

### Frontends — Netlify

Both frontends deploy via Netlify drag-and-drop or Git integration. No build step required (pure HTML/CSS/JS).

---

## Environment Variables

```ini
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/tsg
DATABASE_URL_SYNC=postgresql+psycopg2://user:pass@host:5432/tsg

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=...

# TeamLeader
TEAMLEADER_CLIENT_ID=
TEAMLEADER_CLIENT_SECRET=
TEAMLEADER_ACCESS_TOKEN=
TEAMLEADER_REFRESH_TOKEN=
TEAMLEADER_DOCUMENT_TEMPLATE_ID=

# WooCommerce
WC_URL=https://theswedishglow.com
WC_CONSUMER_KEY=ck_
WC_CONSUMER_SECRET=cs_

# Azure Blob
AZURE_STORAGE_CONNECTION_STRING=
AZURE_BLOB_CONTAINER=marketing-files

# Webhooks
WEBHOOK_SECRET=change-me-in-prod
```

---

## Project Files

```
TSG Website/
├── assets/
│   ├── the-swedish-glow-website/      # Frontend 1 — marketing site
│   └── reseller-portaal-netlify-v2/   # Frontend 2 — reseller portal SPA
├── tsg-backend/                       # Backend API + ETL (to be created)
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-05-07-tsg-backend-design.md
│       └── plans/
│           └── 2026-05-07-tsg-backend-phase1.md
├── CLAUDE.md                          # Backend project reference
└── README.md                          # This file
```

---

## Contact

- **Website:** theswedishglow.com
- **Email:** info@theswedishglow.com
- **WhatsApp:** +31 6 30 53 74 52
- **Founder:** Elin Hellqvist-Moayedi
