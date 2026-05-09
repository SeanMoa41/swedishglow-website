import uuid
import logging
import httpx
from app.config import settings

BASE_URL = "https://api.focus.teamleader.eu"
logger = logging.getLogger("tsg.teamleader")


async def create_quotation(
    deal_id: str,
    line_items: list[dict],
    discount_pct: float,
) -> dict:
    if settings.local_dev:
        mock_id = f"tl-mock-{uuid.uuid4()}"
        logger.warning("[LOCAL_DEV] mocked create_quotation → %s", mock_id)
        return {"id": mock_id}

    grouped_lines = [
        {
            "line_items": [
                {
                    "quantity": item["quantity"],
                    "description": item["description"],
                    "unit_of_measure_id": item.get("unit_of_measure_id", ""),
                    "unit_price": {"amount": item["unit_price"], "tax": "excluding"},
                    "tax_rate_id": item.get("tax_rate_id", ""),
                    "discount": {"value": discount_pct, "type": "percentage"},
                    "product_id": item.get("product_id"),
                }
                for item in line_items
            ]
        }
    ]
    payload = {
        "deal_id": deal_id,
        "currency": {"code": "EUR"},
        "grouped_lines": grouped_lines,
        "document_template_id": settings.teamleader_document_template_id,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/quotations.create",
            json=payload,
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
        response.raise_for_status()
        return response.json()


async def list_invoices(updated_since: str | None = None, customer_id: str | None = None) -> list[dict]:
    if settings.local_dev:
        logger.warning("[LOCAL_DEV] mocked list_invoices → []")
        return []

    payload: dict = {"page": {"size": 100, "number": 1}}
    invoice_filter: dict = {}
    if updated_since:
        invoice_filter["updated_since"] = updated_since
    if customer_id:
        invoice_filter["customer"] = {"type": "company", "id": customer_id}
    if invoice_filter:
        payload["filter"] = invoice_filter

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/invoices.list",
            json=payload,
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
        response.raise_for_status()
        return response.json().get("data", [])
