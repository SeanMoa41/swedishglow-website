from etl.tier_recalculate import calculate_tier

def test_calculate_tier_returns_correct_tier():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": 0},
        {"tier": "rose", "min_revenue_eur": 1000},
        {"tier": "pro", "min_revenue_eur": 5000},
        {"tier": "elite", "min_revenue_eur": 15000},
        {"tier": "black", "min_revenue_eur": 50000},
    ]
    assert calculate_tier(0, thresholds) == "pearl"
    assert calculate_tier(999, thresholds) == "pearl"
    assert calculate_tier(1000, thresholds) == "rose"
    assert calculate_tier(5000, thresholds) == "pro"
    assert calculate_tier(50000, thresholds) == "black"
    assert calculate_tier(99999, thresholds) == "black"

def test_calculate_tier_never_downgrades():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": 0},
        {"tier": "rose", "min_revenue_eur": 1000},
    ]
    assert calculate_tier(500, thresholds) == "pearl"
