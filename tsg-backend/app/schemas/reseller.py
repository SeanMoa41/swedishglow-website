from pydantic import BaseModel
from uuid import UUID
from app.models.reseller import TierEnum, ResellerStatusEnum


class ResellerOut(BaseModel):
    id: UUID
    email: str
    first_name: str | None
    last_name: str | None
    company: str | None
    phone: str | None
    country: str | None
    tier: TierEnum
    is_admin: bool

    model_config = {"from_attributes": True}


class ProfileUpdateIn(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    country: str | None = None


class StatsOut(BaseModel):
    revenue_ytd_eur: float
    orders_ytd: int
    discount_pct: float
    next_tier: TierEnum | None
    next_tier_gap_eur: float | None


class TierOut(BaseModel):
    current_tier: TierEnum
    discount_pct: float
    benefits: list[str]
    next_tier: TierEnum | None
    next_tier_min_eur: float | None
    revenue_ytd_eur: float
    progress_pct: float
