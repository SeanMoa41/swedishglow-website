# Local Dev Environment Design

**Date:** 2026-05-09
**Scope:** Full end-to-end local testing with dummy data — no real external API calls

---

## Goal

Run both the Next.js frontend and FastAPI backend locally, navigate the reseller portal, create quotations, browse products, and see all resulting data — without connecting to TeamLeader, Supabase, WooCommerce, or Azure Blob Storage. Extensive logging shows everything happening in real time.

---

## Section 1: Environment Setup

### Backend — `tsg-backend/.env`

```env
LOCAL_DEV=true
DATABASE_URL=postgresql+asyncpg://tsg:tsg@localhost:5432/tsg

# Dummy values — these services are not called in LOCAL_DEV mode
SUPABASE_URL=http://localhost
SUPABASE_SERVICE_ROLE_KEY=dummy
SUPABASE_JWT_SECRET=dummy
TEAMLEADER_CLIENT_ID=dummy
TEAMLEADER_CLIENT_SECRET=dummy
TEAMLEADER_ACCESS_TOKEN=dummy
TEAMLEADER_REFRESH_TOKEN=dummy
WC_URL=http://localhost
WC_CONSUMER_KEY=dummy
WC_CONSUMER_SECRET=dummy
AZURE_STORAGE_CONNECTION_STRING=dummy
AZURE_BLOB_CONTAINER=marketing-files
WEBHOOK_SECRET=local-dev-secret

LOCAL_DEV_RESELLER_EMAIL=dev@theswedishglow.com
```

### Frontend — `tsg-frontend/.env.local`

```env
NEXT_PUBLIC_LOCAL_DEV=true
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=http://localhost
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
```

### Startup sequence

```bash
# Terminal 1 — database + backend
docker-compose up

# Terminal 2 — run migrations + seed once
alembic upgrade head
python scripts/seed_local.py

# Terminal 3 — frontend
cd tsg-frontend && npm run dev
```

Navigate directly to `http://localhost:3000/reseller/dashboard` — no login needed.

### Config change

`app/config.py` adds:

```python
local_dev: bool = False
local_dev_reseller_email: str = "dev@theswedishglow.com"
```

---

## Section 2: Backend Mock Layer

All mock logic is guarded by `settings.local_dev`. No separate module — checks are inline at the top of each method. Every mock logs a `[LOCAL_DEV]` prefixed WARNING so it's visually distinct in the log stream.

### Auth bypass — `app/auth.py`

`get_current_reseller` dependency:
- When `LOCAL_DEV=True`: skip JWT verification, query the DB for the reseller with `email == settings.local_dev_reseller_email`, return that row directly.
- When `LOCAL_DEV=False`: existing JWT + Supabase verification path unchanged.

No Authorization header is required from the frontend in LOCAL_DEV mode.

### TeamLeader mock — `app/integrations/teamleader.py`

| Method | LOCAL_DEV return |
|---|---|
| `create_quotation()` | `{"id": f"tl-mock-{uuid4()}"}` |
| `get_invoices()` | `[]` (DB has seeded data) |
| `get_quotations()` | `[]` (DB has seeded data) |
| `fetch_invoice_details()` | fake invoice dict with dummy fields |

The portal reads invoices and quotations from the DB (seeded), not from the live TL API, so returning empty lists from TL sync methods is correct.

### Azure Blob mock — `app/integrations/azure_blob.py`

`generate_download_url()` returns `http://localhost:8000/static/mock-file.pdf` instead of a real SAS token. A static route in `app/main.py` serves a placeholder PDF from `app/static/`.

---

## Section 3: Frontend Auth Bypass

### `lib/api.ts`

When `process.env.NEXT_PUBLIC_LOCAL_DEV === 'true'`:
- Skip `supabase.auth.getSession()` entirely
- Send requests with no Authorization header
- Backend accepts unauthenticated requests because `get_current_reseller` is bypassed

All portal pages use `apiJson` through this single file — no other frontend changes needed.

### `middleware.ts`

The Next.js middleware that redirects unauthenticated users to `/reseller/login` must also check `NEXT_PUBLIC_LOCAL_DEV` and skip the redirect. This allows direct navigation to any portal route without logging in.

---

## Section 4: Seed Data Script

**File:** `tsg-backend/scripts/seed_local.py`

Run once after `alembic upgrade head`. All inserts use `INSERT ... ON CONFLICT DO NOTHING` — safe to re-run.

### Reseller (1)

| Field | Value |
|---|---|
| email | dev@theswedishglow.com |
| name | Dev Reseller BV |
| tier | pearl |
| teamleader_id | `a1b2c3d4-0000-0000-0000-000000000001` |
| is_admin | true (so admin pages also work) |

### Tier thresholds (5)

| Tier | min_revenue_eur | discount_pct |
|---|---|---|
| pearl | 0 | 10 |
| rose | 5000 | 15 |
| pro | 15000 | 20 |
| elite | 40000 | 25 |
| black | 100000 | 30 |

### Products (10)

Mix of TSG product names (e.g. "Marine Collageen Poeder", "Vitamine C Complex", "Omega-3 Visolie") with realistic list prices between €15–€65.

### Invoices (5)

| # | Status | Amount | Date |
|---|---|---|---|
| 1 | paid | €1,200 | Feb current year |
| 2 | paid | €850 | Mar current year |
| 3 | paid | €2,100 | Apr current year |
| 4 | pending | €950 | May current year |
| 5 | pending | €600 | May current year |

YTD paid revenue = €4,150 → comfortably in the pearl tier.

### Quotations (3)

| # | Status |
|---|---|
| 1 | draft |
| 2 | sent |
| 3 | accepted |

### Marketing files (1)

One row in `marketing_files` — "TSG Productcatalogus 2026", accessible to all tiers.

---

## Section 5: Logging

All output goes to stdout, visible via `docker-compose logs -f`.

### Request/response middleware — `app/main.py`

FastAPI middleware logs every request and response as JSON lines:

```json
{"ts": "2026-05-09T10:00:00Z", "method": "POST", "path": "/orders/quotation", "body": {...}, "status": 201, "duration_ms": 42}
```

POST/PUT bodies are logged at request time. Status + duration logged at response time.

### SQLAlchemy echo

When `LOCAL_DEV=True`, engine created with `echo=True` — every SQL query and bound parameters printed to stdout.

### Mock call logs

Every mocked integration method logs at WARNING level:

```
[LOCAL_DEV] mocked create_quotation → tl-mock-abc123
[LOCAL_DEV] mocked generate_download_url → http://localhost:8000/static/mock-file.pdf
```

No extra libraries — Python stdlib `logging` + uvicorn built-in access log.

---

## What Is NOT Mocked

- **PostgreSQL** — real DB via Docker Compose, real SQLAlchemy queries
- **Alembic migrations** — run against real DB
- **All FastAPI business logic** — tier calculation, stats aggregation, quotation creation flow — all execute normally
- **Frontend rendering** — real Next.js pages, real API calls via `lib/api.ts`

This means the full request path (frontend → FastAPI → PostgreSQL) is exercised on every action.
