# TSG Backend Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the FastAPI backend for The Swedish Glow reseller portal — authentication, tier system, TeamLeader quotations, WooCommerce analytics sync, Azure Blob file management, and admin panel.

**Architecture:** FastAPI on Azure Container Apps backed by Azure PostgreSQL. Supabase Auth issues JWTs verified on every request. Three Azure Function ETL jobs sync TeamLeader invoices, WooCommerce orders, and recalculate reseller tiers nightly.

**Tech Stack:** Python 3.12, FastAPI, SQLAlchemy 2 (async), Alembic, asyncpg, Supabase Auth, Azure Blob Storage, httpx, pytest + pytest-asyncio

---

## File Map

```
tsg-backend/
├── app/
│   ├── main.py                        # FastAPI init, routers, CORS
│   ├── config.py                      # Pydantic-settings env vars
│   ├── database.py                    # Async SQLAlchemy engine + session
│   ├── auth.py                        # Supabase JWT dependency
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                    # DeclarativeBase
│   │   ├── reseller.py                # Reseller + TierThreshold
│   │   ├── application.py             # PartnerApplication
│   │   ├── product.py                 # Product
│   │   ├── quotation.py               # Quotation
│   │   ├── invoice.py                 # Invoice
│   │   └── file.py                    # MarketingFile + FileDownload
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── reseller.py                # ResellerOut, StatsOut, TierOut
│   │   ├── application.py             # ApplicationIn, ApplicationOut
│   │   ├── product.py                 # ProductOut
│   │   ├── order.py                   # QuotationIn, QuotationOut
│   │   ├── file.py                    # FileOut, FileUploadIn
│   │   └── admin.py                   # AdminResellerOut, AnalyticsOut
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                    # POST /auth/register-application, GET /auth/me
│   │   ├── resellers.py               # GET /resellers/me/*
│   │   ├── products.py                # GET /products
│   │   ├── orders.py                  # POST /orders/quotation
│   │   ├── files.py                   # GET/POST/DELETE /files
│   │   ├── admin.py                   # /admin/*
│   │   └── webhooks.py                # POST /webhooks/*
│   └── integrations/
│       ├── __init__.py
│       ├── teamleader.py              # TL API client
│       ├── woocommerce.py             # WC REST client
│       └── supabase_admin.py          # Supabase Admin API (create user)
├── etl/
│   ├── shared/
│   │   ├── database.py                # Sync SQLAlchemy engine for Functions
│   │   └── config.py                  # Shared settings
│   ├── wc_orders_sync/
│   │   ├── function.json
│   │   └── __init__.py
│   ├── tl_invoices_sync/
│   │   ├── function.json
│   │   └── __init__.py
│   └── tier_recalculate/
│       ├── function.json
│       └── __init__.py
├── migrations/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
├── tests/
│   ├── conftest.py                    # Fixtures: test DB, test client, mock reseller
│   ├── test_auth.py
│   ├── test_resellers.py
│   ├── test_products.py
│   ├── test_orders.py
│   ├── test_files.py
│   ├── test_admin.py
│   └── test_etl_tier.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── alembic.ini
└── .env.example
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `tsg-backend/requirements.txt`
- Create: `tsg-backend/.env.example`
- Create: `tsg-backend/Dockerfile`
- Create: `tsg-backend/docker-compose.yml`

- [ ] **Step 1: Create the project directory and requirements.txt**

```bash
mkdir tsg-backend && cd tsg-backend
```

`requirements.txt`:
```
fastapi==0.115.5
uvicorn[standard]==0.32.1
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.14.0
pydantic-settings==2.6.1
python-jose[cryptography]==3.3.0
httpx==0.28.0
azure-storage-blob==12.23.1
python-multipart==0.0.18
pytest==8.3.4
pytest-asyncio==0.24.0
```

- [ ] **Step 2: Create .env.example**

```ini
# Database
DATABASE_URL=postgresql+asyncpg://tsg:tsg@localhost:5432/tsg
DATABASE_URL_SYNC=postgresql+psycopg2://tsg:tsg@localhost:5432/tsg

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret

# TeamLeader
TEAMLEADER_CLIENT_ID=
TEAMLEADER_CLIENT_SECRET=
TEAMLEADER_ACCESS_TOKEN=
TEAMLEADER_REFRESH_TOKEN=
TEAMLEADER_DOCUMENT_TEMPLATE_ID=

# WooCommerce
WC_URL=https://theswedishglow.com
WC_CONSUMER_KEY=ck_
WC_CONSUMER_SECRET=cs_

# Azure Blob
AZURE_STORAGE_CONNECTION_STRING=
AZURE_BLOB_CONTAINER=marketing-files

# Webhooks
WEBHOOK_SECRET=change-me-in-prod
```

- [ ] **Step 3: Create Dockerfile**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 4: Create docker-compose.yml**

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: tsg
      POSTGRES_USER: tsg
      POSTGRES_PASSWORD: tsg
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tsg"]
      interval: 5s
      retries: 5

  app:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - .:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- [ ] **Step 5: Create package directories**

```bash
mkdir -p app/models app/schemas app/routers app/integrations
mkdir -p etl/shared etl/wc_orders_sync etl/tl_invoices_sync etl/tier_recalculate
mkdir -p migrations/versions tests
touch app/__init__.py app/models/__init__.py app/schemas/__init__.py
touch app/routers/__init__.py app/integrations/__init__.py
touch etl/shared/__init__.py etl/wc_orders_sync/__init__.py
touch etl/tl_invoices_sync/__init__.py etl/tier_recalculate/__init__.py
```

- [ ] **Step 6: Commit**

```bash
git init
echo "__pycache__/\n*.pyc\n.env\n.pytest_cache/" > .gitignore
git add .
git commit -m "feat: project scaffold"
```

---

## Task 2: Config + Database

**Files:**
- Create: `app/config.py`
- Create: `app/database.py`

- [ ] **Step 1: Write failing test**

`tests/test_database.py`:
```python
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
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd tsg-backend && pip install -r requirements.txt
pytest tests/test_database.py -v
```
Expected: `ModuleNotFoundError: No module named 'app.config'`

- [ ] **Step 3: Create app/config.py**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    database_url_sync: str = ""
    supabase_url: str
    supabase_service_role_key: str
    supabase_jwt_secret: str
    teamleader_client_id: str = ""
    teamleader_client_secret: str = ""
    teamleader_access_token: str = ""
    teamleader_refresh_token: str = ""
    teamleader_document_template_id: str = ""
    wc_url: str = ""
    wc_consumer_key: str = ""
    wc_consumer_secret: str = ""
    azure_storage_connection_string: str = ""
    azure_blob_container: str = "marketing-files"
    webhook_secret: str = "change-me"

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 4: Create app/database.py**

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

- [ ] **Step 5: Copy .env.example to .env and fill local values**

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL=postgresql+asyncpg://tsg:tsg@localhost:5432/tsg
docker-compose up db -d
```

- [ ] **Step 6: Run tests**

```bash
pytest tests/test_database.py -v
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/config.py app/database.py tests/test_database.py
git commit -m "feat: config and async database session"
```

---

## Task 3: SQLAlchemy Models

**Files:**
- Create: `app/models/base.py`
- Create: `app/models/reseller.py`
- Create: `app/models/application.py`
- Create: `app/models/product.py`
- Create: `app/models/quotation.py`
- Create: `app/models/invoice.py`
- Create: `app/models/file.py`

- [ ] **Step 1: Create app/models/base.py**

```python
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
```

- [ ] **Step 2: Create app/models/reseller.py**

