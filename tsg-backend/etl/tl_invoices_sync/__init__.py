import logging
import requests
from datetime import datetime, timedelta
from sqlalchemy import text
from etl.shared.database import SessionLocal
from etl.shared.config import TEAMLEADER_ACCESS_TOKEN

TL_BASE = "https://api.focus.teamleader.eu"
HEADERS = {"Authorization": f"Bearer {TEAMLEADER_ACCESS_TOKEN}"}

STATUS_MAP = {
    "draft": "draft",
    "outstanding": "outstanding",
    "matched": "paid",
    "overdue": "overdue",
}

def main(timer) -> None:
    logging.info("TeamLeader invoice sync started")
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT MAX(synced_at) FROM invoices")).scalar()
        updated_since = (result - timedelta(minutes=5)).isoformat() if result else "2020-01-01T00:00:00+00:00"

        page = 1
        synced = 0
        while True:
            response = requests.post(
                f"{TL_BASE}/invoices.list",
                json={
                    "filter": {"updated_since": updated_since},
                    "page": {"size": 100, "number": page},
                },
                headers=HEADERS,
            )
            response.raise_for_status()
            invoices = response.json().get("data", [])
            if not invoices:
                break
            for inv in invoices:
                attrs = inv.get("attributes", {})
                tl_id = inv["id"]
                customer = attrs.get("invoicee", {}).get("customer", {})
                tl_company_id = customer.get("id")
                reseller_row = session.execute(
                    text("SELECT id FROM resellers WHERE teamleader_id = :tl_id"),
                    {"tl_id": tl_company_id}
                ).scalar()
                if not reseller_row:
                    continue
                session.execute(text("""
                    INSERT INTO invoices (id, reseller_id, tl_invoice_id, invoice_number, status, total_eur, invoice_date, due_date, synced_at)
                    VALUES (gen_random_uuid(), :reseller_id, :tl_id, :number, :status, :total, :inv_date, :due_date, now())
                    ON CONFLICT (tl_invoice_id) DO UPDATE SET
                        status = EXCLUDED.status,
                        total_eur = EXCLUDED.total_eur,
                        synced_at = now()
                """), {
                    "reseller_id": str(reseller_row),
                    "tl_id": tl_id,
                    "number": attrs.get("invoice_number", {}).get("number"),
                    "status": STATUS_MAP.get(attrs.get("status", "outstanding"), "outstanding"),
                    "total": float(attrs.get("total", {}).get("tax_inclusive", {}).get("amount", 0)),
                    "inv_date": attrs.get("invoice_date"),
                    "due_date": attrs.get("due_on"),
                })
                synced += 1
            session.commit()
            page += 1
        logging.info(f"TL invoice sync complete: {synced} invoices")
    finally:
        session.close()
