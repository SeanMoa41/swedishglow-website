import uuid
import enum
from datetime import datetime, date
from sqlalchemy import String, Enum, Numeric, Date, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.models.base import Base


class InvoiceStatusEnum(str, enum.Enum):
    draft = "draft"
    outstanding = "outstanding"
    paid = "paid"
    overdue = "overdue"


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    reseller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False
    )
    tl_invoice_id: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    invoice_number: Mapped[str | None] = mapped_column(String)
    status: Mapped[InvoiceStatusEnum] = mapped_column(
        Enum(InvoiceStatusEnum), default=InvoiceStatusEnum.outstanding
    )
    total_eur: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    invoice_date: Mapped[date | None] = mapped_column(Date)
    due_date: Mapped[date | None] = mapped_column(Date)
    synced_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