```python
import uuid
import enum
from sqlalchemy import String, Boolean, Enum, func, Numeric
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.models.base import Base

class TierEnum(str, enum.Enum):
    pearl = "pearl"
    rose = "rose"
    pro = "pro"
    elite = "elite"
    black = "black"

class ResellerStatusEnum(str, enum.Enum):
    pending = "pending"
    active = "active"
    inactive = "inactive"

class Reseller(Base):
    __tablename__ = "resellers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    first_name: Mapped[str | None] = mapped_column(String)
    last_name: Mapped[str | None] = mapped_column(String)
    company: Mapped[str | None] = mapped_column(String)
    phone: Mapped[str | None] = mapped_column(String)
    country: Mapped[str | None] = mapped_column(String)
    status: Mapped[ResellerStatusEnum] = mapped_column(Enum(ResellerStatusEnum), default=ResellerStatusEnum.pending)
    tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum), default=TierEnum.pearl)
    tier_override: Mapped[bool] = mapped_column(Boolean, default=False)
    teamleader_id: Mapped[str | None] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

class TierThreshold(Base):
    __tablename__ = "tier_thresholds"

    tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum), primary_key=True)
    min_revenue_eur: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    discount_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    benefits: Mapped[dict] = mapped_column(default=list)
```

- [ ] **Step 3: Create app/models/application.py**

```python
import uuid
import enum
from sqlalchemy import String, Enum, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.models.base import Base
from app.models.reseller import TierEnum

class ApplicationStatusEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class PartnerApplication(Base):
    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    company: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str | None] = mapped_column(String)
    message: Mapped[str | None] = mapped_column(String)
    status: Mapped[ApplicationStatusEnum] = mapped_column(Enum(ApplicationStatusEnum), default=ApplicationStatusEnum.pending)
    assigned_tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum), default=TierEnum.pearl)
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("resellers.id"))
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
```

- [ ] **Step 4: Create app/models/product.py**

```python
import uuid
from sqlalchemy import String, Boolean, Integer, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wc_product_id: Mapped[int | None] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String, nullable=False)
    tag: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(String)
    list_price_eur: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
```

- [ ] **Step 5: Create app/models/quotation.py**

```python
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

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reseller_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False)
    tl_quotation_id: Mapped[str | None] = mapped_column(String)
    tl_deal_id: Mapped[str | None] = mapped_column(String)
    status: Mapped[QuotationStatusEnum] = mapped_column(Enum(QuotationStatusEnum), default=QuotationStatusEnum.draft)
    total_eur: Mapped[float | None] = mapped_column(Numeric(10, 2))
    line_items: Mapped[dict] = mapped_column(JSONB, default=list)
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
```

- [ ] **Step 6: Create app/models/invoice.py**

```python
import uuid
import enum
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

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reseller_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False)
    tl_invoice_id: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    invoice_number: Mapped[str | None] = mapped_column(String)
    status: Mapped[InvoiceStatusEnum] = mapped_column(Enum(InvoiceStatusEnum), default=InvoiceStatusEnum.outstanding)
    total_eur: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    invoice_date: Mapped[str | None] = mapped_column(Date)
    due_date: Mapped[str | None] = mapped_column(Date)
    synced_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
```

- [ ] **Step 7: Create app/models/file.py**

```python
import uuid
import enum
from sqlalchemy import String, Enum, Integer, BigInteger, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.models.base import Base

class FileTierEnum(str, enum.Enum):
    all = "all"
    rose = "rose"
    pro = "pro"
    elite = "elite"
    black = "black"

class MarketingFile(Base):
    __tablename__ = "marketing_files"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    blob_url: Mapped[str] = mapped_column(String, nullable=False)
    min_tier: Mapped[FileTierEnum] = mapped_column(Enum(FileTierEnum), default=FileTierEnum.all)
    file_size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("resellers.id"))
    download_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())

class FileDownload(Base):
    __tablename__ = "file_downloads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("marketing_files.id"), nullable=False)
    reseller_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False)
    downloaded_at: Mapped[str] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
```

- [ ] **Step 8: Update app/models/__init__.py to export all models**

```python
from app.models.base import Base
from app.models.reseller import Reseller, TierThreshold, TierEnum, ResellerStatusEnum
from app.models.application import PartnerApplication, ApplicationStatusEnum
from app.models.product import Product
from app.models.quotation import Quotation, QuotationStatusEnum
from app.models.invoice import Invoice, InvoiceStatusEnum
from app.models.file import MarketingFile, FileDownload, FileTierEnum

__all__ = [
    "Base", "Reseller", "TierThreshold", "TierEnum", "ResellerStatusEnum",
    "PartnerApplication", "ApplicationStatusEnum",
    "Product", "Quotation", "QuotationStatusEnum",
    "Invoice", "InvoiceStatusEnum",
    "MarketingFile", "FileDownload", "FileTierEnum",
]
```

- [ ] **Step 9: Write model import test**

`tests/test_models.py`:
```python
from app.models import (
    Reseller, TierThreshold, PartnerApplication,
    Product, Quotation, Invoice, MarketingFile, FileDownload
)

def test_all_models_importable():
    assert Reseller.__tablename__ == "resellers"
    assert TierThreshold.__tablename__ == "tier_thresholds"
    assert PartnerApplication.__tablename__ == "applications"
    assert Product.__tablename__ == "products"
    assert Quotation.__tablename__ == "quotations"
    assert Invoice.__tablename__ == "invoices"
    assert MarketingFile.__tablename__ == "marketing_files"
    assert FileDownload.__tablename__ == "file_downloads"
```

- [ ] **Step 10: Run tests**

```bash
pytest tests/test_models.py -v
```
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add app/models/ tests/test_models.py
git commit -m "feat: SQLAlchemy ORM models"
```

---

## Task 4: Alembic Migrations

**Files:**
- Create: `alembic.ini`
- Create: `migrations/env.py`
- Create: `migrations/versions/0001_initial.py`

- [ ] **Step 1: Initialise Alembic**

```bash
alembic init migrations
```

- [ ] **Step 2: Edit alembic.ini — set sqlalchemy.url**

In `alembic.ini`, replace the `sqlalchemy.url` line:
```ini
sqlalchemy.url = postgresql+psycopg2://tsg:tsg@localhost:5432/tsg
```

- [ ] **Step 3: Edit migrations/env.py to import models**

Replace the `target_metadata` section in `migrations/env.py`:
```python
from app.models import Base
target_metadata = Base.metadata
```

Also add at top of file:
```python
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
```

- [ ] **Step 4: Install psycopg2 for Alembic (sync driver)**

Add to `requirements.txt`:
```
psycopg2-binary==2.9.10
```
```bash
pip install psycopg2-binary
```

- [ ] **Step 5: Generate initial migration**

```bash
alembic revision --autogenerate -m "initial schema"
```
Expected: creates `migrations/versions/xxxx_initial_schema.py`

- [ ] **Step 6: Apply migration**

```bash
alembic upgrade head
```
Expected: all tables created in local PostgreSQL

- [ ] **Step 7: Verify tables exist**

```bash
docker-compose exec db psql -U tsg -d tsg -c "\dt"
```
Expected: lists resellers, tier_thresholds, applications, products, quotations, invoices, marketing_files, file_downloads

- [ ] **Step 8: Commit**

```bash
git add alembic.ini migrations/
git commit -m "feat: initial Alembic migration"
```

---

## Task 5: FastAPI App + Health Check

**Files:**
- Create: `app/main.py`
- Test: `tests/conftest.py`
- Test: `tests/test_health.py`

- [ ] **Step 1: Write failing test**

`tests/test_health.py`:
```python
from httpx import AsyncClient, ASGITransport
import pytest
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 2: Run to verify it fails**

```bash
pytest tests/test_health.py -v
```
Expected: `ModuleNotFoundError: No module named 'app.main'`

- [ ] **Step 3: Create app/main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TSG Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://theswedishglow.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 4: Create tests/conftest.py**

```python
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
```

Create `pytest.ini`:
```ini
[pytest]
asyncio_mode = auto
```

- [ ] **Step 5: Run tests**

```bash
pytest tests/test_health.py -v
```
Expected: PASS

- [ ] **Step 6: Start the server and verify manually**

