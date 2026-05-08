import httpx
from app.config import settings


async def create_user(email: str) -> str:
    """Create Supabase user and return their UUID. Supabase sends invite email."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.supabase_url}/auth/v1/admin/users",
            json={"email": email, "email_confirm": False, "invite": True},
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
            },
        )
        response.raise_for_status()
        return response.json()["id"]
