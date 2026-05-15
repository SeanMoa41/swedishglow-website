# TSG Backend — Design Spec
**Date:** 2026-05-07  
**Status:** Approved

---

## 1. Overview

A production Python backend for The Swedish Glow (theswedishglow.com), serving two Netlify frontends:

1. **theswedishglow.com** — Dutch-language marketing + B2C e-commerce (WooCommerce + Mollie)
2. **reseller-portaal** — B2B partner SPA (tiered reseller portal)

The backend connects TeamLeader Focus (B2B invoices + quotations), WooCommerce (B2C order sync for analytics), and Supabase Auth (reseller authentication).

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Netlify (static)                                       │
│  ├── theswedishglow.com  (marketing + B2C shop shell)   │
│  └── reseller-portaal    (SPA frontend)                 │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS / JWT
┌────────────────▼────────────────────────────────────────┐
│  Azure Container App                                    │
│  FastAPI  (Python 3.12)                                 │
│  ├── /auth        (Supabase JWT verification)           │
│  ├── /resellers   (portal data: tier, stats, files)     │
│  ├── /orders      (create TeamLeader quotations)        │
│  ├── /invoices    (read from TeamLeader)                │
│  ├── /products    (product catalog)                     │
│  ├── /admin       (applications, analytics, overrides)  │
│  └── /webhooks    (WooCommerce + TeamLeader events)     │
└────────┬───────────────────┬────────────────────────────┘
         │                   │
┌────────▼───────┐   ┌───────▼──────────────────────────┐
│  Azure         │   │  Azure Functions (ETL)           │
│  PostgreSQL    │   │  ├── wc_orders_sync (30 min)      │
│  Flexible      │◄──┤  └── tl_invoices_sync (30 min)   │
│  Server        │   └──────────────────────────────────┘
└────────────────┘
         │
┌────────▼───────┐   ┌─────────────────┐
│  Supabase Auth │   │  Azure Blob      │
│  (JWT issuer + │   │  Storage         │
│   user store)  │   │  (marketing      │
└────────────────┘   │   files)         │
                     └─────────────────┘
```

### Tech Stack
| Concern | Choice |
|---|---|
| Language | Python 3.12 |
| API Framework | FastAPI |
| Database | Azure PostgreSQL Flexible Server |
| ORM | SQLAlchemy + Alembic |
| Auth | Supabase Auth (JWT) |
| File Storage | Azure Blob Storage |
| ETL | Azure Functions (Python, timer triggers) |
| Email | Resend |
| Deployment | Azure Container Apps (API) |
| Local Dev | Docker Compose (app + postgres) |

---

## 3. Database Schema

```sql
-- Reseller accounts (linked to Supabase Auth user by id)
resellers
  id                UUID PK  (= Supabase auth.users.id)
  email             TEXT UNIQUE NOT NULL
  first_name        TEXT
  last_name         TEXT
  company           TEXT
  phone             TEXT
  country           TEXT
  status            ENUM(pending, active, inactive)
  tier              ENUM(pearl, rose, pro, elite, black)  DEFAULT pearl
  tier_override     BOOLEAN  DEFAULT false
  teamleader_id     TEXT
  is_admin          BOOLEAN  DEFAULT false
  created_at        TIMESTAMPTZ
  updated_at        TIMESTAMPTZ

-- Tier thresholds (admin-configurable)
tier_thresholds
  tier              ENUM PK
  min_revenue_eur   NUMERIC
  discount_pct      NUMERIC
  benefits          JSONB

-- Partner applications (pre-account)
applications
  id                UUID PK
  first_name        TEXT
  last_name         TEXT
  company           TEXT
  email             TEXT
  phone             TEXT
  message           TEXT
  status            ENUM(pending, approved, rejected)  DEFAULT pending
  assigned_tier     ENUM  DEFAULT pearl
  reviewed_by       UUID FK resellers(id)
  created_at        TIMESTAMPTZ

