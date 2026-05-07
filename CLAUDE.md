# The Swedish Glow — Backend Project

## What This Is

Production backend for The Swedish Glow (theswedishglow.com), a Dutch beauty/supplement brand.
Serves two static Netlify frontends:
- **theswedishglow.com** — marketing site + B2C e-commerce (WooCommerce + Mollie iDEAL/Wero)
- **reseller-portaal** — B2B partner portal (tiered reseller program)

Full design spec: `docs/superpowers/specs/2026-05-07-tsg-backend-design.md`

---

## Architecture

```
Netlify (static frontends)
  └── HTTPS / JWT
Azure Container App — FastAPI (Python 3.12)       ← this repo
  ├── reads/writes → Azure PostgreSQL Flexible Server
  ├── auth verify → Supabase Auth
  ├── file storage → Azure Blob Storage
  └── live API calls → TeamLeader Focus API
Azure Functions (ETL, Python) — scheduled timers
  ├── wc_orders_sync     (every 30 min → PostgreSQL)
  ├── tl_invoices_sync   (every 30 min → PostgreSQL)
  └── tier_recalculate   (nightly → resellers.tier)
```

---

## Tech Stack

| Concern | Tool |
|---|---|
| Language | Python 3.12 |
| Framework | FastAPI |
| Database | Azure PostgreSQL Flexible Server |
| ORM | SQLAlchemy + Alembic |
| Auth | Supabase Auth (JWT Bearer tokens) |
| File storage | Azure Blob Storage |
| ETL | Azure Functions (timer triggers) |
| Deployment | Azure Container Apps |
| Local dev | Docker Compose (FastAPI + PostgreSQL) |

---

## Business Domain

### B2B — Reseller Portal (TeamLeader)
Resellers are companies that buy wholesale and resell TSG products. They are managed in TeamLeader Focus as companies/contacts.

**Tier system** (auto-calculated nightly from paid TL invoices YTD, or manually overridden by admin):
| Tier | Key |
|---|---|
| Pearl | pearl |
| Rose | rose |
| Pro | pro |
| Elite | elite |
| Black | black |

Each tier has a `discount_pct` and `min_revenue_eur` threshold stored in the `tier_thresholds` table (not hardcoded). Thresholds are TBD by business.

**Ordering flow:** Reseller selects products in portal → FastAPI creates a **TeamLeader quotation** (draft) → TSG staff approves in TeamLeader → becomes invoice. No payment processing on the B2B side.

**Tier recalculation logic:**
- Run nightly via Azure Function
- `SUM(invoices.total_eur) WHERE status='paid' AND invoice_date >= Jan 1 current year`
- Skip resellers where `tier_override = true` (admin has manually locked their tier)
- Upgrade only — never auto-downgrade (business decision, revisit if needed)

### B2C — WooCommerce + Mollie (Phase 1)
Individual customer orders go through the existing WooCommerce store with Mollie plugin handling iDEAL/Wero payments. Our backend only syncs completed orders into `wc_orders` for admin analytics. No custom checkout logic in Phase 1.

**Phase 2:** Replace WooCommerce with direct Mollie integration in FastAPI. `wc_orders` becomes `b2c_orders`.

---

## Authentication

Supabase Auth issues JWTs. Every API request (except public endpoints) must include:
```
Authorization: Bearer <supabase_jwt>
```

FastAPI dependency `get_current_reseller` decodes the JWT, verifies with Supabase public key, and returns the reseller DB row. Admin endpoints additionally check `reseller.is_admin = true`.

**Public endpoints (no auth):**
- `POST /auth/register-application`
- `POST /webhooks/*` (verified by `X-Webhook-Secret` header instead)

**Application approval flow:** Admin approves → FastAPI calls Supabase Admin API to create user → Supabase sends invite email with password reset link → reseller sets password and logs in.

---

## API Endpoints

### Reseller (authenticated)
```
GET   /auth/me                          Profile + tier
GET   /resellers/me/stats               Revenue YTD, orders, discount %, next tier gap
GET   /resellers/me/tier                Tier details + benefits + progress bar data
GET   /resellers/me/invoices            Paginated TL invoice history
GET   /resellers/me/quotations          Paginated quotation history
PUT   /resellers/me/profile             Update name, phone
GET   /products                         Catalog with tier-discounted net prices
POST  /orders/quotation                 Create TL quotation [{product_id, quantity}]
GET   /files                            Accessible + locked marketing files
GET   /files/{id}/download              Signed Blob URL, increments download_count
```