```bash
docker-compose up -d
uvicorn app.main:app --reload
# In another terminal:
curl http://localhost:8000/health
```
Expected: `{"status":"ok"}`

- [ ] **Step 7: Commit**

```bash
git add app/main.py tests/conftest.py tests/test_health.py pytest.ini
git commit -m "feat: FastAPI app with health check and CORS"
```

---

## Task 6: Supabase JWT Auth

**Files:**
- Create: `app/auth.py`
- Test: `tests/test_auth.py`

- [ ] **Step 1: Write failing test**

`tests/test_auth.py`:
```python
import pytest
from unittest.mock import patch, AsyncMock
from fastapi import HTTPException
from app.auth import get_current_reseller

@pytest.mark.asyncio
async def test_missing_token_raises_401():
    from fastapi.security import HTTPAuthorizationCredentials
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
```

- [ ] **Step 2: Run to verify it fails**

```bash
pytest tests/test_auth.py -v
```
Expected: `ModuleNotFoundError: No module named 'app.auth'`

- [ ] **Step 3: Create app/auth.py**

```python
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.config import settings
from app.database import get_db
from app.models import Reseller

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_reseller(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Reseller:
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
```

- [ ] **Step 4: Run tests**

```bash
pytest tests/test_auth.py -v
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/auth.py tests/test_auth.py
git commit -m "feat: Supabase JWT auth dependency"
```

---

## Task 7: Reseller Schemas + /auth/me + /resellers/me Endpoints

**Files:**
- Create: `app/schemas/reseller.py`
- Create: `app/routers/auth.py`
- Create: `app/routers/resellers.py`
- Modify: `app/main.py`
- Test: `tests/test_resellers.py`

- [ ] **Step 1: Create app/schemas/reseller.py**

```python
from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.models.reseller import TierEnum, ResellerStatusEnum

class ResellerOut(BaseModel):
    id: UUID
    email: str
    first_name: str | None
    last_name: str | None
    company: str | None
    phone: str | None
    country: str | None
    tier: TierEnum
    is_admin: bool

    class Config:
        from_attributes = True

class ProfileUpdateIn(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    country: str | None = None

class StatsOut(BaseModel):
    revenue_ytd_eur: float
    orders_ytd: int
    discount_pct: float
    next_tier: TierEnum | None
    next_tier_gap_eur: float | None

class TierOut(BaseModel):
    current_tier: TierEnum
    discount_pct: float
    benefits: list[str]
    next_tier: TierEnum | None
    next_tier_min_eur: float | None
    revenue_ytd_eur: float
    progress_pct: float
```

- [ ] **Step 2: Create app/schemas/application.py**

```python
from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.models.application import ApplicationStatusEnum
from app.models.reseller import TierEnum

class ApplicationIn(BaseModel):
    first_name: str
    last_name: str
    company: str
    email: EmailStr
    phone: str | None = None
    message: str | None = None

class ApplicationOut(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    company: str
    email: str
    phone: str | None
    message: str | None
    status: ApplicationStatusEnum
    assigned_tier: TierEnum

    class Config:
        from_attributes = True
```

- [ ] **Step 3: Write failing tests**

`tests/test_resellers.py`:
```python
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

@pytest.mark.asyncio
async def test_get_me_returns_reseller_profile(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "test@example.com"
    mock_reseller.first_name = "Jan"
    mock_reseller.last_name = "de Vries"
    mock_reseller.company = "Test BV"
    mock_reseller.phone = None
    mock_reseller.country = "NL"
    mock_reseller.tier = "pearl"
    mock_reseller.is_admin = False

    with patch("app.routers.auth.get_current_reseller", return_value=mock_reseller):
        response = await client.get("/auth/me", headers={"Authorization": "Bearer fake"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_register_application_success(client):
    with patch("app.routers.auth.AsyncSession") as mock_db:
        mock_db.return_value.__aenter__.return_value.add = MagicMock()
        mock_db.return_value.__aenter__.return_value.commit = AsyncMock()
        response = await client.post("/auth/register-application", json={
            "first_name": "Anna",
            "last_name": "Lindqvist",
            "company": "Beauty BV",
            "email": "anna@beauty.nl",
            "phone": "+31612345678",
            "message": "Interested in partnership"
        })
    assert response.status_code in (200, 201)
```

- [ ] **Step 4: Run to verify they fail**

```bash
pytest tests/test_resellers.py -v
```
Expected: FAIL (routers not registered)

- [ ] **Step 5: Create app/routers/auth.py**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, PartnerApplication
from app.schemas.reseller import ResellerOut
from app.schemas.application import ApplicationIn, ApplicationOut

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register-application", response_model=ApplicationOut, status_code=201)
async def register_application(body: ApplicationIn, db: AsyncSession = Depends(get_db)):
    application = PartnerApplication(**body.model_dump())
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application

@router.get("/me", response_model=ResellerOut)
async def get_me(reseller: Reseller = Depends(get_current_reseller)):
    return reseller
```

- [ ] **Step 6: Create app/routers/resellers.py**

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Invoice, TierThreshold, TierEnum
from app.schemas.reseller import ResellerOut, StatsOut, TierOut, ProfileUpdateIn

router = APIRouter(prefix="/resellers", tags=["resellers"])

TIER_ORDER = [TierEnum.pearl, TierEnum.rose, TierEnum.pro, TierEnum.elite, TierEnum.black]

@router.get("/me/stats", response_model=StatsOut)
async def get_stats(reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    current_year = datetime.utcnow().year
    result = await db.execute(
        select(func.sum(Invoice.total_eur), func.count(Invoice.id))
        .where(Invoice.reseller_id == reseller.id)
        .where(Invoice.status == "paid")
        .where(extract("year", Invoice.invoice_date) == current_year)
    )
    row = result.one()
    revenue = float(row[0] or 0)
    orders = int(row[1] or 0)

    thresholds = {t.tier: t for t in (await db.execute(select(TierThreshold))).scalars().all()}
    current_threshold = thresholds.get(reseller.tier)
    discount_pct = float(current_threshold.discount_pct) if current_threshold else 0.0

    current_idx = TIER_ORDER.index(reseller.tier)
    next_tier = TIER_ORDER[current_idx + 1] if current_idx < len(TIER_ORDER) - 1 else None
    next_threshold = thresholds.get(next_tier) if next_tier else None
    gap = max(0, float(next_threshold.min_revenue_eur) - revenue) if next_threshold else None

    return StatsOut(
        revenue_ytd_eur=revenue,
        orders_ytd=orders,
        discount_pct=discount_pct,
        next_tier=next_tier,
        next_tier_gap_eur=gap,
    )

@router.get("/me/tier", response_model=TierOut)
async def get_tier(reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    current_year = datetime.utcnow().year
    revenue_result = await db.execute(
        select(func.sum(Invoice.total_eur))
        .where(Invoice.reseller_id == reseller.id)
        .where(Invoice.status == "paid")
        .where(extract("year", Invoice.invoice_date) == current_year)
    )
    revenue = float(revenue_result.scalar() or 0)

    thresholds = {t.tier: t for t in (await db.execute(select(TierThreshold))).scalars().all()}
    current_threshold = thresholds.get(reseller.tier)
    discount_pct = float(current_threshold.discount_pct) if current_threshold else 0.0
    benefits = list(current_threshold.benefits) if current_threshold else []

    current_idx = TIER_ORDER.index(reseller.tier)
    next_tier = TIER_ORDER[current_idx + 1] if current_idx < len(TIER_ORDER) - 1 else None
    next_threshold = thresholds.get(next_tier) if next_tier else None
    next_min = float(next_threshold.min_revenue_eur) if next_threshold else None
    progress = (revenue / next_min * 100) if next_min and next_min > 0 else 100.0

    return TierOut(
        current_tier=reseller.tier,
        discount_pct=discount_pct,
        benefits=benefits,
        next_tier=next_tier,
        next_tier_min_eur=next_min,
        revenue_ytd_eur=revenue,
        progress_pct=min(progress, 100.0),
    )

@router.put("/me/profile", response_model=ResellerOut)
async def update_profile(
    body: ProfileUpdateIn,
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(reseller, field, value)
    await db.commit()
    await db.refresh(reseller)
    return reseller
```