-- Products (managed manually or synced from WooCommerce)
products
  id                UUID PK
  wc_product_id     INTEGER
  name              TEXT
  tag               TEXT
  description       TEXT
  list_price_eur    NUMERIC
  image_url         TEXT
  active            BOOLEAN  DEFAULT true
  sort_order        INTEGER

-- B2B quotations (created via portal → TeamLeader)
quotations
  id                UUID PK
  reseller_id       UUID FK resellers(id)
  tl_quotation_id   TEXT
  tl_deal_id        TEXT
  status            ENUM(draft, sent, accepted, rejected, expired)
  total_eur         NUMERIC
  line_items        JSONB
  created_at        TIMESTAMPTZ
  updated_at        TIMESTAMPTZ

-- B2B invoices (synced from TeamLeader ETL)
invoices
  id                UUID PK
  reseller_id       UUID FK resellers(id)
  tl_invoice_id     TEXT UNIQUE
  invoice_number    TEXT
  status            ENUM(draft, outstanding, paid, overdue)
  total_eur         NUMERIC
  invoice_date      DATE
  due_date          DATE
  synced_at         TIMESTAMPTZ

-- B2C orders (synced from WooCommerce ETL — admin analytics only)
-- Phase 2: becomes b2c_orders when WooCommerce is replaced with direct Mollie
wc_orders
  id                UUID PK
  wc_order_id       INTEGER UNIQUE
  customer_email    TEXT
  status            TEXT
  payment_method    TEXT
  total_eur         NUMERIC
  line_items        JSONB
  order_date        TIMESTAMPTZ
  synced_at         TIMESTAMPTZ

-- Marketing files (stored in Azure Blob)
marketing_files
  id                UUID PK
  name              TEXT
  blob_url          TEXT
  min_tier          ENUM(all, rose, pro, elite, black)  DEFAULT all
  file_size_bytes   BIGINT
  uploaded_by       UUID FK resellers(id)
  download_count    INTEGER  DEFAULT 0
  created_at        TIMESTAMPTZ

-- File download log
file_downloads
  id                UUID PK
  file_id           UUID FK marketing_files(id)
  reseller_id       UUID FK resellers(id)
  downloaded_at     TIMESTAMPTZ
