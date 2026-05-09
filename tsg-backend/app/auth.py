import logging
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.database import get_db
from app.models import Reseller

logger = logging.getLogger("tsg.auth")
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_reseller(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Reseller:
    if settings.local_dev:
        logger.warning("[LOCAL_DEV] auth bypassed, returning dev reseller")
        result = await db.execute(
            select(Reseller).where(Reseller.email == settings.local_dev_reseller_email)
        )
        reseller = result.scalar_one_or_none()
        if not reseller:
            raise HTTPException(
                status_code=500,
                detail="Dev reseller not found — run: cd tsg-backend && python scripts/seed_local.py",
            )
        return reseller

    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise JWTError("No sub claim")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    result = await db.execute(select(Reseller).where(Reseller.id == user_id))
    reseller = result.scalar_one_or_none()
    if not reseller:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Reseller not found")
    if reseller.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account not active")
    return reseller

async def get_current_admin(
    reseller: Reseller = Depends(get_current_reseller),
) -> Reseller:
    if not reseller.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin required")
    return reseller