- [ ] **Step 7: Register routers in app/main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, resellers

app = FastAPI(title="TSG Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://theswedishglow.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resellers.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 8: Run tests**

```bash
pytest tests/ -v
```
Expected: All PASS

- [ ] **Step 9: Commit**

```bash
git add app/schemas/ app/routers/auth.py app/routers/resellers.py app/main.py tests/test_resellers.py
git commit -m "feat: /auth/me and /resellers/me/* endpoints"
```

---

## Task 8: Products Endpoint

**Files:**
- Create: `app/schemas/product.py`
- Create: `app/routers/products.py`
- Modify: `app/main.py`
- Test: `tests/test_products.py`

- [ ] **Step 1: Create app/schemas/product.py**

```python
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

    class Config:
        from_attributes = True
```

- [ ] **Step 2: Write failing test**

`tests/test_products.py`:
```python
import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4

@pytest.mark.asyncio
async def test_products_returns_net_price(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "rose"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False

    with patch("app.routers.products.get_current_reseller", return_value=mock_reseller), \
         patch("app.routers.products.get_db"):
        response = await client.get("/products", headers={"Authorization": "Bearer fake"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

- [ ] **Step 3: Run to verify it fails**

```bash
pytest tests/test_products.py -v
```
Expected: FAIL

- [ ] **Step 4: Create app/routers/products.py**

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, TierThreshold
from app.schemas.product import ProductOut

router = APIRouter(prefix="/products", tags=["products"])

@router.get("", response_model=list[ProductOut])
async def list_products(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    threshold_result = await db.execute(
        select(TierThreshold).where(TierThreshold.tier == reseller.tier)
    )
    threshold = threshold_result.scalar_one_or_none()
    discount_pct = float(threshold.discount_pct) if threshold else 0.0

    products_result = await db.execute(
        select(Product).where(Product.active == True).order_by(Product.sort_order)
    )
    products = products_result.scalars().all()

    return [
        ProductOut(
            **{c.key: getattr(p, c.key) for c in Product.__table__.columns},
            net_price_eur=round(float(p.list_price_eur) * (1 - discount_pct / 100), 2),
        )
        for p in products
    ]
```

- [ ] **Step 5: Register router in app/main.py**

Add to imports and registration:
```python
from app.routers import auth, resellers, products
# ...
app.include_router(products.router)
```

- [ ] **Step 6: Run tests**

```bash
pytest tests/test_products.py -v
```
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/schemas/product.py app/routers/products.py app/main.py tests/test_products.py
git commit -m "feat: /products endpoint with tier-discounted pricing"
```

---

## Task 9: TeamLeader Client + Orders Endpoint

**Files:**
- Create: `app/integrations/teamleader.py`
- Create: `app/schemas/order.py`
- Create: `app/routers/orders.py`
- Modify: `app/main.py`
- Test: `tests/test_orders.py`

- [ ] **Step 1: Create app/integrations/teamleader.py**

```python
import httpx
from app.config import settings

BASE_URL = "https://api.focus.teamleader.eu"

async def create_quotation(
    deal_id: str,
    line_items: list[dict],
    discount_pct: float,
) -> dict:
    """
    line_items: [{"product_id": str, "description": str, "quantity": int, "unit_price": float}]
    Returns the TeamLeader API response dict.
    """
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
        response = client.post(
            f"{BASE_URL}/quotations.create",
            json=payload,
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
        response.raise_for_status()
        return response.json()

async def list_invoices(updated_since: str | None = None, customer_id: str | None = None) -> list[dict]:
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
```

- [ ] **Step 2: Create app/schemas/order.py**

```python
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

    class Config:
        from_attributes = True
```

- [ ] **Step 3: Write failing test**

`tests/test_orders.py`:
```python
import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from uuid import uuid4

@pytest.mark.asyncio
async def test_create_quotation_missing_teamleader_id_raises_400(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "rose"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False
    mock_reseller.teamleader_id = None  # not linked to TL

    with patch("app.routers.orders.get_current_reseller", return_value=mock_reseller), \
         patch("app.routers.orders.get_db"):
        response = await client.post(
            "/orders/quotation",
            json={"lines": [{"product_id": str(uuid4()), "quantity": 2}]},
            headers={"Authorization": "Bearer fake"},
        )
    assert response.status_code == 400
```

- [ ] **Step 4: Run to verify it fails**

```bash
pytest tests/test_orders.py -v
```
Expected: FAIL

- [ ] **Step 5: Create app/routers/orders.py**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, Quotation, TierThreshold
from app.schemas.order import QuotationIn, QuotationOut
from app.integrations import teamleader

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/quotation", response_model=QuotationOut, status_code=201)
async def create_quotation(
    body: QuotationIn,
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    if not reseller.teamleader_id:
        raise HTTPException(status_code=400, detail="Reseller not linked to TeamLeader")

    threshold_result = await db.execute(
        select(TierThreshold).where(TierThreshold.tier == reseller.tier)
    )
    threshold = threshold_result.scalar_one_or_none()
    discount_pct = float(threshold.discount_pct) if threshold else 0.0

    line_items = []
    total = 0.0
    for line in body.lines:
        product_result = await db.execute(select(Product).where(Product.id == line.product_id))
        product = product_result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {line.product_id} not found")
        net_price = float(product.list_price_eur) * (1 - discount_pct / 100)
        total += net_price * line.quantity
        line_items.append({
            "product_id": str(product.id),
            "description": product.name,
            "quantity": line.quantity,
            "unit_price": float(product.list_price_eur),
        })

    tl_response = await teamleader.create_quotation(
        deal_id=reseller.teamleader_id,
        line_items=line_items,
        discount_pct=discount_pct,
    )

    quotation = Quotation(
        reseller_id=reseller.id,
        tl_quotation_id=tl_response.get("quotation_id"),
        tl_deal_id=reseller.teamleader_id,
        status="draft",
        total_eur=total,
        line_items=line_items,
    )
    db.add(quotation)
    await db.commit()
    await db.refresh(quotation)
    return quotation
```

- [ ] **Step 6: Register router in app/main.py**

```python
from app.routers import auth, resellers, products, orders
app.include_router(orders.router)
```

- [ ] **Step 7: Run tests**

```bash
pytest tests/test_orders.py -v
```
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/integrations/teamleader.py app/schemas/order.py app/routers/orders.py app/main.py tests/test_orders.py
git commit -m "feat: TeamLeader client and /orders/quotation endpoint"
```

---

## Task 10: Azure Blob + Files Endpoints

**Files:**
- Create: `app/integrations/blob.py`
- Create: `app/schemas/file.py`
- Create: `app/routers/files.py`
- Modify: `app/main.py`
- Test: `tests/test_files.py`

- [ ] **Step 1: Create app/integrations/blob.py**

```python
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta, timezone
from app.config import settings

def get_blob_client():
    return BlobServiceClient.from_connection_string(settings.azure_storage_connection_string)

async def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    client = get_blob_client()
    container = client.get_container_client(settings.azure_blob_container)
    blob = container.get_blob_client(filename)
    blob.upload_blob(file_bytes, overwrite=True, content_settings={"content_type": content_type})
    return blob.url

def generate_download_url(blob_name: str, expiry_minutes: int = 60) -> str:
    client = get_blob_client()
    account_name = client.account_name
    account_key = client.credential.account_key
    sas = generate_blob_sas(
        account_name=account_name,
        container_name=settings.azure_blob_container,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes),
    )
    return f"https://{account_name}.blob.core.windows.net/{settings.azure_blob_container}/{blob_name}?{sas}"

async def delete_file(blob_name: str) -> None:
    client = get_blob_client()
    client.get_container_client(settings.azure_blob_container).delete_blob(blob_name)
```

- [ ] **Step 2: Create app/schemas/file.py**

```python
from pydantic import BaseModel
from uuid import UUID
from app.models.file import FileTierEnum

TIER_RANK = {"all": 0, "rose": 1, "pro": 2, "elite": 3, "black": 4}
RESELLER_TIER_RANK = {"pearl": 0, "rose": 1, "pro": 2, "elite": 3, "black": 4}

class FileOut(BaseModel):
    id: UUID
    name: str
    min_tier: FileTierEnum
    file_size_bytes: int | None
    download_count: int
    accessible: bool

    class Config:
        from_attributes = True

class FileListOut(BaseModel):
    accessible: list[FileOut]
    locked: list[FileOut]
```

- [ ] **Step 3: Write failing test**

`tests/test_files.py`:
```python
import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4

@pytest.mark.asyncio
async def test_files_list_returns_accessible_and_locked(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "pearl"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False

    with patch("app.routers.files.get_current_reseller", return_value=mock_reseller), \
         patch("app.routers.files.get_db"):
        response = await client.get("/files", headers={"Authorization": "Bearer fake"})
    assert response.status_code == 200
    assert "accessible" in response.json()
    assert "locked" in response.json()
```

- [ ] **Step 4: Run to verify it fails**

```bash
pytest tests/test_files.py::test_files_list_returns_accessible_and_locked -v
```
Expected: FAIL

- [ ] **Step 5: Create app/routers/files.py**

```python
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.auth import get_current_reseller, get_current_admin
from app.models import Reseller, MarketingFile, FileDownload
from app.schemas.file import FileOut, FileListOut, TIER_RANK, RESELLER_TIER_RANK
from app.integrations import blob

router = APIRouter(prefix="/files", tags=["files"])

def _can_access(file_tier: str, reseller_tier: str) -> bool:
    return RESELLER_TIER_RANK.get(reseller_tier, 0) >= TIER_RANK.get(file_tier, 0)

@router.get("", response_model=FileListOut)
async def list_files(reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MarketingFile).order_by(MarketingFile.created_at.desc()))
    files = result.scalars().all()
    accessible, locked = [], []
    for f in files:
        out = FileOut(
            id=f.id, name=f.name, min_tier=f.min_tier,
            file_size_bytes=f.file_size_bytes, download_count=f.download_count,
            accessible=_can_access(f.min_tier, reseller.tier),
        )
        (accessible if out.accessible else locked).append(out)
    return FileListOut(accessible=accessible, locked=locked)

@router.get("/{file_id}/download")
async def download_file(file_id: uuid.UUID, reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MarketingFile).where(MarketingFile.id == file_id))
    f = result.scalar_one_or_none()
    if not f:
        raise HTTPException(status_code=404)
    if not _can_access(f.min_tier, reseller.tier):
        raise HTTPException(status_code=403, detail="Upgrade your tier to access this file")
    db.add(FileDownload(file_id=file_id, reseller_id=reseller.id))
    await db.execute(update(MarketingFile).where(MarketingFile.id == file_id).values(download_count=MarketingFile.download_count + 1))
    await db.commit()
    blob_name = f.blob_url.split("/")[-1]
    signed_url = blob.generate_download_url(blob_name)
    return RedirectResponse(url=signed_url)

@router.post("", response_model=FileOut, status_code=201)
async def upload_file(
    name: str = Form(...),
    min_tier: str = Form("all"),
    file: UploadFile = File(...),
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    filename = f"{uuid.uuid4()}-{file.filename}"
    url = await blob.upload_file(content, filename, file.content_type or "application/octet-stream")
    record = MarketingFile(
        name=name, blob_url=url, min_tier=min_tier,
        file_size_bytes=len(content), uploaded_by=admin.id,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return FileOut(accessible=True, **{c.key: getattr(record, c.key) for c in MarketingFile.__table__.columns})

@router.delete("/{file_id}", status_code=204)
async def delete_file(file_id: uuid.UUID, admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MarketingFile).where(MarketingFile.id == file_id))
    f = result.scalar_one_or_none()
    if not f:
        raise HTTPException(status_code=404)
    blob_name = f.blob_url.split("/")[-1]
    await blob.delete_file(blob_name)
    await db.delete(f)
    await db.commit()
```

- [ ] **Step 6: Register router in app/main.py**

```python
from app.routers import auth, resellers, products, orders, files
app.include_router(files.router)
```

- [ ] **Step 7: Run tests**

```bash
pytest tests/test_files.py -v
```
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/integrations/blob.py app/schemas/file.py app/routers/files.py app/main.py tests/test_files.py
git commit -m "feat: Azure Blob integration and /files endpoints"
```

---

## Task 11: Supabase Admin Client + Admin Endpoints

**Files:**
- Create: `app/integrations/supabase_admin.py`
- Create: `app/schemas/admin.py`
- Create: `app/routers/admin.py`
- Modify: `app/main.py`
- Test: `tests/test_admin.py`

- [ ] **Step 1: Create app/integrations/supabase_admin.py**

```python
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
```

- [ ] **Step 2: Create app/schemas/admin.py**

```python
from pydantic import BaseModel
from uuid import UUID
from app.models.reseller import TierEnum, ResellerStatusEnum
from app.models.application import ApplicationStatusEnum

class AdminResellerOut(BaseModel):
    id: UUID
    email: str
    first_name: str | None
    last_name: str | None
    company: str | None
    tier: TierEnum
    tier_override: bool
    status: ResellerStatusEnum
    is_admin: bool
    teamleader_id: str | None

    class Config:
        from_attributes = True

class TierOverrideIn(BaseModel):
    tier: TierEnum

class ApplicationApproveIn(BaseModel):
    assigned_tier: TierEnum = TierEnum.pearl

class RevenueAnalyticsOut(BaseModel):
    monthly: list[dict]
    quarterly: list[dict]
    total_eur: float
    avg_monthly_eur: float

class DownloadAnalyticsOut(BaseModel):
    files: list[dict]
```

- [ ] **Step 3: Write failing test**

`tests/test_admin.py`:
```python
import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from uuid import uuid4

@pytest.mark.asyncio
async def test_non_admin_cannot_access_admin_endpoints(client):
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.tier = "rose"
    mock_reseller.status = "active"
    mock_reseller.is_admin = False

    with patch("app.routers.admin.get_current_admin", side_effect=Exception("forbidden")):
        response = await client.get("/admin/resellers", headers={"Authorization": "Bearer fake"})
    assert response.status_code in (403, 422, 500)

@pytest.mark.asyncio
async def test_admin_can_list_applications(client):
    mock_admin = MagicMock()
    mock_admin.id = uuid4()
    mock_admin.is_admin = True
    mock_admin.status = "active"
    mock_admin.tier = "black"

    with patch("app.routers.admin.get_current_admin", return_value=mock_admin), \
         patch("app.routers.admin.get_db"):
        response = await client.get("/admin/applications", headers={"Authorization": "Bearer fake"})
    assert response.status_code == 200
```

- [ ] **Step 4: Run to verify it fails**

```bash
pytest tests/test_admin.py -v
```
Expected: FAIL

- [ ] **Step 5: Create app/routers/admin.py**

```python
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime
from app.database import get_db
from app.auth import get_current_admin
from app.models import (
    Reseller, PartnerApplication, Invoice, MarketingFile,
    FileDownload, ApplicationStatusEnum, TierEnum
)
from app.schemas.admin import (
    AdminResellerOut, TierOverrideIn, ApplicationApproveIn,
    RevenueAnalyticsOut, DownloadAnalyticsOut
)
from app.schemas.application import ApplicationOut
from app.integrations import supabase_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/applications", response_model=list[ApplicationOut])
async def list_applications(admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PartnerApplication)
        .where(PartnerApplication.status == ApplicationStatusEnum.pending)
        .order_by(PartnerApplication.created_at.desc())
    )
    return result.scalars().all()

@router.post("/applications/{application_id}/approve", response_model=ApplicationOut)
async def approve_application(
    application_id: uuid.UUID,
    body: ApplicationApproveIn,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PartnerApplication).where(PartnerApplication.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404)

    supabase_user_id = await supabase_admin.create_user(application.email)

    reseller = Reseller(
        id=uuid.UUID(supabase_user_id),
        email=application.email,
        first_name=application.first_name,
        last_name=application.last_name,
        company=application.company,
        phone=application.phone,
        tier=body.assigned_tier,
        status="active",
    )
    db.add(reseller)
    application.status = ApplicationStatusEnum.approved
    application.assigned_tier = body.assigned_tier
    application.reviewed_by = admin.id
    await db.commit()
    await db.refresh(application)
    return application

@router.post("/applications/{application_id}/reject", response_model=ApplicationOut)
async def reject_application(
    application_id: uuid.UUID,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PartnerApplication).where(PartnerApplication.id == application_id))
    application = result.scalar_one_or_none()
    if not application:
        raise HTTPException(status_code=404)
    application.status = ApplicationStatusEnum.rejected
    application.reviewed_by = admin.id
    await db.commit()
    await db.refresh(application)
    return application

@router.get("/resellers", response_model=list[AdminResellerOut])
async def list_resellers(admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reseller).order_by(Reseller.created_at.desc()))
    return result.scalars().all()

@router.put("/resellers/{reseller_id}/tier", response_model=AdminResellerOut)
async def override_tier(
    reseller_id: uuid.UUID,
    body: TierOverrideIn,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Reseller).where(Reseller.id == reseller_id))
    reseller = result.scalar_one_or_none()
    if not reseller:
        raise HTTPException(status_code=404)
    reseller.tier = body.tier
    reseller.tier_override = True
    await db.commit()
    await db.refresh(reseller)
    return reseller

@router.get("/analytics/revenue", response_model=RevenueAnalyticsOut)
async def revenue_analytics(admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(
            extract("year", Invoice.invoice_date).label("year"),
            extract("month", Invoice.invoice_date).label("month"),
            func.sum(Invoice.total_eur).label("total"),
        )
        .where(Invoice.status == "paid")
        .group_by("year", "month")
        .order_by("year", "month")
    )
    rows = result.all()
    monthly = [{"year": int(r.year), "month": int(r.month), "total_eur": float(r.total)} for r in rows]
    quarters: dict = {}
    for m in monthly:
        q = f"{m['year']}-Q{(m['month'] - 1) // 3 + 1}"
        quarters[q] = quarters.get(q, 0) + m["total_eur"]
    quarterly = [{"quarter": k, "total_eur": round(v, 2)} for k, v in sorted(quarters.items())]
    total = sum(m["total_eur"] for m in monthly)
    avg = total / len(monthly) if monthly else 0
    return RevenueAnalyticsOut(monthly=monthly, quarterly=quarterly, total_eur=total, avg_monthly_eur=avg)

@router.get("/analytics/b2c")
async def b2c_analytics(admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    from app.models.invoice import Invoice as Inv
    # wc_orders table — basic count + sum
    from sqlalchemy import text
    result = await db.execute(text("SELECT COUNT(*), COALESCE(SUM(total_eur),0) FROM wc_orders"))
    row = result.one()
    return {"order_count": int(row[0]), "total_eur": float(row[1])}

@router.get("/analytics/downloads", response_model=DownloadAnalyticsOut)
async def download_analytics(admin: Reseller = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MarketingFile.name, MarketingFile.download_count)
        .order_by(MarketingFile.download_count.desc())
    )
    files = [{"name": r.name, "download_count": r.download_count} for r in result.all()]
    return DownloadAnalyticsOut(files=files)
```

- [ ] **Step 6: Register router in app/main.py**

```python
from app.routers import auth, resellers, products, orders, files, admin
app.include_router(admin.router)
```

- [ ] **Step 7: Run tests**

```bash
pytest tests/test_admin.py -v
```
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/integrations/supabase_admin.py app/schemas/admin.py app/routers/admin.py app/main.py tests/test_admin.py
git commit -m "feat: admin endpoints — applications, tier override, analytics"
```

---

## Task 12: Webhooks

**Files:**
- Create: `app/routers/webhooks.py`
- Modify: `app/main.py`
- Test: `tests/test_webhooks.py`

- [ ] **Step 1: Write failing test**

`tests/test_webhooks.py`:
```python
import pytest
from app.config import settings

@pytest.mark.asyncio
async def test_webhook_wrong_secret_returns_401(client):
    response = await client.post(
        "/webhooks/woocommerce",
        json={"action": "woocommerce_order_status_changed"},
        headers={"X-Webhook-Secret": "wrong-secret"},
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_woocommerce_webhook_valid_secret(client):
    response = await client.post(
        "/webhooks/woocommerce",
        json={"id": 999, "status": "completed"},
        headers={"X-Webhook-Secret": settings.webhook_secret},
    )
    assert response.status_code == 200
```

- [ ] **Step 2: Run to verify it fails**

```bash
pytest tests/test_webhooks.py -v
```
Expected: FAIL

- [ ] **Step 3: Create app/routers/webhooks.py**

```python
from fastapi import APIRouter, Request, HTTPException, Header
from typing import Optional
from app.config import settings

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

def _verify_secret(secret: Optional[str]):
    if secret != settings.webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")

@router.post("/woocommerce")
async def woocommerce_webhook(request: Request, x_webhook_secret: Optional[str] = Header(None)):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    # ETL handles full sync on schedule; webhook triggers lightweight status update
    order_id = payload.get("id")
    status = payload.get("status")
    if order_id and status:
        from app.database import AsyncSessionLocal
        from app.models.invoice import Invoice
        from sqlalchemy import text
        async with AsyncSessionLocal() as db:
            await db.execute(
                text("UPDATE wc_orders SET status = :status WHERE wc_order_id = :id"),
                {"status": status, "id": order_id},
            )
            await db.commit()
    return {"received": True}

@router.post("/teamleader")
async def teamleader_webhook(request: Request, x_webhook_secret: Optional[str] = Header(None)):
    _verify_secret(x_webhook_secret)
    payload = await request.json()
    # TeamLeader sends invoice status changes — update local record
    tl_invoice_id = payload.get("id")
    new_status = payload.get("status")
    if tl_invoice_id and new_status:
        from app.database import AsyncSessionLocal
        from app.models import Invoice
        from sqlalchemy import select
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Invoice).where(Invoice.tl_invoice_id == tl_invoice_id))
            invoice = result.scalar_one_or_none()
            if invoice:
                invoice.status = new_status
                await db.commit()
    return {"received": True}
```

- [ ] **Step 4: Register router in app/main.py**

```python
from app.routers import auth, resellers, products, orders, files, admin, webhooks
app.include_router(webhooks.router)
```

- [ ] **Step 5: Run tests**

```bash
pytest tests/test_webhooks.py -v
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/routers/webhooks.py app/main.py tests/test_webhooks.py
git commit -m "feat: webhook endpoints for WooCommerce and TeamLeader"
```

---

## Task 13: ETL — WooCommerce Order Sync

**Files:**
- Create: `etl/shared/config.py`
- Create: `etl/shared/database.py`
- Create: `etl/wc_orders_sync/__init__.py`
- Create: `etl/wc_orders_sync/function.json`

- [ ] **Step 1: Create etl/shared/config.py**

```python
import os

WC_URL = os.environ["WC_URL"]
WC_CONSUMER_KEY = os.environ["WC_CONSUMER_KEY"]
WC_CONSUMER_SECRET = os.environ["WC_CONSUMER_SECRET"]
DATABASE_URL_SYNC = os.environ["DATABASE_URL_SYNC"]
TEAMLEADER_ACCESS_TOKEN = os.environ.get("TEAMLEADER_ACCESS_TOKEN", "")
```

- [ ] **Step 2: Create etl/shared/database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from etl.shared.config import DATABASE_URL_SYNC

engine = create_engine(DATABASE_URL_SYNC)
SessionLocal = sessionmaker(bind=engine)
```

- [ ] **Step 3: Create etl/wc_orders_sync/function.json**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */30 * * * *"
    }
  ]
}
```

- [ ] **Step 4: Create etl/wc_orders_sync/__init__.py**

```python
import logging
import requests
from datetime import datetime, timedelta
from sqlalchemy import text
from etl.shared.database import SessionLocal
from etl.shared.config import WC_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET

