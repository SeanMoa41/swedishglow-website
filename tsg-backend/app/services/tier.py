import asyncio
import logging
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import AsyncSessionLocal

TIER_ORDER = ["pearl", "rose", "pro", "elite", "black"]


def calculate_tier(revenue_eur: float, thresholds: list[dict]) -> str:
    sorted_thresholds = sorted(thresholds, key=lambda t: float(t["min_revenue_eur"]))
    result = "pearl"
    for t in sorted_thresholds:
        if revenue_eur >= float(t["min_revenue_eur"]):
            result = t["tier"]
    return result


async def recalculate_reseller_tier(db: AsyncSession, reseller_id: str) -> str | None:
    result = await db.execute(
        text("SELECT tier, tier_override FROM resellers WHERE id = :id AND status = 'active'"),
        {"id": reseller_id},
    )
    reseller = result.one_or_none()
    if not reseller or reseller.tier_override:
        return None

    current_tier = reseller.tier
    current_year = datetime.now(timezone.utc).year

    thresholds_rows = await db.execute(
        text("SELECT tier, min_revenue_eur FROM tier_thresholds ORDER BY min_revenue_eur")
    )
    thresholds = [{"tier": r[0], "min_revenue_eur": r[1]} for r in thresholds_rows.all()]

    revenue_row = await db.execute(
        text("""
            SELECT COALESCE(SUM(total_eur), 0)
            FROM invoices
            WHERE reseller_id = :id
            AND status = 'paid'
            AND EXTRACT(year FROM invoice_date) = :year
        """),
        {"id": reseller_id, "year": current_year},
    )
    revenue = float(revenue_row.scalar())

    new_tier = calculate_tier(revenue, thresholds)

    current_idx = TIER_ORDER.index(current_tier) if current_tier in TIER_ORDER else 0
    new_idx = TIER_ORDER.index(new_tier) if new_tier in TIER_ORDER else 0
    if new_idx <= current_idx:
        return None

    await db.execute(
        text("UPDATE resellers SET tier = :tier, updated_at = now() WHERE id = :id"),
        {"tier": new_tier, "id": reseller_id},
    )
    await db.commit()
    logging.info(f"Tier upgraded: reseller {reseller_id} → {new_tier}")
    return new_tier


async def recalculate_all_tiers() -> None:
    from app.integrations.email import send_email
    logger = logging.getLogger("tsg.tier")
    logger.info("Starting nightly tier recalculation")
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            text("SELECT id, email, first_name FROM resellers WHERE status = 'active'")
        )
        # result.all() materialises rows as plain Row objects — safe to access after session closes
        resellers = result.all()

    upgraded = 0
    for row in resellers:
        async with AsyncSessionLocal() as db:
            new_tier = await recalculate_reseller_tier(db, str(row.id))
            if new_tier:
                upgraded += 1
                await asyncio.to_thread(
                    send_email,
                    to=row.email,
                    subject="Gefeliciteerd met je nieuwe tier!",
                    template="tier_upgraded",
                    context={"name": row.first_name or row.email, "new_tier": new_tier},
                )
    logger.info(f"Tier recalculation complete: {upgraded} resellers upgraded")
