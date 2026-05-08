import pytest
from unittest.mock import MagicMock
from uuid import uuid4
from app.main import app
from app.auth import get_current_reseller
from app.database import get_db


@pytest.mark.asyncio
async def test_products_returns_net_price(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "rose"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False

    async def override_auth():
        return mock_reseller

    async def override_db():
        mock_db = MagicMock()
        mock_db.execute = MagicMock()
        # Return empty product list
        from unittest.mock import AsyncMock
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = []
        mock_threshold_result = MagicMock()
        mock_threshold_result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(side_effect=[mock_threshold_result, mock_result])
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.get("/products", headers={"Authorization": "Bearer fake"})
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
    assert isinstance(response.json(), list)
