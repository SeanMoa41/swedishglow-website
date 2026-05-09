# Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up webhook-driven real-time data ingestion from WooCommerce and TeamLeader into PostgreSQL, with nightly Azure Functions as catch-up safety net.

**Architecture:** FastAPI receives webhooks from WooCommerce and TeamLeader, immediately upserts the relevant rows in PostgreSQL, and triggers tier recalculation inline when an invoice is marked paid. Three Azure Functions run nightly as a catch-up safety net. The existing Blob Storage CSV pipeline is untouched.

**Tech Stack:** FastAPI, SQLAlchemy async (2.0), PostgreSQL, Azure Container Apps, Azure Functions v2 Python timer trigger, httpx, Alembic.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `app/services/__init__.py` | Package init |
| Create | `app/services/tier.py` | Async tier recalculation logic callable from webhook handler |
| Create | `tests/test_tier_service.py` | Tests for tier service |
| Modify | `app/routers/webhooks.py` | Full webhook handlers (WC upsert, TL invoice+quotation+tier) |
| Modify | `tests/test_webhooks.py` | Expanded webhook tests |
| Modify | `etl/tl_invoices_sync/function.json` | Change schedule to nightly |
| Modify | `etl/wc_orders_sync/function.json` | Change schedule to nightly |
| Create | `etl/host.json` | Azure Functions host config |
| Create | `etl/requirements.txt` | Azure Functions Python dependencies |

---

## Task 1: Async tier recalculation service

**Files:**
- Create: `app/services/__init__.py`
- Create: `app/services/tier.py`
- Create: `tests/test_tier_service.py`

- [ ] **Step 1: Create the services package**

```bash
# In tsg-backend/
touch app/services/__init__.py
```

- [ ] **Step 2: Write failing tests**

Create `tests/test_tier_service.py`:

```python
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.tier import calculate_tier, recalculate_reseller_tier


def test_calculate_tier_returns_highest_qualifying():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": "0"},
        {"tier": "rose", "min_revenue_eur": "1000"},
        {"tier": "pro", "min_revenue_eur": "5000"},
    ]
    assert calculate_tier(0.0, thresholds) == "pearl"
    assert calculate_tier(999.99, thresholds) == "pearl"
    assert calculate_tier(1000.0, thresholds) == "rose"
    assert calculate_tier(5000.0, thresholds) == "pro"


def test_calculate_tier_empty_thresholds_returns_pearl():
    assert calculate_tier(9999.0, []) == "pearl"


@pytest.mark.asyncio
async def test_recalculate_skips_when_tier_override():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.one_or_none.return_value = MagicMock(tier="pearl", tier_override=True)
    mock_db.execute.return_value = mock_result

    await recalculate_reseller_tier(mock_db, "uuid-1")

    # Only the initial SELECT — no thresholds query, no UPDATE
    assert mock_db.execute.call_count == 1


@pytest.mark.asyncio
async def test_recalculate_skips_when_reseller_not_found():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.one_or_none.return_value = None
    mock_db.execute.return_value = mock_result

    await recalculate_reseller_tier(mock_db, "uuid-not-found")

    assert mock_db.execute.call_count == 1


@pytest.mark.asyncio
async def test_recalculate_upgrades_tier():
    mock_db = AsyncMock()

    reseller_result = MagicMock()
    reseller_result.one_or_none.return_value = MagicMock(tier="pearl", tier_override=False)

    thresholds_result = MagicMock()
    # Plain tuples work because SQLAlchemy rows support r[0] / r[1]
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000")]

    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0

    update_result = MagicMock()

    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result, update_result]

    await recalculate_reseller_tier(mock_db, "uuid-1")

    mock_db.commit.assert_called_once()


@pytest.mark.asyncio
async def test_recalculate_does_not_downgrade():
    mock_db = AsyncMock()

    reseller_result = MagicMock()
    # Currently pro, but only qualifies for rose (revenue too low)
    reseller_result.one_or_none.return_value = MagicMock(tier="pro", tier_override=False)

    thresholds_result = MagicMock()
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000"), ("pro", "5000")]

    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0

    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result]

    await recalculate_reseller_tier(mock_db, "uuid-1")

    mock_db.commit.assert_not_called()
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
cd tsg-backend
pytest tests/test_tier_service.py -v
```

