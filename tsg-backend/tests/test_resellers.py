import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from uuid import uuid4


@pytest.mark.asyncio
async def test_get_me_returns_reseller_profile(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "test@example.com"
    mock_reseller.first_name = "Jan"
    mock_reseller.last_name = "de Vries"
    mock_reseller.company = "Test BV"
    mock_reseller.phone = None
    mock_reseller.country = "NL"
    mock_reseller.tier = "pearl"
    mock_reseller.is_admin = False

    from app.main import app
    from app.auth import get_current_reseller

    async def override_auth():
        return mock_reseller

    app.dependency_overrides[get_current_reseller] = override_auth
    try:
        response = await client.get("/auth/me", headers={"Authorization": "Bearer fake"})
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_register_application_success(client):
    mock_application = MagicMock()
    mock_application.id = uuid4()
    mock_application.first_name = "Anna"
    mock_application.last_name = "Lindqvist"
    mock_application.company = "Beauty BV"
    mock_application.email = "anna@beauty.nl"
    mock_application.phone = "+31612345678"
    mock_application.message = "Interested"
    mock_application.status = "pending"
    mock_application.assigned_tier = "pearl"

    from app.main import app
    from app.database import get_db

    async def override_db():
        mock_session = AsyncMock()
        mock_session.add = MagicMock()
        mock_session.commit = AsyncMock()
        mock_session.refresh = AsyncMock()
        yield mock_session

    app.dependency_overrides[get_db] = override_db
    try:
        with patch("app.routers.auth.PartnerApplication", return_value=mock_application):
            response = await client.post(
                "/auth/register-application",
                json={
                    "first_name": "Anna",
                    "last_name": "Lindqvist",
                    "company": "Beauty BV",
                    "email": "anna@beauty.nl",
                    "phone": "+31612345678",
                    "message": "Interested in partnership",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 201
