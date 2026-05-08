from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, TierThreshold
from app.schemas.product import ProductOut

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
async def list_products(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    threshold_result = await db.execute(
        select(TierThreshold).where(TierThreshold.tier == reseller.tier)
    )
    threshold = threshold_result.scalar_one_or_none()
    discount_pct = float(threshold.discount_pct) if threshold else 0.0

    products_result = await db.execute(
        select(Product).where(Product.active == True).order_by(Product.sort_order)
    )
    products = products_result.scalars().all()

    return [
        ProductOut(
            id=p.id,
            name=p.name,
            tag=p.tag,
            description=p.description,
            list_price_eur=float(p.list_price_eur),
            net_price_eur=round(float(p.list_price_eur) * (1 - discount_pct / 100), 2),
            image_url=p.image_url,
            sort_order=p.sort_order,
        )
        for p in products
    ]
