from pydantic import BaseModel
from uuid import UUID
from app.models.reseller import TierEnum, ResellerStatusEnum
from app.models.application import ApplicationStatusEnum


class AdminResellerOut(BaseModel):
    id: UUID
    email: str
    first_name: str | None
    last_name: str | None
    company: str | None
    tier: TierEnum
    tier_override: bool
    status: ResellerStatusEnum
    is_admin: bool
    teamleader_id: str | None

    model_config = {"from_attributes": True}


class TierOverrideIn(BaseModel):
    tier: TierEnum


class ApplicationApproveIn(BaseModel):
    assigned_tier: TierEnum = TierEnum.pearl


class RevenueAnalyticsOut(BaseModel):
    monthly: list[dict]
    quarterly: list[dict]
    total_eur: float
    avg_monthly_eur: float


class DownloadAnalyticsOut(BaseModel):
    files: list[dict]