Expected: `ModuleNotFoundError: No module named 'app.services.tier'`

- [ ] **Step 4: Implement the tier service**

Create `app/services/tier.py`:

```python
import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

TIER_ORDER = ["pearl", "rose", "pro", "elite", "black"]


def calculate_tier(revenue_eur: float, thresholds: list[dict]) -> str:
    sorted_thresholds = sorted(thresholds, key=lambda t: float(t["min_revenue_eur"]))
    result = "pearl"
    for t in sorted_thresholds:
        if revenue_eur >= float(t["min_revenue_eur"]):
            result = t["tier"]
    return result


async def recalculate_reseller_tier(db: AsyncSession, reseller_id: str) -> None:
    result = await db.execute(
        text("SELECT tier, tier_override FROM resellers WHERE id = :id AND status = 'active'"),
        {"id": reseller_id},
    )
    reseller = result.one_or_none()
    if not reseller or reseller.tier_override:
        return

    current_tier = reseller.tier
    current_year = datetime.utcnow().year

    thresholds_rows = await db.execute(
        text("SELECT tier, min_revenue_eur FROM tier_thresholds ORDER BY min_revenue_eur")
    )
    thresholds = [{"tier": r[0], "min_revenue_eur": r[1]} for r in thresholds_rows.all()]

    revenue_row = await db.execute(
        text("""
            SELECT COALESCE(SUM(total_eur), 0)
            FROM invoices
            WHERE reseller_id = :id
            AND status = 'paid'
            AND EXTRACT(year FROM invoice_date) = :year
        """),
        {"id": reseller_id, "year": current_year},
    )
    revenue = float(revenue_row.scalar())

    new_tier = calculate_tier(revenue, thresholds)

    current_idx = TIER_ORDER.index(current_tier) if current_tier in TIER_ORDER else 0
    new_idx = TIER_ORDER.index(new_tier) if new_tier in TIER_ORDER else 0
    if new_idx <= current_idx:
        return

    await db.execute(
        text("UPDATE resellers SET tier = :tier, updated_at = now() WHERE id = :id"),
        {"tier": new_tier, "id": reseller_id},
    )
    await db.commit()
    logging.info(f"Tier upgraded: reseller {reseller_id} → {new_tier}")
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
pytest tests/test_tier_service.py -v
```

Expected: 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/services/__init__.py app/services/tier.py tests/test_tier_service.py
git commit -m "feat: add async tier recalculation service"
```

---

## Task 2: TeamLeader webhook handler — invoice + quotation

**Files:**
- Modify: `app/routers/webhooks.py`
- Modify: `tests/test_webhooks.py`

- [ ] **Step 1: Write failing tests**

Replace the contents of `tests/test_webhooks.py`:

```python
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.config import settings
from app.main import app
from app.database import get_db


