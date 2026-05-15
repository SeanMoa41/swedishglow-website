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


@pytest.mark.asyncio
async def test_create_quotation_auto_approves_elite_tier(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_reseller
    from app.database import get_db

    product_id = uuid4()
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "elite@example.com"
    mock_reseller.first_name = "Elite"
    mock_reseller.tier = "elite"
    mock_reseller.teamleader_id = "tl-deal-123"

    mock_threshold = MagicMock()
    mock_threshold.discount_pct = 25.0
    mock_threshold.auto_approve = True

    mock_product = MagicMock()
    mock_product.id = product_id
    mock_product.name = "Marine Collageen"
    mock_product.list_price_eur = 45.0

    quotation_id = uuid4()

    mock_db = AsyncMock()
    threshold_result = MagicMock()
    threshold_result.scalar_one_or_none.return_value = mock_threshold
    product_result = MagicMock()
    product_result.scalar_one_or_none.return_value = mock_product
    mock_db.execute.side_effect = [threshold_result, product_result]

    async def mock_refresh(obj):
        obj.id = quotation_id
        obj.created_at = None
        obj.updated_at = None

    mock_db.refresh.side_effect = mock_refresh

    async def override_auth():
        return mock_reseller

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.teamleader.create_quotation", new_callable=AsyncMock) as mock_create, \
         patch("app.integrations.teamleader.accept_quotation", new_callable=AsyncMock) as mock_accept, \
         patch("app.routers.orders.send_email") as mock_email:
        mock_create.return_value = {"id": "tl-quot-abc"}
        try:
            response = await client.post(
                "/orders/quotation",
                json={"lines": [{"product_id": str(product_id), "quantity": 2}]},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

        mock_accept.assert_called_once_with("tl-quot-abc")
        mock_email.assert_called_once()
        call_kwargs = mock_email.call_args[1]
        assert call_kwargs["template"] == "quotation_confirmed"


@pytest.mark.asyncio
async def test_create_quotation_draft_for_pearl_tier(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_reseller
    from app.database import get_db

    product_id = uuid4()
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "pearl@example.com"
    mock_reseller.first_name = "Pearl"
    mock_reseller.tier = "pearl"
    mock_reseller.teamleader_id = "tl-deal-456"

    mock_threshold = MagicMock()
    mock_threshold.discount_pct = 10.0
    mock_threshold.auto_approve = False

    mock_product = MagicMock()
    mock_product.id = product_id
    mock_product.name = "Vitamine C"
    mock_product.list_price_eur = 22.5

    quotation_id = uuid4()

    mock_db = AsyncMock()
    threshold_result = MagicMock()
    threshold_result.scalar_one_or_none.return_value = mock_threshold
    product_result = MagicMock()
    product_result.scalar_one_or_none.return_value = mock_product
    mock_db.execute.side_effect = [threshold_result, product_result]

    async def mock_refresh(obj):
        obj.id = quotation_id
        obj.created_at = None
        obj.updated_at = None

    mock_db.refresh.side_effect = mock_refresh

    async def override_auth():
        return mock_reseller

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.teamleader.create_quotation", new_callable=AsyncMock) as mock_create, \
         patch("app.integrations.teamleader.accept_quotation", new_callable=AsyncMock) as mock_accept, \
         patch("app.routers.orders.send_email") as mock_email:
        mock_create.return_value = {"id": "tl-quot-xyz"}
        try:
            response = await client.post(
                "/orders/quotation",
                json={"lines": [{"product_id": str(product_id), "quantity": 1}]},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

        mock_accept.assert_not_called()
        mock_email.assert_called_once()
        call_kwargs = mock_email.call_args[1]
        assert call_kwargs["template"] == "quotation_confirmed"
