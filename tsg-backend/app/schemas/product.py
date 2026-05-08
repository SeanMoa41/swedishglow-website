from pydantic import BaseModel
from uuid import UUID


class ProductOut(BaseModel):
    id: UUID
    name: str
    tag: str | None
    description: str | None
    list_price_eur: float
    net_price_eur: float
    image_url: str | None
    sort_order: int

    model_config = {"from_attributes": True}