@pytest.mark.asyncio
async def test_webhook_wrong_secret_returns_401(client):
    response = await client.post(
        "/webhooks/woocommerce",
        json={"action": "woocommerce_order_status_changed"},
        headers={"X-Webhook-Secret": "wrong-secret"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_teamleader_invoice_webhook_upserts(client):
    """TL invoice.updated webhook fetches full invoice from TL API and upserts it."""
    mock_invoice = {
        "id": "tl-inv-1",
        "status": "outstanding",
        "invoice_number": {"number": "2026/001"},
        "total": {"tax_inclusive": {"amount": 500.0}},
        "invoice_date": "2026-05-01",
        "due_on": "2026-06-01",
        "invoicee": {"customer": {"id": "company-1", "type": "company"}},
    }

    async def override_db():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = "reseller-uuid-1"
        mock_db.execute.return_value = mock_result
        yield mock_db

    app.dependency_overrides[get_db] = override_db

    with patch("app.routers.webhooks._fetch_tl_invoice", new=AsyncMock(return_value=mock_invoice)):
        try:
            response = await client.post(
                "/webhooks/teamleader",
                json={"type": "invoice.updated", "payload": {"id": "tl-inv-1"}},
                headers={"X-Webhook-Secret": settings.webhook_secret},
            )
        finally:
            app.dependency_overrides.clear()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_teamleader_paid_invoice_triggers_tier_recalc(client):
    """Invoice with matched (=paid) status triggers tier recalculation for that reseller."""
    mock_invoice = {
        "id": "tl-inv-2",
        "status": "matched",
        "invoice_number": {"number": "2026/002"},
        "total": {"tax_inclusive": {"amount": 1500.0}},
        "invoice_date": "2026-05-01",
        "due_on": "2026-06-01",
        "invoicee": {"customer": {"id": "company-1", "type": "company"}},
    }

    async def override_db():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = "reseller-uuid-1"
        mock_db.execute.return_value = mock_result
        yield mock_db

    app.dependency_overrides[get_db] = override_db

    with (
        patch("app.routers.webhooks._fetch_tl_invoice", new=AsyncMock(return_value=mock_invoice)),
        patch("app.routers.webhooks.recalculate_reseller_tier", new=AsyncMock()) as mock_tier,
    ):
        try:
            response = await client.post(
                "/webhooks/teamleader",
                json={"type": "invoice.updated", "payload": {"id": "tl-inv-2"}},
                headers={"X-Webhook-Secret": settings.webhook_secret},
            )
        finally:
            app.dependency_overrides.clear()

    assert response.status_code == 200
    mock_tier.assert_called_once()


@pytest.mark.asyncio
async def test_teamleader_quotation_webhook_updates_status(client):
    """TL quotation.updated webhook updates quotation status in db."""
    mock_quotation = {"id": "tl-quot-1", "status": "accepted"}

    async def override_db():
        yield AsyncMock()

    app.dependency_overrides[get_db] = override_db

    with patch("app.routers.webhooks._fetch_tl_quotation", new=AsyncMock(return_value=mock_quotation)):
        try:
            response = await client.post(
                "/webhooks/teamleader",
                json={"type": "quotation.updated", "payload": {"id": "tl-quot-1"}},
                headers={"X-Webhook-Secret": settings.webhook_secret},
            )
        finally:
            app.dependency_overrides.clear()

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_teamleader_webhook_unknown_reseller_returns_200(client):
    """Invoice for unknown TL company ID is silently ignored — returns 200."""
    mock_invoice = {
        "id": "tl-inv-3",
        "status": "outstanding",
        "invoice_number": "2026/003",
        "total": {"tax_inclusive": {"amount": 100.0}},
        "invoice_date": "2026-05-01",
        "due_on": "2026-06-01",
        "invoicee": {"customer": {"id": "unknown-company", "type": "company"}},
    }

    async def override_db():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None  # not in our DB
        mock_db.execute.return_value = mock_result
        yield mock_db

    app.dependency_overrides[get_db] = override_db

    with patch("app.routers.webhooks._fetch_tl_invoice", new=AsyncMock(return_value=mock_invoice)):
        try:
            response = await client.post(
                "/webhooks/teamleader",
                json={"type": "invoice.updated", "payload": {"id": "tl-inv-3"}},
                headers={"X-Webhook-Secret": settings.webhook_secret},
            )
        finally:
            app.dependency_overrides.clear()

    assert response.status_code == 200
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pytest tests/test_webhooks.py -v
```

Expected: new TL tests fail because the handler doesn't call `_fetch_tl_invoice` / `_fetch_tl_quotation` / `recalculate_reseller_tier` yet.

- [ ] **Step 3: Replace `app/routers/webhooks.py` with full implementation**

```python
import json
import logging
import httpx
from fastapi import APIRouter, Request, HTTPException, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional

from app.config import settings
from app.database import get_db
from app.services.tier import recalculate_reseller_tier

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

TL_BASE = "https://api.focus.teamleader.eu"
TL_STATUS_MAP = {
    "draft": "draft",
    "outstanding": "outstanding",
    "matched": "paid",
    "overdue": "overdue",
}
TL_QUOTATION_STATUS_MAP = {
    "draft": "draft",
    "sent": "sent",
    "accepted": "accepted",
    "refused": "rejected",
    "expired": "expired",
}


def _verify_secret(secret: Optional[str]) -> None:
    if secret != settings.webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")


async def _fetch_tl_invoice(tl_id: str) -> Optional[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TL_BASE}/invoices.info",
            json={"id": tl_id},
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
    if not resp.is_success:
        return None
    return resp.json().get("data")


async def _fetch_tl_quotation(tl_id: str) -> Optional[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TL_BASE}/quotations.info",
            json={"id": tl_id},
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
    if not resp.is_success:
        return None
    return resp.json().get("data")


@router.post("/woocommerce")
async def woocommerce_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    order_id = payload.get("id")
    if not order_id:
        return {"received": True}
    try:
        await db.execute(
            text("""
                INSERT INTO wc_orders (
                    id, wc_order_id, customer_email, status, payment_method,
                    total_eur, line_items, order_date, synced_at
                )
                VALUES (
                    gen_random_uuid(), :wc_id, :email, :status, :payment,
                    :total, :items::jsonb, :order_date, now()
                )
                ON CONFLICT (wc_order_id) DO UPDATE SET
                    status = EXCLUDED.status,
                    total_eur = EXCLUDED.total_eur,
                    synced_at = now()
            """),
            {
                "wc_id": order_id,
                "email": payload.get("billing", {}).get("email", ""),
                "status": payload.get("status", ""),
                "payment": payload.get("payment_method", ""),
                "total": float(payload.get("total") or 0),
                "items": json.dumps(payload.get("line_items", [])),
                "order_date": payload.get("date_created"),
            },
        )
        await db.commit()
    except Exception:
        logging.exception("WC webhook upsert failed for order %s", order_id)
    return {"received": True}


@router.post("/teamleader")
async def teamleader_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    event_type = payload.get("type", "")
    tl_payload = payload.get("payload")
    entity_id = tl_payload.get("id") if isinstance(tl_payload, dict) else payload.get("id")
    if not entity_id:
        return {"received": True}

    try:
        if "invoice" in event_type:
            await _handle_tl_invoice(db, entity_id)
        elif "quotation" in event_type:
            await _handle_tl_quotation(db, entity_id)
    except Exception:
        logging.exception("TL webhook processing failed for %s %s", event_type, entity_id)
    return {"received": True}


async def _handle_tl_invoice(db: AsyncSession, tl_id: str) -> None:
    data = await _fetch_tl_invoice(tl_id)
    if not data:
        return

    customer = data.get("invoicee", {}).get("customer", {})
    tl_company_id = customer.get("id")

    reseller_row = await db.execute(
        text("SELECT id FROM resellers WHERE teamleader_id = :tl_id"),
        {"tl_id": tl_company_id},
    )
    reseller_id = reseller_row.scalar_one_or_none()
    if not reseller_id:
        return

    total = data.get("total", {})
    total_eur = float(total.get("tax_inclusive", {}).get("amount", 0)) if isinstance(total, dict) else float(total or 0)

    invoice_number = data.get("invoice_number")
    if isinstance(invoice_number, dict):
        invoice_number = invoice_number.get("number")

    status = TL_STATUS_MAP.get(data.get("status", "outstanding"), "outstanding")

    await db.execute(
        text("""
            INSERT INTO invoices (
                id, reseller_id, tl_invoice_id, invoice_number,
                status, total_eur, invoice_date, due_date, synced_at
            )
            VALUES (
                gen_random_uuid(), :reseller_id, :tl_id, :number,
                :status, :total, :inv_date, :due_date, now()
            )
            ON CONFLICT (tl_invoice_id) DO UPDATE SET
                status = EXCLUDED.status,
                total_eur = EXCLUDED.total_eur,
                synced_at = now()
        """),
        {
            "reseller_id": str(reseller_id),
            "tl_id": tl_id,
            "number": invoice_number,
            "status": status,
            "total": total_eur,
            "inv_date": data.get("invoice_date"),
            "due_date": data.get("due_on"),
        },
    )
    await db.commit()

    if status == "paid":
        await recalculate_reseller_tier(db, str(reseller_id))


async def _handle_tl_quotation(db: AsyncSession, tl_id: str) -> None:
    data = await _fetch_tl_quotation(tl_id)
    if not data:
        return
    status = TL_QUOTATION_STATUS_MAP.get(data.get("status", "draft"), "draft")
    await db.execute(
        text("UPDATE quotations SET status = :status, updated_at = now() WHERE tl_quotation_id = :tl_id"),
        {"status": status, "tl_id": tl_id},
    )
    await db.commit()
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pytest tests/test_webhooks.py -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/routers/webhooks.py tests/test_webhooks.py
git commit -m "feat: full TL webhook handler with invoice upsert, quotation sync, tier recalc"
```

---

## Task 3: WooCommerce webhook — full upsert test coverage

**Files:**
- Modify: `tests/test_webhooks.py`

The WC handler is already complete from Task 2. This task adds tests covering the new upsert behavior.

- [ ] **Step 1: Add WC tests to `tests/test_webhooks.py`**

Append to the end of `tests/test_webhooks.py`:

```python
@pytest.mark.asyncio
async def test_woocommerce_webhook_upserts_full_order(client):
    """WC webhook with full order payload upserts into wc_orders."""
    async def override_db():
        yield AsyncMock()

    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/webhooks/woocommerce",
            json={
                "id": 1001,
                "status": "completed",
                "billing": {"email": "customer@example.com"},
                "payment_method": "ideal",
                "total": "149.95",
                "line_items": [{"product_id": 5, "quantity": 1, "name": "NordSilk"}],
                "date_created": "2026-05-09T12:00:00",
            },
            headers={"X-Webhook-Secret": settings.webhook_secret},
        )
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_woocommerce_webhook_missing_id_is_ignored(client):
    """Payload without order id returns 200 and does nothing."""
    async def override_db():
        yield AsyncMock()

    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/webhooks/woocommerce",
            json={"status": "completed"},
            headers={"X-Webhook-Secret": settings.webhook_secret},
        )
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
```

- [ ] **Step 2: Run tests**

```bash
pytest tests/test_webhooks.py -v
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/test_webhooks.py
git commit -m "test: add WC webhook upsert coverage"
```

---

## Task 4: Change ETL schedules to nightly

**Files:**
- Modify: `etl/tl_invoices_sync/function.json`
- Modify: `etl/wc_orders_sync/function.json`

Both are currently `0 */30 * * * *` (every 30 min). Change to `0 0 2 * * *` (2:00 AM UTC daily), matching the tier recalculate schedule already in place.

- [ ] **Step 1: Update `etl/tl_invoices_sync/function.json`**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 2 * * *"
    }
  ]
}
```

