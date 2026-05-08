import uuid
import enum
from sqlalchemy import String, Enum, Numeric, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB
from app.models.base import Base


class QuotationStatusEnum(str, enum.Enum):
    draft = "draft"
    sent = "sent"
    accepted = "accepted"
    rejected = "rejected"
    expired = "expired"


class Quotation(Base):
    __tablename__ = "quotations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    reseller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False
    )
    tl_quotation_id: Mapped[str | None] = mapped_column(String)
    tl_deal_id: Mapped[str | None] = mapped_column(String)
    status: Mapped[QuotationStatusEnum] = mapped_column(
        Enum(QuotationStatusEnum), default=QuotationStatusEnum.draft
    )
    total_eur: Mapped[float | None] = mapped_column(Numeric(10, 2))
    line_items: Mapped[dict] = mapped_column(JSONB, default=list)
    created_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )
