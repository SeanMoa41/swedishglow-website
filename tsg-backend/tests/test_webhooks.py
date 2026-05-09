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