- [ ] **Step 2: Update `etl/wc_orders_sync/function.json`**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 2 * * *"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add etl/tl_invoices_sync/function.json etl/wc_orders_sync/function.json
git commit -m "chore: change ETL sync schedules from 30-min to nightly"
```

---

## Task 5: Azure Functions host config

**Files:**
- Create: `etl/host.json`
- Create: `etl/requirements.txt`

Azure Functions requires `host.json` at the function app root and a `requirements.txt` for Python dependencies.

- [ ] **Step 1: Create `etl/host.json`**

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.*, 4.0.0)"
  }
}
```

- [ ] **Step 2: Create `etl/requirements.txt`**

```
azure-functions==1.21.3
sqlalchemy==2.0.36
requests==2.32.3
psycopg2-binary==2.9.10
```

- [ ] **Step 3: Commit**

```bash
git add etl/host.json etl/requirements.txt
git commit -m "chore: add Azure Functions host.json and requirements"
```

---

## Task 6: Deploy to Azure

All commands use Azure CLI (`az`). Run from `tsg-backend/`. Replace `<REGION>` with e.g. `westeurope`, `<SUFFIX>` with a short unique string (e.g. `tsg01`).

- [ ] **Step 1: Create resource group**

```bash
az group create --name rg-tsg --location <REGION>
```

