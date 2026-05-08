import pytest
from unittest.mock import MagicMock, AsyncMock
from uuid import uuid4
from fastapi import HTTPException
from app.main import app
from app.auth import get_current_reseller, get_current_admin
from app.database import get_db


@pytest.mark.asyncio
async def test_non_admin_cannot_access_admin_endpoints(client):
    async def override_admin():
        raise HTTPException(status_code=403, detail="Admin required")

    app.dependency_overrides[get_current_admin] = override_admin
    try:
        response = await client.get("/admin/resellers", headers={"Authorization": "Bearer fake"})
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_admin_can_list_applications(client):
    mock_admin = MagicMock()
    mock_admin.id = uuid4()
    mock_admin.is_admin = True
    mock_admin.status = "active"
    mock_admin.tier = "black"

    async def override_admin():
        return mock_admin

    async def override_db():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalars.return_value.all.return_value = []
        mock_db.execute = AsyncMock(return_value=mock_result)
        yield mock_db

    app.dependency_overrides[get_current_admin] = override_admin
    app.dependency_overrides[get_db] = override_db
    try:
        response = await client.get("/admin/applications", headers={"Authorization": "Bearer fake"})
    finally:
        app.dependency_overrides.clear()
    assert response.status_code == 200
