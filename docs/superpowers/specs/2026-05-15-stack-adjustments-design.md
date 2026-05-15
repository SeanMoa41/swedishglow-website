# Stack Adjustments Design — 2026-05-15

## Context

Architectural review session identified four improvements to the existing TSG backend stack. This spec covers all four changes. Subscription service was explicitly deferred — it requires its own design spec before implementation.

---

## Change 1: Move `tier_recalculate` from Azure Function to APScheduler

### Problem
Three Azure Functions exist: `wc_orders_sync`, `tl_invoices_sync`, `tier_recalculate`. The third is unnecessary infrastructure — the business logic already lives in `app/services/tier.py` and the job runs once nightly. Running it as an Azure Function adds a deployed service, a separate deployment pipeline step, and a separate failure domain for something trivially schedulable inside FastAPI.

### Decision
Use APScheduler inside FastAPI to run `recalculate_reseller_tier` nightly at 02:00 AM. Delete `etl/tier_recalculate/` entirely.

### Implementation

**`requirements.txt`** — add `apscheduler>=3.10`

**`app/main.py`** — register scheduler in lifespan:
```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.tier import recalculate_all_tiers

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(recalculate_all_tiers, "cron", hour=2, minute=0)
    scheduler.start()
    yield
    scheduler.shutdown()
```

**`app/services/tier.py`** — add `recalculate_all_tiers()` async wrapper that opens its own DB session and calls the existing `recalculate_reseller_tier` per active reseller. The existing per-reseller logic is unchanged.

**Delete:** `etl/tier_recalculate/` directory.

**`infra/`** — remove `tier_recalculate` from Pulumi Functions resource.

**`.github/workflows/etl.yml`** — remove `tier_recalculate` from deploy matrix. Only `wc_orders_sync` and `tl_invoices_sync` remain.

### Risk
If the FastAPI container restarts exactly at 02:00 AM, the nightly run is skipped until the next night. Acceptable: tier recalculation is upgrade-only and idempotent — a one-day delay has no business impact.

---

## Change 2: Resend Transactional Email Integration

### Problem
No email service is wired into the backend. Account approvals, tier upgrades, and B2B order confirmations have no notification mechanism beyond Supabase's invite email.

### Decision
Add Resend as the transactional email provider. Emails sent as FastAPI `BackgroundTask` — never block API responses. Branded HTML templates in Dutch using Jinja2.

### Templates

| Template file | Trigger | Call site |
|---|---|---|
| `account_approved.html` | Admin approves partner application | `app/routers/auth.py` |
| `tier_upgraded.html` | Nightly recalc upgrades a reseller's tier | `app/services/tier.py` |
| `quotation_confirmed.html` | Reseller places B2B order | `app/routers/orders.py` |

Templates live in `app/templates/email/` as Jinja2 `.html` files. Rendered at send time with context variables (reseller name, tier name, order total, etc.).

**B2C note:** WooCommerce webhook (`app/routers/webhooks.py`) gets a logging hook only — no email sent, WooCommerce handles B2C order confirmation itself. The hook is a Phase 2 expansion point for when WooCommerce is replaced with direct Mollie.

From address: `noreply@theswedishglow.com`

### New files
- `app/integrations/email.py` — Resend SDK wrapper with `send_email(to, subject, template, context)` helper
- `app/templates/email/*.html` — four Jinja2 templates

### Config
- New env var: `RESEND_API_KEY`
- New field in `app/config.py`: `resend_api_key: str`
- Add `resend` and `jinja2` to `requirements.txt`

### B2C note
WooCommerce already sends order confirmation to B2C customers. The stub in `webhooks.py` is a logging hook only — gives us a call site to expand in Phase 2 when WooCommerce is replaced with direct Mollie.

---

## Change 3: Tier-Based Auto-Approve for Quotations

### Problem
All reseller quotations currently require manual TSG staff review in TeamLeader before becoming an invoice. This is a bottleneck at scale and unnecessary for high-trust tiers.

### Decision
Add `auto_approve` boolean to `tier_thresholds`. Elite and Black tiers auto-approve on quotation creation. Lower tiers continue through manual review.

### Database

New column on `tier_thresholds`:
```sql
ALTER TABLE tier_thresholds ADD COLUMN auto_approve BOOLEAN NOT NULL DEFAULT FALSE;
```

Initial values:
| Tier | auto_approve |
|---|---|
| pearl | false |
| rose | false |
| pro | false |
| elite | true |
| black | true |

New Alembic migration: `0002_add_auto_approve_to_tier_thresholds.py`

Update `TierThreshold` SQLAlchemy model to include `auto_approve: bool`.

Update seed scripts (`seed_dev.py`, `seed_local.py`) to set correct `auto_approve` values.

### Quotation flow change (`app/routers/orders.py`)

After creating the TL quotation:
- `auto_approve = False` → save quotation with `status="draft"` (existing behaviour)
- `auto_approve = True` → call `teamleader.accept_quotation(tl_quotation_id)`, save quotation with `status="accepted"`, send `quotation_confirmed` email immediately

New TeamLeader client method: `teamleader.accept_quotation(tl_quotation_id: str)` — calls the TL quotations accept endpoint. **Verify exact endpoint path against TL API docs before implementation** (`POST /quotations.accept` is the expected path but must be confirmed).

### Admin control
`auto_approve` is a DB field — admins can override per tier via direct DB edit or future admin panel field. No hardcoded tier names in logic.

---

## Change 4: Documentation Updates

### `CLAUDE.md`
- ETL section: remove `tier_recalculate` Azure Function, add APScheduler note to FastAPI block
- Integrations: add Resend to external services table
- `tier_thresholds` table description: add `auto_approve` field
- Azure Functions section: update to reflect 2 functions only

### `docs/superpowers/specs/2026-05-07-tsg-backend-design.md`
- Sync ETL section: 2 Azure Functions, not 3
- Add Resend to integrations table

---

## Out of Scope

**Subscription service** — deferred. Requires dedicated design covering Mollie recurring payments (mandate flow, failed payment retries, dunning), reseller self-service UI, and subscription data model. To be designed as a separate spec before any implementation begins.

---

## Files Changed Summary

| File | Change |
|---|---|
| `requirements.txt` | Add `apscheduler`, `resend`, `jinja2` |
| `app/config.py` | Add `resend_api_key` |
| `app/main.py` | Add APScheduler lifespan setup |
| `app/services/tier.py` | Add `recalculate_all_tiers()` async wrapper |
| `app/integrations/email.py` | New — Resend wrapper |
| `app/templates/email/*.html` | New — 3 Jinja2 email templates (account_approved, tier_upgraded, quotation_confirmed) |
| `app/routers/auth.py` | Send `account_approved` email on approval |
| `app/routers/orders.py` | Auto-approve logic + `quotation_confirmed` email |
| `app/routers/webhooks.py` | B2C email stub hook |
| `app/models/reseller.py` | Add `auto_approve` to `TierThreshold` model |
| `app/integrations/teamleader.py` | Add `accept_quotation()` method |
| `migrations/versions/0002_*.py` | New — add `auto_approve` column |
| `scripts/seed_dev.py` | Set `auto_approve` values |
| `scripts/seed_local.py` | Set `auto_approve` values |
| `etl/tier_recalculate/` | Delete entirely |
| `infra/` | Remove tier_recalculate Function resource |
| `.github/workflows/etl.yml` | Remove tier_recalculate from deploy matrix |
| `CLAUDE.md` | Sync architecture description |
| `docs/superpowers/specs/2026-05-07-tsg-backend-design.md` | Sync ETL + integrations sections |
