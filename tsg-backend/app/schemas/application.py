from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.models.application import ApplicationStatusEnum
from app.models.reseller import TierEnum


class ApplicationIn(BaseModel):
    first_name: str
    last_name: str
    company: str
    email: EmailStr
    phone: str | None = None
    message: str | None = None


class ApplicationOut(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    company: str
    email: str
    phone: str | None
    message: str | None
    status: ApplicationStatusEnum
    assigned_tier: TierEnum

    model_config = {"from_attributes": True}
