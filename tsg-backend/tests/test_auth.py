import pytest
from unittest.mock import AsyncMock
from fastapi import HTTPException
from app.auth import get_current_reseller

@pytest.mark.asyncio
async def test_missing_token_raises_401():
    with pytest.raises(HTTPException) as exc:
        await get_current_reseller(credentials=None, db=AsyncMock())
    assert exc.value.status_code == 401

@pytest.mark.asyncio
async def test_invalid_token_raises_401():
    from fastapi.security import HTTPAuthorizationCredentials
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="bad.token.here")
    with pytest.raises(HTTPException) as exc:
        await get_current_reseller(credentials=creds, db=AsyncMock())
    assert exc.value.status_code == 401
