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


@pytest.mark.asyncio
async def test_approve_application_sends_email(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_admin
    from app.database import get_db

    mock_admin = MagicMock()
    mock_admin.id = uuid4()
    mock_admin.is_admin = True

    mock_application = MagicMock()
    mock_application.id = uuid4()
    mock_application.email = "reseller@example.com"
    mock_application.first_name = "Jan"
    mock_application.last_name = "Smit"
    mock_application.company = "Bloemen BV"
    mock_application.phone = "0612345678"
    mock_application.message = None
    mock_application.status = "pending"
    mock_application.assigned_tier = None

    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_application
    mock_db.execute.return_value = mock_result

    async def override_admin():
        return mock_admin

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_admin] = override_admin
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.supabase_admin.create_user", new_callable=AsyncMock) as mock_su, \
         patch("app.routers.admin.send_email") as mock_email:
        mock_su.return_value = str(uuid4())
        try:
            response = await client.post(
                f"/admin/applications/{mock_application.id}/approve",
                json={"assigned_tier": "pearl"},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

    mock_email.assert_called_once()
    call_kwargs = mock_email.call_args[1]
    assert call_kwargs["template"] == "account_approved"
    assert call_kwargs["to"] == "reseller@example.com"