```

---

## 4. API Endpoints

All endpoints except `/auth/register-application` and `/webhooks/*` require `Authorization: Bearer <supabase_jwt>`. Admin endpoints additionally require `reseller.is_admin = true`.

```
AUTH
  POST  /auth/register-application     Submit partner application (public)
  GET   /auth/me                       Returns reseller profile + tier

RESELLER PORTAL
  GET   /resellers/me/stats            Revenue YTD, orders YTD, discount %, next tier gap
  GET   /resellers/me/tier             Current tier + benefits + progress
  GET   /resellers/me/invoices         Paginated invoice list
  GET   /resellers/me/quotations       Paginated quotation list
  PUT   /resellers/me/profile          Update name, phone, etc.

PRODUCTS
  GET   /products                      Catalog with tier-calculated net prices

ORDERS
  POST  /orders/quotation              Create TeamLeader quotation (live TL API call)

FILES
  GET   /files                         Accessible + locked files for reseller's tier
  GET   /files/{id}/download           Signed Blob URL + increment download_count
  POST  /files                (admin)  Upload file to Blob + record in DB
  DELETE /files/{id}          (admin)  Remove file

ADMIN
  GET   /admin/applications                        List pending applications
  POST  /admin/applications/{id}/approve           Create Supabase user + reseller row
  POST  /admin/applications/{id}/reject
  GET   /admin/resellers                           All partners with tier, revenue, stats
  PUT   /admin/resellers/{id}/tier                 Manual tier override
  GET   /admin/analytics/revenue                   Monthly/quarterly B2B revenue
  GET   /admin/analytics/b2c                       WooCommerce order summary
  GET   /admin/analytics/downloads                 File download stats

WEBHOOKS  (verified by secret header, no JWT)
  POST  /webhooks/woocommerce          Order created/updated events
  POST  /webhooks/teamleader           Invoice status changes
```

---

## 5. Integration Flows

### TeamLeader — Quotation creation (live)
```
Reseller submits order in portal
  → POST /orders/quotation  [{product_id, quantity}]
  → FastAPI looks up reseller.teamleader_id + tier discount
  → POST https://api.focus.teamleader.eu/quotations.create
      deal_id, grouped_lines with unit_price + discount percentage
  → Store in quotations table (status: draft)
  → Return quotation summary to frontend
```

### TeamLeader — Invoice sync (ETL, every 30 min)
```
Azure Function timer trigger
  → POST /invoices.list  {filter: {updated_since: last_sync_ts}}
  → Upsert into invoices (ON CONFLICT tl_invoice_id DO UPDATE)
```

### WooCommerce — Order sync (ETL, every 30 min)
```
Azure Function timer trigger
  → GET /wp-json/wc/v3/orders?after=last_sync_ts&per_page=100
  → Upsert into wc_orders (ON CONFLICT wc_order_id DO UPDATE)
  → Analytics only — no reseller-facing data
```

**Phase 2 (WooCommerce replacement):**
```
Custom Netlify checkout → POST /checkout/create-payment (FastAPI → Mollie API)
Mollie webhook → POST /webhooks/mollie → confirm order → store in b2c_orders
```

### Tier recalculation (APScheduler, nightly)
```
APScheduler job inside FastAPI (02:00 AM)
  → For each active reseller WHERE tier_override = false:
      SELECT SUM(total_eur) FROM invoices
      WHERE reseller_id = ? AND status = 'paid'
      AND invoice_date >= Jan 1 current year
  → Compare to tier_thresholds
  → UPDATE resellers SET tier = new_tier
```

### Application approval
```
Admin approves in portal
  → POST /admin/applications/{id}/approve
  → FastAPI calls Supabase Admin API → create user
  → INSERT resellers (id = Supabase user id, tier = assigned_tier)
  → UPDATE applications SET status = approved
  → Supabase sends invite email (password reset link)
```

---

## 6. Project Structure

```
tsg-backend/
├── app/
│   ├── main.py                  # FastAPI app, router registration, CORS
│   ├── config.py                # Pydantic-settings from env vars
│   ├── database.py              # SQLAlchemy engine + session dependency
│   ├── auth.py                  # Supabase JWT verification dependency
│   │
│   ├── routers/
│   │   ├── resellers.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── files.py
│   │   ├── admin.py
│   │   └── webhooks.py
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── reseller.py
│   │   ├── product.py
│   │   ├── quotation.py
│   │   ├── invoice.py
│   │   ├── application.py
│   │   └── file.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── reseller.py
│   │   ├── order.py
│   │   ├── product.py
│   │   ├── file.py
│   │   └── admin.py
│   │
│   └── integrations/
│       ├── teamleader.py        # TL API client
│       ├── woocommerce.py       # WC REST client
│       ├── supabase.py          # Supabase Admin API client
    └── email.py             # Resend transactional email client
│
├── etl/                         # Azure Functions
│   ├── tl_invoices_sync/
│   └── wc_orders_sync/
│
├── migrations/                  # Alembic
│   └── versions/
│
├── tests/
│   ├── test_resellers.py
│   ├── test_orders.py
│   └── test_admin.py
│
├── Dockerfile
├── docker-compose.yml           # app + postgres for local dev
├── requirements.txt
└── .env.example
```

---

## 7. Phase Plan

| Phase | Scope |
|---|---|
| Phase 1 | Reseller portal backend: auth, tiers, products, quotations, invoices, files, admin panel, WooCommerce ETL sync for analytics |
| Phase 2 | B2C custom checkout: direct Mollie integration, replace WooCommerce, b2c_orders table |

---

## 8. Open Items
- Tier revenue thresholds (min_revenue_eur per tier) — TBD by business
- TeamLeader deal_id mapping strategy — each reseller needs a linked TL deal for quotation creation
- Email notifications on tier upgrade (Phase 1 or 2?)
- Fulfillment system integration — deferred