Expected: `"provisioningState": "Succeeded"`

- [ ] **Step 2: Create Azure Container Registry**

```bash
az acr create --resource-group rg-tsg --name acrtsg<SUFFIX> --sku Basic --admin-enabled true
```

Note the `loginServer` value (e.g. `acrtsg01.azurecr.io`).

- [ ] **Step 3: Build and push FastAPI Docker image**

```bash
az acr build --registry acrtsg<SUFFIX> --image tsg-backend:latest .
```

Expected: Build completes, image visible at `acrtsg<SUFFIX>.azurecr.io/tsg-backend:latest`

- [ ] **Step 4: Create Azure PostgreSQL Flexible Server**

```bash
az postgres flexible-server create \
  --resource-group rg-tsg \
  --name pg-tsg-<SUFFIX> \
  --location <REGION> \
  --admin-user tsgadmin \
  --admin-password "<STRONG_PASSWORD>" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --public-access None
```

Note the server FQDN shown in output (e.g. `pg-tsg-01.postgres.database.azure.com`).

- [ ] **Step 5: Create the database and run Alembic migrations**

```bash
# Allow your IP temporarily to run migrations
az postgres flexible-server firewall-rule create \
  --resource-group rg-tsg \
  --name pg-tsg-<SUFFIX> \
  --rule-name AllowMyIP \
  --start-ip-address <YOUR_IP> \
  --end-ip-address <YOUR_IP>

# Set DATABASE_URL to the new server and run migrations
DATABASE_URL="postgresql+asyncpg://tsgadmin:<PASSWORD>@pg-tsg-<SUFFIX>.postgres.database.azure.com/tsg?ssl=require" \
DATABASE_URL_SYNC="postgresql://tsgadmin:<PASSWORD>@pg-tsg-<SUFFIX>.postgres.database.azure.com/tsg?ssl=require" \
  alembic upgrade head

# Remove the firewall rule after migration
az postgres flexible-server firewall-rule delete \
  --resource-group rg-tsg \
  --name pg-tsg-<SUFFIX> \
  --rule-name AllowMyIP --yes
```

