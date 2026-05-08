from pydantic import BaseModel
from uuid import UUID
from app.models.quotation import QuotationStatusEnum


class QuotationLineIn(BaseModel):
    product_id: UUID
    quantity: int


class QuotationIn(BaseModel):
    lines: list[QuotationLineIn]


class QuotationOut(BaseModel):
    id: UUID
    tl_quotation_id: str | None
    status: QuotationStatusEnum
    total_eur: float | None
    line_items: list

    model_config = {"from_attributes": True}
