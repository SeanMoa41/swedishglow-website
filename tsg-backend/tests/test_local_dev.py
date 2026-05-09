import pytest
from unittest.mock import AsyncMock, MagicMock
from app.auth import get_current_reseller
from app import config


@pytest.mark.asyncio
async def test_local_dev_auth_returns_dev_reseller(monkeypatch):
    monkeypatch.setattr(config.settings, "local_dev", True)
    monkeypatch.setattr(config.settings, "local_dev_reseller_email", "dev@theswedishglow.com")

    mock_reseller = MagicMock()
    mock_reseller.email = "dev@theswedishglow.com"

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_reseller

    mock_db = AsyncMock()
    mock_db.execute.return_value = mock_result

    result = await get_current_reseller(credentials=None, db=mock_db)
    assert result.email == "dev@theswedishglow.com"


@pytest.mark.asyncio
async def test_local_dev_auth_raises_500_if_no_reseller(monkeypatch):
    from fastapi import HTTPException
    monkeypatch.setattr(config.settings, "local_dev", True)
    monkeypatch.setattr(config.settings, "local_dev_reseller_email", "dev@theswedishglow.com")

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None

    mock_db = AsyncMock()
    mock_db.execute.return_value = mock_result

    with pytest.raises(HTTPException) as exc:
        await get_current_reseller(credentials=None, db=mock_db)
    assert exc.value.status_code == 500