def main(timer) -> None:
    logging.info("WooCommerce order sync started")
    session = SessionLocal()
    try:
        # Get last sync timestamp
        result = session.execute(text("SELECT MAX(synced_at) FROM wc_orders")).scalar()
        after = (result - timedelta(minutes=5)).isoformat() if result else "2020-01-01T00:00:00"

        page = 1
        synced = 0
        while True:
            response = requests.get(
                f"{WC_URL}/wp-json/wc/v3/orders",
                auth=(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
                params={"after": after, "per_page": 100, "page": page, "status": "completed"},
            )
            response.raise_for_status()
            orders = response.json()
            if not orders:
                break
            for order in orders:
                session.execute(text("""
                    INSERT INTO wc_orders (id, wc_order_id, customer_email, status, payment_method, total_eur, line_items, order_date, synced_at)
                    VALUES (gen_random_uuid(), :wc_id, :email, :status, :payment, :total, :items::jsonb, :order_date, now())
                    ON CONFLICT (wc_order_id) DO UPDATE SET
                        status = EXCLUDED.status,
                        total_eur = EXCLUDED.total_eur,
                        synced_at = now()
                """), {
                    "wc_id": order["id"],
                    "email": order.get("billing", {}).get("email", ""),
                    "status": order["status"],
                    "payment": order.get("payment_method", ""),
                    "total": float(order.get("total", 0)),
                    "items": str(order.get("line_items", [])),
                    "order_date": order.get("date_created"),
                })
                synced += 1
            session.commit()
            page += 1
        logging.info(f"WooCommerce sync complete: {synced} orders")
    finally:
        session.close()
```

- [ ] **Step 5: Commit**

```bash
git add etl/
git commit -m "feat: WooCommerce order sync Azure Function (30 min timer)"
```

---

## Task 14: ETL — TeamLeader Invoice Sync

**Files:**
- Create: `etl/tl_invoices_sync/__init__.py`
- Create: `etl/tl_invoices_sync/function.json`

- [ ] **Step 1: Create etl/tl_invoices_sync/function.json**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */30 * * * *"
    }
  ]
}
```

- [ ] **Step 2: Create etl/tl_invoices_sync/__init__.py**

```python
import logging
import requests
from datetime import datetime, timedelta
from sqlalchemy import text
from etl.shared.database import SessionLocal
from etl.shared.config import TEAMLEADER_ACCESS_TOKEN

TL_BASE = "https://api.focus.teamleader.eu"
HEADERS = {"Authorization": f"Bearer {TEAMLEADER_ACCESS_TOKEN}"}

STATUS_MAP = {
    "draft": "draft",
    "outstanding": "outstanding",
    "matched": "paid",
    "overdue": "overdue",
}

def main(timer) -> None:
    logging.info("TeamLeader invoice sync started")
    session = SessionLocal()
    try:
        result = session.execute(text("SELECT MAX(synced_at) FROM invoices")).scalar()
        updated_since = (result - timedelta(minutes=5)).isoformat() if result else "2020-01-01T00:00:00+00:00"

        page = 1
        synced = 0
        while True:
            response = requests.post(
                f"{TL_BASE}/invoices.list",
                json={
                    "filter": {"updated_since": updated_since, "status": ["draft", "outstanding", "matched"]},
                    "page": {"size": 100, "number": page},
                },
                headers=HEADERS,
            )
            response.raise_for_status()
            invoices = response.json().get("data", [])
            if not invoices:
                break
            for inv in invoices:
                attrs = inv.get("attributes", {})
                tl_id = inv["id"]
                # Match to reseller by teamleader_id
                customer = attrs.get("invoicee", {}).get("customer", {})
                tl_company_id = customer.get("id")
                reseller_row = session.execute(
                    text("SELECT id FROM resellers WHERE teamleader_id = :tl_id"),
                    {"tl_id": tl_company_id}
                ).scalar()
                if not reseller_row:
                    continue
                session.execute(text("""
                    INSERT INTO invoices (id, reseller_id, tl_invoice_id, invoice_number, status, total_eur, invoice_date, due_date, synced_at)
                    VALUES (gen_random_uuid(), :reseller_id, :tl_id, :number, :status, :total, :inv_date, :due_date, now())
                    ON CONFLICT (tl_invoice_id) DO UPDATE SET
                        status = EXCLUDED.status,
                        total_eur = EXCLUDED.total_eur,
                        synced_at = now()
                """), {
                    "reseller_id": str(reseller_row),
                    "tl_id": tl_id,
                    "number": attrs.get("invoice_number", {}).get("number"),
                    "status": STATUS_MAP.get(attrs.get("status", "outstanding"), "outstanding"),
                    "total": float(attrs.get("total", {}).get("tax_inclusive", {}).get("amount", 0)),
                    "inv_date": attrs.get("invoice_date"),
                    "due_date": attrs.get("due_on"),
                })
                synced += 1
            session.commit()
            page += 1
        logging.info(f"TL invoice sync complete: {synced} invoices")
    finally:
        session.close()
```

- [ ] **Step 3: Commit**

```bash
git add etl/tl_invoices_sync/
git commit -m "feat: TeamLeader invoice sync Azure Function (30 min timer)"
```

---

## Task 15: ETL — Tier Recalculation

**Files:**
- Create: `etl/tier_recalculate/__init__.py`
- Create: `etl/tier_recalculate/function.json`
- Test: `tests/test_etl_tier.py`

- [ ] **Step 1: Write failing test**

`tests/test_etl_tier.py`:
```python
from etl.tier_recalculate import calculate_tier

def test_calculate_tier_returns_correct_tier():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": 0},
        {"tier": "rose", "min_revenue_eur": 1000},
        {"tier": "pro", "min_revenue_eur": 5000},
        {"tier": "elite", "min_revenue_eur": 15000},
        {"tier": "black", "min_revenue_eur": 50000},
    ]
    assert calculate_tier(0, thresholds) == "pearl"
    assert calculate_tier(999, thresholds) == "pearl"
    assert calculate_tier(1000, thresholds) == "rose"
    assert calculate_tier(5000, thresholds) == "pro"
    assert calculate_tier(50000, thresholds) == "black"
    assert calculate_tier(99999, thresholds) == "black"

def test_calculate_tier_never_downgrades():
    thresholds = [
        {"tier": "pearl", "min_revenue_eur": 0},
        {"tier": "rose", "min_revenue_eur": 1000},
    ]
    assert calculate_tier(500, thresholds) == "pearl"
```

- [ ] **Step 2: Run to verify it fails**

```bash
pytest tests/test_etl_tier.py -v
```
Expected: `ImportError: cannot import name 'calculate_tier'`

- [ ] **Step 3: Create etl/tier_recalculate/__init__.py**

```python
import logging
from sqlalchemy import text
from etl.shared.database import SessionLocal

TIER_ORDER = ["pearl", "rose", "pro", "elite", "black"]

def calculate_tier(revenue_eur: float, thresholds: list[dict]) -> str:
    sorted_thresholds = sorted(thresholds, key=lambda t: float(t["min_revenue_eur"]))
    result = "pearl"
    for t in sorted_thresholds:
        if revenue_eur >= float(t["min_revenue_eur"]):
            result = t["tier"]
    return result

def main(timer) -> None:
    logging.info("Tier recalculation started")
    session = SessionLocal()
    try:
        from datetime import datetime
        current_year = datetime.utcnow().year

        thresholds_rows = session.execute(
            text("SELECT tier, min_revenue_eur FROM tier_thresholds ORDER BY min_revenue_eur")
        ).all()
        thresholds = [{"tier": r[0], "min_revenue_eur": r[1]} for r in thresholds_rows]

        resellers = session.execute(
            text("SELECT id, tier FROM resellers WHERE status = 'active' AND tier_override = false")
        ).all()

        updated = 0
        for reseller_id, current_tier in resellers:
            revenue_row = session.execute(text("""
                SELECT COALESCE(SUM(total_eur), 0)
                FROM invoices
                WHERE reseller_id = :id
                AND status = 'paid'
                AND EXTRACT(year FROM invoice_date) = :year
            """), {"id": str(reseller_id), "year": current_year}).scalar()

            new_tier = calculate_tier(float(revenue_row), thresholds)

            # Never downgrade automatically
            current_idx = TIER_ORDER.index(current_tier) if current_tier in TIER_ORDER else 0
            new_idx = TIER_ORDER.index(new_tier) if new_tier in TIER_ORDER else 0
            if new_idx < current_idx:
                continue

            if new_tier != current_tier:
                session.execute(
                    text("UPDATE resellers SET tier = :tier, updated_at = now() WHERE id = :id"),
                    {"tier": new_tier, "id": str(reseller_id)},
                )
                updated += 1

        session.commit()
        logging.info(f"Tier recalculation complete: {updated} resellers upgraded")
    finally:
        session.close()
```

- [ ] **Step 4: Create etl/tier_recalculate/function.json**

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 2 * * *"
    }
  ]
}
```

- [ ] **Step 5: Run tests**

```bash
pytest tests/test_etl_tier.py -v
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add etl/tier_recalculate/ tests/test_etl_tier.py
git commit -m "feat: nightly tier recalculation ETL (never auto-downgrade)"
```

---

## Task 16: Seed Data + Final Integration Test

**Files:**
- Create: `scripts/seed_dev.py`

- [ ] **Step 1: Create scripts/seed_dev.py**

```python
"""Run with: python -m scripts.seed_dev"""
import asyncio
import uuid
from app.database import AsyncSessionLocal
from app.models import TierThreshold, Product, TierEnum

