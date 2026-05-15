"""
Seed local development database with dummy data.

Prerequisites:
  - Docker Compose running: docker-compose up -d
  - Migrations applied: alembic upgrade head
Run from tsg-backend directory: python scripts/seed_local.py
"""
import asyncio
import json
import sys
import os
import uuid
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.config import settings

engine = create_async_engine(settings.database_url, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)


async def seed():
    async with Session() as db:
        # 1. Tier thresholds
        tiers = [
            ("pearl",  0,       10, ["10% korting", "Toegang tot productcatalogus"],              False),
            ("rose",   5000,    15, ["15% korting", "Prioriteit support", "Rose marketingmateriaal"], False),
            ("pro",    15000,   20, ["20% korting", "Dedicated accountmanager", "Pro productpresentaties"], False),
            ("elite",  40000,   25, ["25% korting", "Early access nieuwe producten", "Elite evenementen"], True),
            ("black",  100000,  30, ["30% korting", "Co-marketing budget", "Black concierge support"], True),
        ]
        for tier, min_rev, disc, benefits, auto_approve in tiers:
            await db.execute(text("""
                INSERT INTO tier_thresholds (tier, min_revenue_eur, discount_pct, benefits, auto_approve)
                VALUES (:tier, :min_rev, :disc, CAST(:benefits AS jsonb), :auto_approve)
                ON CONFLICT (tier) DO UPDATE SET auto_approve = EXCLUDED.auto_approve
            """), {"tier": tier, "min_rev": min_rev, "disc": disc,
                   "benefits": json.dumps(benefits), "auto_approve": auto_approve})
        print("✓ Tier thresholds")

        # 2. Dev reseller
        reseller_id = str(uuid.uuid4())
        await db.execute(text("""
            INSERT INTO resellers (id, email, first_name, last_name, company, status, tier, tier_override, teamleader_id, is_admin)
            VALUES (:id, :email, 'Dev', 'Reseller', 'Dev Reseller BV', 'active', 'pearl', false, :tl_id, true)
            ON CONFLICT (email) DO NOTHING
        """), {
            "id": reseller_id,
            "email": settings.local_dev_reseller_email,
            "tl_id": "a1b2c3d4-0000-0000-0000-000000000001",
        })
        # Fetch the actual ID (may already exist)
        row = await db.execute(
            text("SELECT id FROM resellers WHERE email = :email"),
            {"email": settings.local_dev_reseller_email}
        )
        reseller_id = str(row.scalar_one())
        print(f"✓ Dev reseller ({settings.local_dev_reseller_email})")

        # 3. Products (10)
        products = [
            (1,  "Marine Collageen Poeder",    "collageen",    45.00),
            (2,  "Vitamine C Complex",          "vitamine-c",   22.50),
            (3,  "Omega-3 Visolie",             "omega-3",      28.00),
            (4,  "Hyaluronzuur Capsules",        "hyaluronzuur", 35.00),
            (5,  "Biotine & Zink",              "biotine",      19.50),
            (6,  "Q10 Coenzym",                 "q10",          32.00),
            (7,  "Magnesium Bisglycinaat",       "magnesium",    24.00),
            (8,  "TSG Glow Serum",              "serum",        65.00),
            (9,  "Probiotica Complex",           "probiotica",   38.00),
            (10, "Vitamine D3 + K2",            "vitamine-d",   18.00),
        ]
        for wc_id, name, tag, price in products:
            stable_id = uuid.UUID(f"a0000000-0000-0000-0000-{wc_id:012d}")
            await db.execute(text("""
                INSERT INTO products (id, wc_product_id, name, tag, list_price_eur, active, sort_order)
                VALUES (:id, :wc_id, :name, :tag, :price, true, :sort)
                ON CONFLICT (id) DO NOTHING
            """), {"id": stable_id, "wc_id": wc_id, "name": name, "tag": tag, "price": price, "sort": wc_id})
        print("✓ 10 products")

        # 4. Invoices (5) — 3 paid, 2 outstanding → YTD paid = €4,150
        today = date.today()
        invoices = [
            ("INV-2026-001", "paid",        1200.00, today.replace(month=2, day=15)),
            ("INV-2026-002", "paid",         850.00, today.replace(month=3, day=10)),
            ("INV-2026-003", "paid",        2100.00, today.replace(month=4, day=22)),
            ("INV-2026-004", "outstanding",  950.00, today.replace(month=5, day=5)),
            ("INV-2026-005", "outstanding",  600.00, today.replace(month=5, day=7)),
        ]
        for tl_id, status, amount, inv_date in invoices:
            await db.execute(text("""
                INSERT INTO invoices (id, tl_invoice_id, reseller_id, status, total_eur, invoice_date, due_date)
                VALUES (:id, :tl_id, :reseller_id, :status, :amount, :inv_date, :due_date)
                ON CONFLICT (tl_invoice_id) DO NOTHING
            """), {
                "id": str(uuid.uuid4()),
                "tl_id": tl_id,
                "reseller_id": reseller_id,
                "status": status,
                "amount": amount,
                "inv_date": inv_date,
                "due_date": inv_date + timedelta(days=30),
            })
        print("✓ 5 invoices (3 paid = €4,150 YTD)")

        # 5. Quotations (3)
        quotations = [
            ("QUO-2026-001", "DEAL-2026-001", "draft",     450.00),
            ("QUO-2026-002", "DEAL-2026-002", "sent",      675.00),
            ("QUO-2026-003", "DEAL-2026-003", "accepted", 1125.00),
        ]
        line_items = json.dumps([{"product": "Marine Collageen Poeder", "qty": 10, "unit_price": 45.00}])
        for i, (tl_q_id, tl_d_id, status, total) in enumerate(quotations, start=1):
            stable_id = uuid.UUID(f"b0000000-0000-0000-0000-{i:012d}")
            await db.execute(text("""
                INSERT INTO quotations (id, tl_quotation_id, tl_deal_id, reseller_id, status, line_items, total_eur)
                VALUES (:id, :tl_q_id, :tl_d_id, :reseller_id, :status, CAST(:items AS jsonb), :total)
                ON CONFLICT (id) DO NOTHING
            """), {
                "id": stable_id,
                "tl_q_id": tl_q_id,
                "tl_d_id": tl_d_id,
                "reseller_id": reseller_id,
                "status": status,
                "items": line_items,
                "total": total,
            })
        print("✓ 3 quotations")

        # 6. Marketing files (4) — stable UUIDs so re-runs are idempotent
        marketing_files = [
            (uuid.UUID("f0000000-0000-0000-0000-000000000001"), "TSG Productcatalogus 2026",     "mock-file.pdf", "all"),
            (uuid.UUID("f0000000-0000-0000-0000-000000000002"), "Brand Kit 2026",                "mock-file.pdf", "rose"),
            (uuid.UUID("f0000000-0000-0000-0000-000000000003"), "Productpresentatie Video",      "mock-file.pdf", "pro"),
            (uuid.UUID("f0000000-0000-0000-0000-000000000004"), "Prijslijst Groothandel",        "mock-file.pdf", "all"),
        ]
        for fid, fname, fblob, ftier in marketing_files:
            await db.execute(text("""
                INSERT INTO marketing_files (id, name, blob_url, min_tier, download_count, uploaded_by)
                VALUES (:id, :name, :blob_url, :min_tier, 0, :uploaded_by)
                ON CONFLICT (id) DO NOTHING
            """), {"id": fid, "name": fname, "blob_url": fblob, "min_tier": ftier, "uploaded_by": reseller_id})
        print("✓ 4 marketing files")

        await db.commit()
        print("\n✓ Seed complete. Navigate to http://localhost:3000/reseller/dashboard")


if __name__ == "__main__":
    asyncio.run(seed())
