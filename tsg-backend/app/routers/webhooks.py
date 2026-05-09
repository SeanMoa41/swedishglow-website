import json
import logging
import httpx
from fastapi import APIRouter, Request, HTTPException, Header, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional

from app.config import settings
from app.database import get_db
from app.services.tier import recalculate_reseller_tier

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

TL_BASE = "https://api.focus.teamleader.eu"
TL_STATUS_MAP = {
    "draft": "draft",
    "outstanding": "outstanding",
    "matched": "paid",
    "overdue": "overdue",
}
TL_QUOTATION_STATUS_MAP = {
    "draft": "draft",
    "sent": "sent",
    "accepted": "accepted",
    "refused": "rejected",
    "expired": "expired",
}


def _verify_secret(secret: Optional[str]) -> None:
    if secret != settings.webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")


async def _fetch_tl_invoice(tl_id: str) -> Optional[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TL_BASE}/invoices.info",
            json={"id": tl_id},
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
    if not resp.is_success:
        return None
    return resp.json().get("data")


async def _fetch_tl_quotation(tl_id: str) -> Optional[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TL_BASE}/quotations.info",
            json={"id": tl_id},
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
    if not resp.is_success:
        return None
    return resp.json().get("data")


@router.post("/woocommerce")
async def woocommerce_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    order_id = payload.get("id")
    if not order_id:
        return {"received": True}
    try:
        await db.execute(
            text("""
                INSERT INTO wc_orders (
                    id, wc_order_id, customer_email, status, payment_method,
                    total_eur, line_items, order_date, synced_at
                )
                VALUES (
                    gen_random_uuid(), :wc_id, :email, :status, :payment,
                    :total, :items::jsonb, :order_date, now()
                )
                ON CONFLICT (wc_order_id) DO UPDATE SET
                    status = EXCLUDED.status,
                    total_eur = EXCLUDED.total_eur,
                    synced_at = now()
            """),
            {
                "wc_id": order_id,
                "email": payload.get("billing", {}).get("email", ""),
                "status": payload.get("status", ""),
                "payment": payload.get("payment_method", ""),
                "total": float(payload.get("total") or 0),
                "items": json.dumps(payload.get("line_items", [])),
                "order_date": payload.get("date_created"),
            },
        )
        await db.commit()
    except Exception:
        logging.exception("WC webhook upsert failed for order %s", order_id)
    return {"received": True}


@router.post("/teamleader")
async def teamleader_webhook(
    request: Request,
    x_webhook_secret: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    event_type = payload.get("type", "")
    tl_payload = payload.get("payload")
    entity_id = tl_payload.get("id") if isinstance(tl_payload, dict) else payload.get("id")
    if not entity_id:
        return {"received": True}

    try:
        if "invoice" in event_type:
            await _handle_tl_invoice(db, entity_id)
        elif "quotation" in event_type:
            await _handle_tl_quotation(db, entity_id)
    except Exception:
        logging.exception("TL webhook processing failed for %s %s", event_type, entity_id)
    return {"received": True}


async def _handle_tl_invoice(db: AsyncSession, tl_id: str) -> None:
    data = await _fetch_tl_invoice(tl_id)
    if not data:
        return

    customer = data.get("invoicee", {}).get("customer", {})
    tl_company_id = customer.get("id")

    reseller_row = await db.execute(
        text("SELECT id FROM resellers WHERE teamleader_id = :tl_id"),
        {"tl_id": tl_company_id},
    )
    reseller_id = reseller_row.scalar_one_or_none()
    if not reseller_id:
        return

    total = data.get("total", {})
    total_eur = float(total.get("tax_inclusive", {}).get("amount", 0)) if isinstance(total, dict) else float(total or 0)

    invoice_number = data.get("invoice_number")
    if isinstance(invoice_number, dict):
        invoice_number = invoice_number.get("number")

    status = TL_STATUS_MAP.get(data.get("status", "outstanding"), "outstanding")

    await db.execute(
        text("""
            INSERT INTO invoices (
                id, reseller_id, tl_invoice_id, invoice_number,
                status, total_eur, invoice_date, due_date, synced_at
            )
            VALUES (
                gen_random_uuid(), :reseller_id, :tl_id, :number,
                :status, :total, :inv_date, :due_date, now()
            )
            ON CONFLICT (tl_invoice_id) DO UPDATE SET
                status = EXCLUDED.status,
                total_eur = EXCLUDED.total_eur,
                synced_at = now()
        """),
        {
            "reseller_id": str(reseller_id),
            "tl_id": tl_id,
            "number": invoice_number,
            "status": status,
            "total": total_eur,
            "inv_date": data.get("invoice_date"),
            "due_date": data.get("due_on"),
        },
    )
    await db.commit()

    if status == "paid":
        await recalculate_reseller_tier(db, str(reseller_id))


async def _handle_tl_quotation(db: AsyncSession, tl_id: str) -> None:
    data = await _fetch_tl_quotation(tl_id)
    if not data:
        return
    status = TL_QUOTATION_STATUS_MAP.get(data.get("status", "draft"), "draft")
    await db.execute(
        text("UPDATE quotations SET status = :status, updated_at = now() WHERE tl_quotation_id = :tl_id"),
        {"status": status, "tl_id": tl_id},
    )
    await db.commit()
