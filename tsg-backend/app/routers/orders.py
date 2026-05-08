from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, Quotation, TierThreshold
from app.schemas.order import QuotationIn, QuotationOut
from app.integrations import teamleader

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/quotation", response_model=QuotationOut, status_code=201)
async def create_quotation(
    body: QuotationIn,
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

    quotation = Quotation(
        reseller_id=reseller.id,
        tl_quotation_id=tl_response.get("quotation_id"),
        tl_deal_id=reseller.teamleader_id,
        status="draft",
        total_eur=total,
        line_items=line_items,
    )
    db.add(quotation)
    await db.commit()
    await db.refresh(quotation)
    return quotation
