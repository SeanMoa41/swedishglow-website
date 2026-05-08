import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Boolean, Enum, func, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB
from app.models.base import Base


class TierEnum(str, enum.Enum):
    pearl = "pearl"
    rose = "rose"
    pro = "pro"
    elite = "elite"
    black = "black"


class ResellerStatusEnum(str, enum.Enum):
    pending = "pending"
    active = "active"
    inactive = "inactive"


class Reseller(Base):
    __tablename__ = "resellers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)  # supplied by Supabase on account creation
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    first_name: Mapped[str | None] = mapped_column(String)
    last_name: Mapped[str | None] = mapped_column(String)
    company: Mapped[str | None] = mapped_column(String)
    phone: Mapped[str | None] = mapped_column(String)
    country: Mapped[str | None] = mapped_column(String)
    status: Mapped[ResellerStatusEnum] = mapped_column(
        Enum(ResellerStatusEnum), default=ResellerStatusEnum.pending
    )
    tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum), default=TierEnum.pearl)
    tier_override: Mapped[bool] = mapped_column(Boolean, default=False)
    teamleader_id: Mapped[str | None] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class TierThreshold(Base):
    __tablename__ = "tier_thresholds"

    tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum), primary_key=True)
    min_revenue_eur: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    discount_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    benefits: Mapped[list] = mapped_column(JSONB, default=list)