### Admin only (`is_admin = true`)
```
GET   /admin/applications               Pending partner applications
POST  /admin/applications/{id}/approve  Create account + assign tier
POST  /admin/applications/{id}/reject
GET   /admin/resellers                  All partners with stats
PUT   /admin/resellers/{id}/tier        Manual tier override
POST  /files                            Upload marketing file
DELETE /files/{id}                      Remove file
GET   /admin/analytics/revenue          Monthly/quarterly B2B revenue chart data
GET   /admin/analytics/b2c             WooCommerce order summary
GET   /admin/analytics/downloads        File download stats
```

### Public
```
POST  /auth/register-application        Submit partner application
POST  /webhooks/woocommerce             WC order events (secret header)
POST  /webhooks/teamleader              TL invoice status changes (secret header)
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `resellers` | Partner accounts, tier, TeamLeader link |
| `tier_thresholds` | Configurable tier revenue thresholds + discounts |
| `applications` | Pending partner applications (pre-account) |
| `products` | Product catalog with list prices |
| `quotations` | B2B orders created in TeamLeader |
| `invoices` | B2B invoices synced from TeamLeader |
| `wc_orders` | B2C orders synced from WooCommerce (analytics only) |
| `marketing_files` | Tier-gated downloadable assets |
| `file_downloads` | Download audit log |

Key field: `resellers.tier_override` — when `true`, nightly ETL skips this reseller's tier calculation (admin has manually locked it).

---

## External Integrations

### TeamLeader Focus API
- **Auth:** OAuth2 Bearer token
- **Base URL:** `https://api.focus.teamleader.eu`
- **Key endpoints:**
  - `POST /quotations.create` — requires `deal_id`, `grouped_lines` (product_id, quantity, unit_price, discount)
  - `POST /quotations.list` — filter by reseller/status
  - `POST /invoices.list` — filter by `customer.id`, `status`, `updated_since`
- **Client:** `app/integrations/teamleader.py`
- Each reseller must have a `teamleader_id` (company/contact UUID) and a linked deal for quotation creation

### WooCommerce REST API
- **Auth:** Consumer key + secret (Basic auth)
- **Base URL:** `https://theswedishglow.com/wp-json/wc/v3`
- **Key endpoints:**
  - `GET /orders` — filter by `after`, `status`, `per_page`
  - `GET /products` — product sync if needed
- **Client:** `app/integrations/woocommerce.py`
- Python: `wcapi.get("orders").json()`

### Supabase Auth
- **Client:** `app/integrations/supabase.py`
- JWT verification via Supabase public key (JWKS endpoint)
- Admin API used for: create user on application approval, invite email

### Azure Blob Storage
- Marketing files stored in a private container
- Download endpoint generates short-lived signed URLs (SAS tokens)

---

## Project Structure

```
tsg-backend/
├── app/
│   ├── main.py              # FastAPI init, routers, CORS
│   ├── config.py            # Pydantic-settings (env vars)
│   ├── database.py          # SQLAlchemy engine + session
│   ├── auth.py              # JWT dependency
│   ├── routers/
│   │   ├── resellers.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── files.py
│   │   ├── admin.py
│   │   └── webhooks.py
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   └── integrations/
│       ├── teamleader.py
│       ├── woocommerce.py
│       └── supabase.py
├── etl/                     # Azure Functions
│   ├── tl_invoices_sync/
│   ├── wc_orders_sync/
│   └── tier_recalculate/
├── migrations/              # Alembic
├── tests/
├── Dockerfile
├── docker-compose.yml       # Local: app + postgres
├── requirements.txt
└── .env.example
```

---

## Environment Variables

```
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/tsg

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...

# TeamLeader
TEAMLEADER_CLIENT_ID=...
TEAMLEADER_CLIENT_SECRET=...
TEAMLEADER_ACCESS_TOKEN=...
TEAMLEADER_REFRESH_TOKEN=...

# WooCommerce
WC_URL=https://theswedishglow.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...

# Azure Blob
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_BLOB_CONTAINER=marketing-files

# Webhooks
WEBHOOK_SECRET=...
```

---

## Local Development

```bash
docker-compose up          # starts FastAPI on :8000 + PostgreSQL on :5432
supabase start             # local Supabase Auth (optional)
alembic upgrade head       # run migrations
```

---

## Phase Plan

| Phase | Scope |
|---|---|
| **Phase 1** (current) | Reseller portal backend + WooCommerce ETL analytics |
| **Phase 2** | B2C custom checkout: direct Mollie (iDEAL/Wero), replace WooCommerce |

---

## Open Items
- Tier revenue thresholds (exact EUR amounts per tier) — decided by business
- TeamLeader deal_id mapping — each reseller needs a TL deal linked before first quotation
- Email notifications on tier upgrade — Phase 1 or 2?
- Fulfillment system — deferred to later stage
