import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.tier import calculate_tier, recalculate_reseller_tier


def test_calculate_tier_returns_highest_qualifying():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": "0"},
        {"tier": "rose", "min_revenue_eur": "1000"},
        {"tier": "pro", "min_revenue_eur": "5000"},
    ]
    assert calculate_tier(0.0, thresholds) == "pearl"
    assert calculate_tier(999.99, thresholds) == "pearl"
    assert calculate_tier(1000.0, thresholds) == "rose"
    assert calculate_tier(5000.0, thresholds) == "pro"


def test_calculate_tier_empty_thresholds_returns_pearl():
    assert calculate_tier(9999.0, []) == "pearl"


@pytest.mark.asyncio
async def test_recalculate_skips_when_tier_override():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.one_or_none.return_value = MagicMock(tier="pearl", tier_override=True)
    mock_db.execute.return_value = mock_result

    await recalculate_reseller_tier(mock_db, "uuid-1")

    # Only the initial SELECT — no thresholds query, no UPDATE
    assert mock_db.execute.call_count == 1


@pytest.mark.asyncio
async def test_recalculate_skips_when_reseller_not_found():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.one_or_none.return_value = None
    mock_db.execute.return_value = mock_result

    await recalculate_reseller_tier(mock_db, "uuid-not-found")

    assert mock_db.execute.call_count == 1


@pytest.mark.asyncio
async def test_recalculate_upgrades_tier():
    mock_db = AsyncMock()

    reseller_result = MagicMock()
    reseller_result.one_or_none.return_value = MagicMock(tier="pearl", tier_override=False)

    thresholds_result = MagicMock()
    # Plain tuples work because SQLAlchemy rows support r[0] / r[1]
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000")]

    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0

    update_result = MagicMock()

    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result, update_result]

    await recalculate_reseller_tier(mock_db, "uuid-1")

    mock_db.commit.assert_called_once()
    # Verify the correct new tier was written
    update_call = mock_db.execute.call_args_list[3]
    assert update_call[0][1]["tier"] == "rose"


@pytest.mark.asyncio
async def test_recalculate_does_not_downgrade():
    mock_db = AsyncMock()

    reseller_result = MagicMock()
    # Currently pro, but only qualifies for rose (revenue too low)
    reseller_result.one_or_none.return_value = MagicMock(tier="pro", tier_override=False)

    thresholds_result = MagicMock()
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000"), ("pro", "5000")]

    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0

    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result]

    await recalculate_reseller_tier(mock_db, "uuid-1")

    mock_db.commit.assert_not_called()
