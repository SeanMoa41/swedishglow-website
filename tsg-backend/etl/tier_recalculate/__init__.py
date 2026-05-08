TIER_ORDER = ["pearl", "rose", "pro", "elite", "black"]


def calculate_tier(revenue_eur: float, thresholds: list[dict]) -> str:
    sorted_thresholds = sorted(thresholds, key=lambda t: float(t["min_revenue_eur"]))
    result = "pearl"
    for t in sorted_thresholds:
        if revenue_eur >= float(t["min_revenue_eur"]):
            result = t["tier"]
    return result


def main(timer) -> None:
    import logging
    from datetime import datetime
    from sqlalchemy import text
    from etl.shared.database import SessionLocal

    logging.info("Tier recalculation started")
    session = SessionLocal()
    try:
        current_year = datetime.utcnow().year

        thresholds_rows = session.execute(
            text("SELECT tier, min_revenue_eur FROM tier_thresholds ORDER BY min_revenue_eur")
        ).all()
        thresholds = [{"tier": r[0], "min_revenue_eur": r[1]} for r in thresholds_rows]

        resellers = session.execute(
            text("SELECT id, tier FROM resellers WHERE status = 'active' AND tier_override = false")
        ).all()

        updated = 0
        for reseller_id, current_tier in resellers:
            revenue_row = session.execute(text("""
                SELECT COALESCE(SUM(total_eur), 0)
                FROM invoices
                WHERE reseller_id = :id
                AND status = 'paid'
                AND EXTRACT(year FROM invoice_date) = :year
            """), {"id": str(reseller_id), "year": current_year}).scalar()

            new_tier = calculate_tier(float(revenue_row), thresholds)

            # Never downgrade automatically
            current_idx = TIER_ORDER.index(current_tier) if current_tier in TIER_ORDER else 0
            new_idx = TIER_ORDER.index(new_tier) if new_tier in TIER_ORDER else 0
            if new_idx < current_idx:
                continue

            if new_tier != current_tier:
                session.execute(
                    text("UPDATE resellers SET tier = :tier, updated_at = now() WHERE id = :id"),
                    {"tier": new_tier, "id": str(reseller_id)},
                )
                updated += 1

        session.commit()
        logging.info(f"Tier recalculation complete: {updated} resellers upgraded")
    finally:
        session.close()
