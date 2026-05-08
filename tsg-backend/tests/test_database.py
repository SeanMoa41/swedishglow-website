import pytest
from app.config import settings
from app.database import get_db

def test_settings_have_database_url():
    assert settings.database_url.startswith("postgresql")

@pytest.mark.asyncio
async def test_get_db_yields_session():
    from sqlalchemy.ext.asyncio import AsyncSession
    gen = get_db()
    session = await gen.__anext__()
    assert isinstance(session, AsyncSession)
    await gen.aclose()
