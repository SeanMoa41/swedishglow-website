import pytest
from uuid import uuid4
from app.main import app
from app.auth import get_current_reseller
from app.database import get_db
from unittest.mock import MagicMock, AsyncMock


@pytest.mark.asyncio
async def test_files_list_returns_accessible_and_locked(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "pearl"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False

    async def override_auth():
        return mock_reseller

    async def override_db():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db.execute = AsyncMock(return_value=mock_result)
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.get("/files", headers={"Authorization": "Bearer fake"})
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
    assert "accessible" in response.json()
    assert "locked" in response.json()
