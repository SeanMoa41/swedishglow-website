import pytest
from app.config import settings
from app.main import app
from app.database import get_db
from unittest.mock import AsyncMock, MagicMock


@pytest.mark.asyncio
async def test_webhook_wrong_secret_returns_401(client):
    response = await client.post(
        "/webhooks/woocommerce",
        json={"action": "woocommerce_order_status_changed"},
        headers={"X-Webhook-Secret": "wrong-secret"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_woocommerce_webhook_valid_secret(client):
    async def override_db():
        mock_db = AsyncMock()
        mock_db.execute = AsyncMock()
        mock_db.commit = AsyncMock()
        yield mock_db

    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/webhooks/woocommerce",
            json={"id": 999, "status": "completed"},
            headers={"X-Webhook-Secret": settings.webhook_secret},
        )
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
