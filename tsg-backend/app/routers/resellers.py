from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Invoice, TierThreshold, TierEnum, Quotation
from app.schemas.reseller import ResellerOut, StatsOut, TierOut, ProfileUpdateIn

router = APIRouter(prefix="/resellers", tags=["resellers"])

TIER_ORDER = [TierEnum.pearl, TierEnum.rose, TierEnum.pro, TierEnum.elite, TierEnum.black]


@router.get("/me/stats", response_model=StatsOut)
async def get_stats(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    current_year = datetime.utcnow().year
    result = await db.execute(
        select(func.sum(Invoice.total_eur), func.count(Invoice.id))
        .where(Invoice.reseller_id == reseller.id)
        .where(Invoice.status == "paid")
        .where(extract("year", Invoice.invoice_date) == current_year)
    )
    row = result.one()
    revenue = float(row[0] or 0)
    orders = int(row[1] or 0)

    thresholds = {t.tier: t for t in (await db.execute(select(TierThreshold))).scalars().all()}
    current_threshold = thresholds.get(reseller.tier)
    discount_pct = float(current_threshold.discount_pct) if current_threshold else 0.0

    current_idx = TIER_ORDER.index(reseller.tier)
    next_tier = TIER_ORDER[current_idx + 1] if current_idx < len(TIER_ORDER) - 1 else None
    next_threshold = thresholds.get(next_tier) if next_tier else None
    gap = max(0, float(next_threshold.min_revenue_eur) - revenue) if next_threshold else None

    return StatsOut(
        revenue_ytd_eur=revenue,
        orders_ytd=orders,
        discount_pct=discount_pct,
        next_tier=next_tier,
        next_tier_gap_eur=gap,
    )


@router.get("/me/tier", response_model=TierOut)
async def get_tier(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    current_year = datetime.utcnow().year
    revenue_result = await db.execute(
        select(func.sum(Invoice.total_eur))
        .where(Invoice.reseller_id == reseller.id)
        .where(Invoice.status == "paid")
        .where(extract("year", Invoice.invoice_date) == current_year)
    )
    revenue = float(revenue_result.scalar() or 0)

    thresholds = {t.tier: t for t in (await db.execute(select(TierThreshold))).scalars().all()}
    current_threshold = thresholds.get(reseller.tier)
    discount_pct = float(current_threshold.discount_pct) if current_threshold else 0.0
    benefits = list(current_threshold.benefits) if current_threshold else []

    current_idx = TIER_ORDER.index(reseller.tier)
    next_tier = TIER_ORDER[current_idx + 1] if current_idx < len(TIER_ORDER) - 1 else None
    next_threshold = thresholds.get(next_tier) if next_tier else None
    next_min = float(next_threshold.min_revenue_eur) if next_threshold else None
    progress = (revenue / next_min * 100) if next_min and next_min > 0 else 100.0

    return TierOut(
        current_tier=reseller.tier,
        discount_pct=discount_pct,
        benefits=benefits,
        next_tier=next_tier,
        next_tier_min_eur=next_min,
        revenue_ytd_eur=revenue,
        progress_pct=min(progress, 100.0),
    )


@router.put("/me/profile", response_model=ResellerOut)
async def update_profile(
    body: ProfileUpdateIn,
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(reseller, field, value)
    await db.commit()
    await db.refresh(reseller)
    return reseller


@router.get("/me/invoices")
async def get_invoices(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Invoice)
        .where(Invoice.reseller_id == reseller.id)
        .order_by(Invoice.invoice_date.desc())
    )
    return result.scalars().all()


@router.get("/me/quotations")
async def get_quotations(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Quotation)
        .where(Quotation.reseller_id == reseller.id)
        .order_by(Quotation.created_at.desc())
    )
    return result.scalars().all()