TIER_THRESHOLDS = [
    {"tier": TierEnum.pearl,  "min_revenue_eur": 0,      "discount_pct": 10, "benefits": ["10% korting", "Toegang tot marketingmateriaal"]},
    {"tier": TierEnum.rose,   "min_revenue_eur": 1000,   "discount_pct": 15, "benefits": ["15% korting", "Prioriteit support", "Rose materialen"]},
    {"tier": TierEnum.pro,    "min_revenue_eur": 5000,   "discount_pct": 20, "benefits": ["20% korting", "Dedicated account manager"]},
    {"tier": TierEnum.elite,  "min_revenue_eur": 15000,  "discount_pct": 25, "benefits": ["25% korting", "Co-marketing mogelijkheden"]},
    {"tier": TierEnum.black,  "min_revenue_eur": 50000,  "discount_pct": 30, "benefits": ["30% korting", "Exclusieve producten", "Persoonlijk contact met founder"]},
]

PRODUCTS = [
    {"name": "Marine Collageen 13.000", "tag": "Het ochtendritueel", "list_price_eur": 59.0, "sort_order": 1},
    {"name": "Nordsilk", "tag": "Het haarritueel", "list_price_eur": 47.0, "sort_order": 2},
    {"name": "FREJA (Plantique Omega 3)", "tag": "Het basisritueel", "list_price_eur": 42.0, "sort_order": 3},
    {"name": "HÉRMADE", "tag": "Het maandritueel", "list_price_eur": 39.0, "sort_order": 4},
]

