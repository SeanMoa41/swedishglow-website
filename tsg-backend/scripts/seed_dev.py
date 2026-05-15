"""Run with: python -m scripts.seed_dev"""
import asyncio
import uuid
from app.database import AsyncSessionLocal
from app.models import TierThreshold, Product, TierEnum

TIER_THRESHOLDS = [
    {"tier": TierEnum.pearl,  "min_revenue_eur": 0,      "discount_pct": 10, "benefits": ["10% korting", "Toegang tot marketingmateriaal"], "auto_approve": False},
    {"tier": TierEnum.rose,   "min_revenue_eur": 1000,   "discount_pct": 15, "benefits": ["15% korting", "Prioriteit support", "Rose materialen"], "auto_approve": False},
    {"tier": TierEnum.pro,    "min_revenue_eur": 5000,   "discount_pct": 20, "benefits": ["20% korting", "Dedicated account manager"], "auto_approve": False},
    {"tier": TierEnum.elite,  "min_revenue_eur": 15000,  "discount_pct": 25, "benefits": ["25% korting", "Co-marketing mogelijkheden"], "auto_approve": True},
    {"tier": TierEnum.black,  "min_revenue_eur": 50000,  "discount_pct": 30, "benefits": ["30% korting", "Exclusieve producten", "Persoonlijk contact met founder"], "auto_approve": True},
]

PRODUCTS = [
    {"name": "Marine Collageen 13.000", "tag": "Het ochtendritueel", "list_price_eur": 59.0, "sort_order": 1},
    {"name": "Nordsilk", "tag": "Het haarritueel", "list_price_eur": 47.0, "sort_order": 2},
    {"name": "FREJA (Plantique Omega 3)", "tag": "Het basisritueel", "list_price_eur": 42.0, "sort_order": 3},
    {"name": "HARMADE", "tag": "Het maandritueel", "list_price_eur": 39.0, "sort_order": 4},
]

async def seed():
    async with AsyncSessionLocal() as db:
        for t in TIER_THRESHOLDS:
            db.add(TierThreshold(**t))
        for p in PRODUCTS:
            db.add(Product(id=uuid.uuid4(), **p, active=True))
        await db.commit()
    print("Seed complete")

asyncio.run(seed())
