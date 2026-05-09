import pytest
from unittest.mock import AsyncMock, MagicMock
from app import config
from app.auth import get_current_reseller
from app.integrations.blob import generate_download_url


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


from app.integrations.teamleader import create_quotation, list_invoices


@pytest.mark.asyncio
async def test_create_quotation_returns_mock_id(monkeypatch):
    monkeypatch.setattr(config.settings, "local_dev", True)
    result = await create_quotation(deal_id="x", line_items=[], discount_pct=10.0)
    assert result["id"].startswith("tl-mock-")


@pytest.mark.asyncio
async def test_list_invoices_returns_empty(monkeypatch):
    monkeypatch.setattr(config.settings, "local_dev", True)
    result = await list_invoices()
    assert result == []


def test_generate_download_url_returns_localhost(monkeypatch):
    monkeypatch.setattr(config.settings, "local_dev", True)
    url = generate_download_url("some-file.pdf")
    assert url == "http://localhost:8000/static/mock-file.pdf"