async def seed():
    async with AsyncSessionLocal() as db:
        for t in TIER_THRESHOLDS:
            db.add(TierThreshold(**t))
        for p in PRODUCTS:
            db.add(Product(id=uuid.uuid4(), **p, active=True))
        await db.commit()
    print("Seed complete")

asyncio.run(seed())
```

- [ ] **Step 2: Run seed**

```bash
docker-compose up db -d
alembic upgrade head
python -m scripts.seed_dev
```
Expected: `Seed complete`

- [ ] **Step 3: Run full test suite**

```bash
pytest tests/ -v --tb=short
```
Expected: All tests PASS

- [ ] **Step 4: Manual smoke test — start server and hit health + docs**

```bash
uvicorn app.main:app --reload
```
Open http://localhost:8000/docs — verify all route groups appear: auth, resellers, products, orders, files, admin, webhooks

- [ ] **Step 5: Commit**

```bash
git add scripts/
git commit -m "feat: dev seed script for tiers and products"
```

---

## Task 17: Deployment — Dockerfile + Azure Container App

**Files:**
- Modify: `Dockerfile`
- Create: `deploy.sh`

- [ ] **Step 1: Finalise Dockerfile for production**

```dockerfile
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

- [ ] **Step 2: Create deploy.sh**

```bash
#!/bin/bash
set -e
RESOURCE_GROUP="tsg-backend-rg"
LOCATION="westeurope"
ACR_NAME="tsgbackendacr"
APP_NAME="tsg-backend"
ENV_NAME="tsg-backend-env"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Container Registry
az acr create --name $ACR_NAME --resource-group $RESOURCE_GROUP --sku Basic --admin-enabled true

# Build and push image
az acr build --registry $ACR_NAME --image tsg-backend:latest .

# Create Container App environment
az containerapp env create --name $ENV_NAME --resource-group $RESOURCE_GROUP --location $LOCATION

# Create Container App
az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_NAME.azurecr.io/tsg-backend:latest \
  --target-port 8000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 5 \
  --env-vars DATABASE_URL=secretref:database-url SUPABASE_JWT_SECRET=secretref:jwt-secret

echo "Deployed. URL: $(az containerapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query 'properties.configuration.ingress.fqdn' -o tsv)"
```