- [ ] **Step 6: Create Container Apps environment**

```bash
az containerapp env create \
  --name env-tsg \
  --resource-group rg-tsg \
  --location <REGION>
```

- [ ] **Step 7: Deploy FastAPI as a Container App**

```bash
az containerapp create \
  --name tsg-backend \
  --resource-group rg-tsg \
  --environment env-tsg \
  --image acrtsg<SUFFIX>.azurecr.io/tsg-backend:latest \
  --registry-server acrtsg<SUFFIX>.azurecr.io \
  --registry-username $(az acr credential show --name acrtsg<SUFFIX> --query username -o tsv) \
  --registry-password $(az acr credential show --name acrtsg<SUFFIX> --query "passwords[0].value" -o tsv) \
  --target-port 8000 \
  --ingress external \
  --min-replicas 1 \
  --env-vars \
    DATABASE_URL="postgresql+asyncpg://tsgadmin:<PASSWORD>@pg-tsg-<SUFFIX>.postgres.database.azure.com/tsg?ssl=require" \
    SUPABASE_URL="<SUPABASE_URL>" \
    SUPABASE_SERVICE_ROLE_KEY="<SUPABASE_SERVICE_ROLE_KEY>" \
    SUPABASE_JWT_SECRET="<SUPABASE_JWT_SECRET>" \
    TEAMLEADER_ACCESS_TOKEN="<TL_ACCESS_TOKEN>" \
    WC_URL="https://theswedishglow.com" \
    WC_CONSUMER_KEY="<WC_KEY>" \
    WC_CONSUMER_SECRET="<WC_SECRET>" \
    AZURE_STORAGE_CONNECTION_STRING="<AZURE_BLOB_CONN_STR>" \
    WEBHOOK_SECRET="<WEBHOOK_SECRET>"
```

