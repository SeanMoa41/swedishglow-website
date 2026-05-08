import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract, text
from app.database import get_db
from app.auth import get_current_admin
from app.models import (
    Reseller, PartnerApplication, Invoice, MarketingFile,
    ApplicationStatusEnum, TierEnum,
)
from app.schemas.admin import (
    AdminResellerOut, TierOverrideIn, ApplicationApproveIn,
    RevenueAnalyticsOut, DownloadAnalyticsOut,
)
from app.schemas.application import ApplicationOut
from app.integrations import supabase_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/applications", response_model=list[ApplicationOut])
async def list_applications(
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PartnerApplication)
        .where(PartnerApplication.status == ApplicationStatusEnum.pending)
        .order_by(PartnerApplication.created_at.desc())
    )
    return result.scalars().all()


@router.post("/applications/{application_id}/approve", response_model=ApplicationOut)
async def approve_application(
    application_id: uuid.UUID,
    body: ApplicationApproveIn,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PartnerApplication).where(PartnerApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404)

    supabase_user_id = await supabase_admin.create_user(application.email)

    reseller = Reseller(
        id=uuid.UUID(supabase_user_id),
        email=application.email,
        first_name=application.first_name,
        last_name=application.last_name,
        company=application.company,
        phone=application.phone,
        tier=body.assigned_tier,
        status="active",
    )
    db.add(reseller)
    application.status = ApplicationStatusEnum.approved
    application.assigned_tier = body.assigned_tier
    application.reviewed_by = admin.id
    await db.commit()
    await db.refresh(application)
    return application


@router.post("/applications/{application_id}/reject", response_model=ApplicationOut)
async def reject_application(
    application_id: uuid.UUID,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PartnerApplication).where(PartnerApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404)
    application.status = ApplicationStatusEnum.rejected
    application.reviewed_by = admin.id
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/resellers", response_model=list[AdminResellerOut])
async def list_resellers(
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Reseller).order_by(Reseller.created_at.desc()))
    return result.scalars().all()


@router.put("/resellers/{reseller_id}/tier", response_model=AdminResellerOut)
async def override_tier(
    reseller_id: uuid.UUID,
    body: TierOverrideIn,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Reseller).where(Reseller.id == reseller_id))
    reseller = result.scalar_one_or_none()
    if not reseller:
        raise HTTPException(status_code=404)
    reseller.tier = body.tier
    reseller.tier_override = True
    await db.commit()
    await db.refresh(reseller)
    return reseller


@router.get("/analytics/revenue", response_model=RevenueAnalyticsOut)
async def revenue_analytics(
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(
            extract("year", Invoice.invoice_date).label("year"),
            extract("month", Invoice.invoice_date).label("month"),
            func.sum(Invoice.total_eur).label("total"),
        )
        .where(Invoice.status == "paid")
        .group_by("year", "month")
        .order_by("year", "month")
    )
    rows = result.all()
    monthly = [
        {"year": int(r.year), "month": int(r.month), "total_eur": float(r.total)}
        for r in rows
    ]
    quarters: dict = {}
    for m in monthly:
        q = f"{m['year']}-Q{(m['month'] - 1) // 3 + 1}"
        quarters[q] = quarters.get(q, 0) + m["total_eur"]
    quarterly = [{"quarter": k, "total_eur": round(v, 2)} for k, v in sorted(quarters.items())]
    total = sum(m["total_eur"] for m in monthly)
    avg = total / len(monthly) if monthly else 0
    return RevenueAnalyticsOut(
        monthly=monthly,
        quarterly=quarterly,
        total_eur=total,
        avg_monthly_eur=avg,
    )


@router.get("/analytics/b2c")
async def b2c_analytics(
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        text("SELECT COUNT(*), COALESCE(SUM(total_eur),0) FROM wc_orders")
    )
    row = result.one()
    return {"order_count": int(row[0]), "total_eur": float(row[1])}


@router.get("/analytics/downloads", response_model=DownloadAnalyticsOut)
async def download_analytics(
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(MarketingFile.name, MarketingFile.download_count)
        .order_by(MarketingFile.download_count.desc())
    )
    files = [{"name": r.name, "download_count": r.download_count} for r in result.all()]
    return DownloadAnalyticsOut(files=files)
