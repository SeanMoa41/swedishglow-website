import logging
import requests
from datetime import datetime, timedelta
from sqlalchemy import text
from etl.shared.database import SessionLocal
from etl.shared.config import WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET

def main(timer) -> None:
    logging.info("WooCommerce order sync started")
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT MAX(synced_at) FROM wc_orders")).scalar()
        after = (result - timedelta(minutes=5)).isoformat() if result else "2020-01-01T00:00:00"

        page = 1
        synced = 0
        while True:
            response = requests.get(
                f"{WC_URL}/wp-json/wc/v3/orders",
                auth=(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
                params={"after": after, "per_page": 100, "page": page, "status": "completed"},
            )
            response.raise_for_status()
            orders = response.json()
            if not orders:
                break
            for order in orders:
                session.execute(text("""
                    INSERT INTO wc_orders (id, wc_order_id, customer_email, status, payment_method, total_eur, line_items, order_date, synced_at)
                    VALUES (gen_random_uuid(), :wc_id, :email, :status, :payment, :total, :items::jsonb, :order_date, now())
                    ON CONFLICT (wc_order_id) DO UPDATE SET
                        status = EXCLUDED.status,
                        total_eur = EXCLUDED.total_eur,
                        synced_at = now()
                """), {
                    "wc_id": order["id"],
                    "email": order.get("billing", {}).get("email", ""),
                    "status": order["status"],
                    "payment": order.get("payment_method", ""),
                    "total": float(order.get("total", 0)),
                    "items": str(order.get("line_items", [])),
                    "order_date": order.get("date_created"),
                })
                synced += 1
            session.commit()
            page += 1
        logging.info(f"WooCommerce sync complete: {synced} orders")
    finally:
        session.close()