Note the FQDN shown in output — this is your public API URL (e.g. `https://tsg-backend.<hash>.westeurope.azurecontainerapps.io`).

- [ ] **Step 8: Create Azure Functions app and deploy ETL**

```bash
az storage account create \
  --name satsg<SUFFIX> \
  --resource-group rg-tsg \
  --location <REGION> \
  --sku Standard_LRS

az functionapp create \
  --resource-group rg-tsg \
  --consumption-plan-location <REGION> \
  --runtime python \
  --runtime-version 3.12 \
  --functions-version 4 \
  --name func-tsg-<SUFFIX> \
  --storage-account satsg<SUFFIX>

# Set env vars on the Function App
az functionapp config appsettings set \
  --name func-tsg-<SUFFIX> \
  --resource-group rg-tsg \
  --settings \
    DATABASE_URL_SYNC="postgresql://tsgadmin:<PASSWORD>@pg-tsg-<SUFFIX>.postgres.database.azure.com/tsg?ssl=require" \
    TEAMLEADER_ACCESS_TOKEN="<TL_ACCESS_TOKEN>" \
    WC_URL="https://theswedishglow.com" \
    WC_CONSUMER_KEY="<WC_KEY>" \
    WC_CONSUMER_SECRET="<WC_SECRET>"

# Deploy from the etl/ directory
cd etl
func azure functionapp publish func-tsg-<SUFFIX>
cd ..
```

Expected: 3 functions shown as deployed (`tl_invoices_sync`, `wc_orders_sync`, `tier_recalculate`).

- [ ] **Step 9: Register webhooks in WooCommerce**

In WordPress admin → WooCommerce → Settings → Advanced → Webhooks → Add webhook:

| Field | Value |
|---|---|
| Name | TSG Backend — Order created |
| Status | Active |
| Topic | Order created |
| Delivery URL | `https://<APP_FQDN>/webhooks/woocommerce` |
| Secret | `<WEBHOOK_SECRET>` (same value as env var) |

Repeat for **Order updated**.

Note: WooCommerce sends the `Secret` value in the `X-WC-Webhook-Signature` header as an HMAC. For Phase 1, configure WC to send it as a custom header instead by adding this to `functions.php` in the active theme:

```php
add_filter('woocommerce_webhook_http_request_args', function($http_args, $webhook) {
    $http_args['headers']['X-Webhook-Secret'] = get_option('tsg_webhook_secret');
    return $http_args;
}, 10, 2);
```

Set `tsg_webhook_secret` in WP Options to match `WEBHOOK_SECRET`.

- [ ] **Step 10: Register webhooks in TeamLeader**

Run once after deployment (replace `<APP_FQDN>` and `<TL_ACCESS_TOKEN>`):

```bash
curl -X POST https://api.focus.teamleader.eu/webhooks.register \
  -H "Authorization: Bearer <TL_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<APP_FQDN>/webhooks/teamleader",
    "types": ["invoice.updated", "quotation.updated"]
  }'
```

Expected: `200 OK` with the registered webhook ID.

- [ ] **Step 11: Smoke test**

```bash
# Health check
curl https://<APP_FQDN>/health
# Expected: {"status":"ok"}

# Trigger a test webhook (replace values)
curl -X POST https://<APP_FQDN>/webhooks/woocommerce \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: <WEBHOOK_SECRET>" \
  -d '{"id": 9999, "status": "completed", "billing": {"email": "test@test.com"}, "total": "10.00", "line_items": []}'
# Expected: {"received":true}
```

- [ ] **Step 12: Commit deployment notes**

```bash
# In repo root
git add .
git commit -m "chore: deployment complete — Azure Container Apps + Functions"
```
