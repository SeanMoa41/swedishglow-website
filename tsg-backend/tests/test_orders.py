import pytest
from unittest.mock import MagicMock, AsyncMock
from uuid import uuid4
from app.main import app
from app.auth import get_current_reseller
from app.database import get_db


@pytest.mark.asyncio
async def test_create_quotation_missing_teamleader_id_raises_400(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "rose"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False
    mock_reseller.teamleader_id = None  # not linked to TL

    async def override_auth():
        return mock_reseller

    async def override_db():
        yield MagicMock()

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.post(
            "/orders/quotation",
            json={"lines": [{"product_id": str(uuid4()), "quantity": 2}]},
            headers={"Authorization": "Bearer fake"},
        )
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 400