- [ ] **Step 3: Build Docker image locally to verify it works**

```bash
docker build -t tsg-backend:test .
docker run --rm -p 8001:8000 --env-file .env tsg-backend:test
curl http://localhost:8001/health
```
Expected: `{"status":"ok"}`

- [ ] **Step 4: Commit**

```bash
git add Dockerfile deploy.sh
git commit -m "feat: production Dockerfile and Azure Container App deploy script"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ /auth/register-application — Task 7
- ✅ /auth/me — Task 7
- ✅ /resellers/me/stats + tier + invoices/quotations — Task 7
- ✅ /products with tier pricing — Task 8
- ✅ /orders/quotation → TeamLeader — Task 9
- ✅ /files list + download + upload + delete — Task 10
- ✅ /admin/* all endpoints — Task 11
- ✅ /webhooks/* — Task 12
- ✅ WooCommerce ETL — Task 13
- ✅ TeamLeader invoice ETL — Task 14
- ✅ Tier recalculation ETL (no downgrade) — Task 15
- ✅ Supabase JWT auth — Task 6
- ✅ Azure Blob file storage — Task 10
- ✅ Docker + Azure deployment — Task 17
- ✅ Seed data for dev — Task 16

**Missing from spec — added:** `GET /resellers/me/invoices` and `GET /resellers/me/quotations` endpoints — add to Task 7 router as:

```python
@router.get("/me/invoices")
async def get_invoices(reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Invoice).where(Invoice.reseller_id == reseller.id).order_by(Invoice.invoice_date.desc())
    )
    return result.scalars().all()

@router.get("/me/quotations")
async def get_quotations(reseller: Reseller = Depends(get_current_reseller), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Quotation).where(Quotation.reseller_id == reseller.id).order_by(Quotation.created_at.desc())
    )
    return result.scalars().all()
```
Add these to `app/routers/resellers.py` in Task 7.
