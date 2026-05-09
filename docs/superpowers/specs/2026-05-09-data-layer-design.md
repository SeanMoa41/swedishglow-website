# TSG Website — Data Layer Design

**Date:** 2026-05-09
**Scope:** Data ingestion, storage, and update strategy for tsg-backend (website only)

---

## Context

The Swedish Glow has existing Azure Functions that sync WooCommerce and TeamLeader data into Azure Blob Storage as CSV files. Those functions are kept intact for parallel use (Power BI etc.) and are not modified by this design.

This document covers the data layer for the new website only: how data flows from WooCommerce and TeamLeader into PostgreSQL and is served to the reseller portal and admin dashboard.

---

## Architecture

```
WooCommerce ──webhook──┐
                       ▼
TeamLeader  ──webhook──▶  FastAPI (Azure Container Apps)
                       │        ├── POST /webhooks/woocommerce  → upsert wc_orders
                       │        └── POST /webhooks/teamleader   → upsert invoices + tier recalc
                       ▼
                  PostgreSQL (Azure PostgreSQL Flexible Server)
                       ▲
                       │  nightly full sync (catch-up)
              Azure Functions
                  ├── wc_orders_sync    (nightly)
                  ├── tl_invoices_sync  (nightly)
                  └── tier_recalculate  (nightly)
```

FastAPI is the single public entry point. PostgreSQL is the single source of truth for the website. Azure Functions run nightly as a safety net only — webhooks drive the primary data flow.

---

## Data Ingestion

### Webhook flow (primary, real-time)

| Event | Endpoint | Action |
|---|---|---|
| WC order created/updated | `POST /webhooks/woocommerce` | Full upsert into `wc_orders` |
| TL invoice status change | `POST /webhooks/teamleader` | Full upsert into `invoices` → trigger tier recalc for that reseller |
| TL quotation update | `POST /webhooks/teamleader` | Upsert into `quotations` |

**Webhook handler flow:**
1. Verify `X-Webhook-Secret` header — return 401 if invalid
2. Parse event type and entity ID from payload
3. Fetch full record from WC/TL API (webhooks deliver ID only, not full data)
4. Upsert into PostgreSQL (`ON CONFLICT DO UPDATE`)
5. If TL invoice and `status == paid` → run tier recalc for that reseller inline
6. Return `200 OK` immediately (TL/WC retry on non-2xx)

**Tier recalculation on invoice paid:**
When a `teamleader` webhook delivers an invoice with `status = paid`, the handler immediately recalculates the tier for that specific reseller:
- `SUM(total_eur) WHERE status='paid' AND year = current_year` for that reseller
- Compare against `tier_thresholds`
- Upgrade tier if new tier is higher (never auto-downgrade)
- Skip if `tier_override = true`

This means a reseller's tier updates the moment their invoice is marked paid in TeamLeader.

### Nightly full sync (catch-up only)

Three Azure Functions run once per night as a safety net for anything webhooks missed:

| Function | Schedule | Action |
|---|---|---|
| `wc_orders_sync` | Nightly | Paginated pull of all WC orders updated since last sync, upsert |
| `tl_invoices_sync` | Nightly | Paginated pull of all TL invoices updated since last sync, upsert |
| `tier_recalculate` | Nightly | Full tier recalc sweep for all active resellers where `tier_override = false` |

Both paths use the same upsert logic (`ON CONFLICT DO UPDATE`) — idempotent by design.

---

## Data Storage

**Database:** Azure PostgreSQL Flexible Server

**Tables relevant to this design:**

| Table | Source | Update method |
|---|---|---|
| `wc_orders` | WooCommerce | Webhook (primary) + nightly sync |
| `invoices` | TeamLeader | Webhook (primary) + nightly sync |
| `quotations` | TeamLeader | Webhook on TL status change |
| `resellers` | Manual | Created on application approval |
| `tier_thresholds` | Manual | Seeded by admin |
| `products` | Deferred | Not synced in Phase 1 |

**Not stored here:** marketing files live in Azure Blob Storage (metadata in `marketing_files` table).

---

## Deployment Topology

| Service | Purpose | Notes |
|---|---|---|
| Azure Container Apps | FastAPI | Always-on, public HTTPS URL required for webhooks |
| Azure PostgreSQL Flexible Server | Database | Private network — not public |
| Azure Functions (Consumption plan) | Nightly ETL catch-up | Negligible cost at this volume |
| Supabase | Auth only | JWT issuer, external |

PostgreSQL is accessible only from Container Apps and Functions via connection string (not public internet).

---

## Webhook Configuration

**WooCommerce:**
Register in WC admin → Settings → Advanced → Webhooks:
- Topic: `Order created` → `https://<app>.azurecontainerapps.io/webhooks/woocommerce`
- Topic: `Order updated` → same URL
- Secret: value of `WEBHOOK_SECRET` env var

**TeamLeader:**
Register via TL API once after deployment:
```json
POST https://api.focus.teamleader.eu/webhooks.register
{
  "url": "https://<app>.azurecontainerapps.io/webhooks/teamleader",
  "types": ["invoice.updated", "quotation.updated"]
}
```

---

## What Exists vs. What Needs Building

**Already done:**
- Full PostgreSQL schema + Alembic migration
- FastAPI routers for all website endpoints
- Nightly ETL functions (wc_orders, tl_invoices, tier_recalc)
- Webhook endpoints with secret verification
- `calculate_tier()` pure function (reusable)

**Needs implementation:**

| Item | Work |
|---|---|
| `webhooks/woocommerce` | Full upsert (insert new + update existing), fetch from WC API |
| `webhooks/teamleader` | Handle new invoices + quotations, trigger async tier recalc on paid |
| Tier recalc inline | Async version of `calculate_tier()` scoped to one reseller, callable from webhook handler |
| ETL schedules | Change from every 30 min to nightly |
| Deployment config | Azure Container Apps YAML, Azure Functions deployment, environment variable wiring |

---

## Out of Scope (Phase 1)

- Product catalog sync (manual only, deferred)
- B2C checkout / Mollie integration
- Email notifications on tier upgrade
- Power BI integration (handled by separate existing pipeline)
