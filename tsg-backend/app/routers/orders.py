from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, Quotation, TierThreshold
from app.schemas.order import QuotationIn, QuotationOut
from app.integrations import teamleader
from app.integrations.email import send_email

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/quotation", response_model=QuotationOut, status_code=201)
async def create_quotation(
    body: QuotationIn,
    background_tasks: BackgroundTasks,
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    if not reseller.teamleader_id:
        raise HTTPException(status_code=400, detail="Reseller not linked to TeamLeader")

    threshold_result = await db.execute(
        select(TierThreshold).where(TierThreshold.tier == reseller.tier)
    )
    threshold = threshold_result.scalar_one_or_none()
    discount_pct = float(threshold.discount_pct) if threshold else 0.0
    auto_approve = threshold.auto_approve if threshold else False

    line_items = []
    total = 0.0
    for line in body.lines:
        product_result = await db.execute(select(Product).where(Product.id == line.product_id))
        product = product_result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")
        net_price = float(product.list_price_eur) * (1 - discount_pct / 100)
        total += net_price * line.quantity
        line_items.append({
            "product_id": str(product.id),
            "description": product.name,
            "quantity": line.quantity,
            "unit_price": float(product.list_price_eur),
        })

    tl_response = await teamleader.create_quotation(
        deal_id=reseller.teamleader_id,
        line_items=line_items,
        discount_pct=discount_pct,
    )
    tl_quotation_id = tl_response.get("id") or tl_response.get("quotation_id")

    status = "draft"
    if auto_approve and tl_quotation_id:
        await teamleader.accept_quotation(tl_quotation_id)
        status = "accepted"

    quotation = Quotation(
        reseller_id=reseller.id,
        tl_quotation_id=tl_quotation_id,
        tl_deal_id=reseller.teamleader_id,
        status=status,
        total_eur=total,
        line_items=line_items,
    )
    db.add(quotation)
    await db.commit()
    await db.refresh(quotation)

    background_tasks.add_task(
        send_email,
        to=reseller.email,
        subject="Bestelling ontvangen — The Swedish Glow",
        template="quotation_confirmed",
        context={
            "name": reseller.first_name or reseller.email,
            "line_items": line_items,
            "total_eur": total,
            "auto_approved": auto_approve,
            "tier": str(reseller.tier),
        },
    )
    return quotation
