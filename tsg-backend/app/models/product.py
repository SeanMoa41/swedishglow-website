import uuid
from sqlalchemy import String, Boolean, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    wc_product_id: Mapped[int | None] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String, nullable=False)
    tag: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(String)
    list_price_eur: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
