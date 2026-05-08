from fastapi import APIRouter, Request, HTTPException, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from typing import Optional

from app.config import settings
from app.database import get_db
from app.models import Invoice

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def _verify_secret(secret: Optional[str]) -> None:
    if secret != settings.webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")


@router.post("/woocommerce")
async def woocommerce_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    order_id = payload.get("id")
    status = payload.get("status")
    if order_id and status:
        await db.execute(
            text("UPDATE wc_orders SET status = :status WHERE wc_order_id = :id"),
            {"status": status, "id": order_id},
        )
        await db.commit()
    return {"received": True}


@router.post("/teamleader")
async def teamleader_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    tl_invoice_id = payload.get("id")
    new_status = payload.get("status")
    if tl_invoice_id and new_status:
        result = await db.execute(
            select(Invoice).where(Invoice.tl_invoice_id == tl_invoice_id)
        )
        invoice = result.scalar_one_or_none()
        if invoice:
            invoice.status = new_status
            await db.commit()
    return {"received": True}
