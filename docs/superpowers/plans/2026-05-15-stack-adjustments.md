# Stack Adjustments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `tier_recalculate` from Azure Function to APScheduler inside FastAPI, add Resend transactional email with 3 branded Dutch templates, add tier-based auto-approve for quotations, and clean up the removed ETL function from infra and docs.

**Architecture:** APScheduler runs as part of FastAPI's lifespan — no separate deployed service needed. Resend email is called as a `BackgroundTask` (sync SDK, FastAPI runs it in a thread pool). Auto-approve flag lives in `tier_thresholds.auto_approve`; Elite and Black tiers skip manual review and call `teamleader.accept_quotation()` immediately.

**Tech Stack:** FastAPI 0.115, SQLAlchemy async 2.0, Alembic, APScheduler 3.10, Resend Python SDK, Jinja2, Python 3.12

---

## File Map

| File | Change |
|---|---|
| `tsg-backend/requirements.txt` | Add `apscheduler>=3.10`, `resend`, `jinja2` |
| `tsg-backend/app/config.py` | Add `resend_api_key: str = ""` |
| `tsg-backend/app/main.py` | Add `lifespan` with APScheduler |
| `tsg-backend/app/services/tier.py` | Add `recalculate_all_tiers()`, modify `recalculate_reseller_tier` to return `str \| None` |
| `tsg-backend/app/integrations/email.py` | **NEW** — Resend wrapper using Jinja2 |
| `tsg-backend/app/templates/email/account_approved.html` | **NEW** — branded Dutch template |
| `tsg-backend/app/templates/email/tier_upgraded.html` | **NEW** — branded Dutch template |
| `tsg-backend/app/templates/email/quotation_confirmed.html` | **NEW** — branded Dutch template |
| `tsg-backend/app/models/reseller.py` | Add `auto_approve: bool` to `TierThreshold` |
| `tsg-backend/migrations/versions/0002_add_auto_approve.py` | **NEW** — Alembic migration |
| `tsg-backend/app/integrations/teamleader.py` | Add `accept_quotation()` |
| `tsg-backend/app/routers/orders.py` | Auto-approve logic + `quotation_confirmed` email |
| `tsg-backend/app/routers/admin.py` | Send `account_approved` email on approval |
| `tsg-backend/scripts/seed_local.py` | Add `auto_approve` values to tier seed |
| `tsg-backend/scripts/seed_dev.py` | Add `auto_approve` values to tier seed |
| `tsg-backend/tests/test_tier_service.py` | Tests for `recalculate_all_tiers`, updated return-value assertions |
| `tsg-backend/tests/test_email.py` | **NEW** — Resend integration tests |
| `tsg-backend/tests/test_orders.py` | Add auto-approve + email tests |
| `tsg-backend/tests/test_admin.py` | Add email-sent assertion on approval |
| `tsg-backend/tests/test_etl_tier.py` | **DELETE** — ETL function is gone |
| `tsg-backend/etl/tier_recalculate/` | **DELETE** — entire directory |
| `.github/workflows/etl.yml` | Remove `tier_recalculate` from test paths and test runner |
| `CLAUDE.md` | Update ETL section, add Resend, add `auto_approve` field |
| `docs/superpowers/specs/2026-05-07-tsg-backend-design.md` | Sync ETL + integrations sections |

---

## Task 1: DB Migration — Add auto_approve to tier_thresholds

**Files:**
- Create: `tsg-backend/migrations/versions/0002_add_auto_approve.py`
- Modify: `tsg-backend/app/models/reseller.py`
- Modify: `tsg-backend/scripts/seed_local.py`
- Modify: `tsg-backend/scripts/seed_dev.py`

- [ ] **Step 1: Write the failing model test**

Add to `tsg-backend/tests/test_models.py`:

```python
def test_tier_threshold_has_auto_approve_field():
    from app.models.reseller import TierThreshold
    assert hasattr(TierThreshold, "auto_approve")
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd tsg-backend
pytest tests/test_models.py::test_tier_threshold_has_auto_approve_field -v
```
Expected: FAIL — `AssertionError`

- [ ] **Step 3: Add auto_approve to TierThreshold model**

In `tsg-backend/app/models/reseller.py`, add one field to `TierThreshold`:

```python
class TierThreshold(Base):
    __tablename__ = "tier_thresholds"

    tier: Mapped[TierEnum] = mapped_column(Enum(TierEnum, name="tier"), primary_key=True)
    min_revenue_eur: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    discount_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    benefits: Mapped[list] = mapped_column(JSONB, default=list)
    auto_approve: Mapped[bool] = mapped_column(Boolean, default=False)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_models.py::test_tier_threshold_has_auto_approve_field -v
```
Expected: PASS

- [ ] **Step 5: Write the Alembic migration**

Create `tsg-backend/migrations/versions/0002_add_auto_approve.py`:

```python
"""add auto_approve to tier_thresholds

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-15

"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'tier_thresholds',
        sa.Column('auto_approve', sa.Boolean(), nullable=False, server_default='false'),
    )
    op.execute(
        "UPDATE tier_thresholds SET auto_approve = true WHERE tier IN ('elite', 'black')"
    )


def downgrade() -> None:
    op.drop_column('tier_thresholds', 'auto_approve')
```

- [ ] **Step 6: Update seed_local.py**

In `tsg-backend/scripts/seed_local.py`, replace the tier insert block. Change the `tiers` list and SQL to include `auto_approve`:

```python
tiers = [
    ("pearl",  0,       10, ["10% korting", "Toegang tot productcatalogus"],              False),
    ("rose",   5000,    15, ["15% korting", "Prioriteit support", "Rose marketingmateriaal"], False),
    ("pro",    15000,   20, ["20% korting", "Dedicated accountmanager", "Pro productpresentaties"], False),
    ("elite",  40000,   25, ["25% korting", "Early access nieuwe producten", "Elite evenementen"], True),
    ("black",  100000,  30, ["30% korting", "Co-marketing budget", "Black concierge support"], True),
]
for tier, min_rev, disc, benefits, auto_approve in tiers:
    await db.execute(text("""
        INSERT INTO tier_thresholds (tier, min_revenue_eur, discount_pct, benefits, auto_approve)
        VALUES (:tier, :min_rev, :disc, CAST(:benefits AS jsonb), :auto_approve)
        ON CONFLICT (tier) DO UPDATE SET auto_approve = EXCLUDED.auto_approve
    """), {"tier": tier, "min_rev": min_rev, "disc": disc,
           "benefits": json.dumps(benefits), "auto_approve": auto_approve})
```

- [ ] **Step 7: Update seed_dev.py with the same change**

Open `tsg-backend/scripts/seed_dev.py`. Find the equivalent tier insert block and apply the same pattern: add `auto_approve` as the 5th tuple element (`False` for pearl/rose/pro, `True` for elite/black), update the INSERT to include the column, and change `ON CONFLICT DO NOTHING` to `DO UPDATE SET auto_approve = EXCLUDED.auto_approve`.

- [ ] **Step 8: Commit**

```bash
cd tsg-backend
git add migrations/versions/0002_add_auto_approve.py app/models/reseller.py \
        scripts/seed_local.py scripts/seed_dev.py tests/test_models.py
git commit -m "feat: add auto_approve column to tier_thresholds (elite+black default true)"
```

---

## Task 2: APScheduler — recalculate_all_tiers wrapper

**Files:**
- Modify: `tsg-backend/app/services/tier.py`
- Modify: `tsg-backend/tests/test_tier_service.py`

- [ ] **Step 1: Write failing tests**

Add to `tsg-backend/tests/test_tier_service.py`:

```python
@pytest.mark.asyncio
async def test_recalculate_reseller_tier_returns_new_tier_on_upgrade():
    mock_db = AsyncMock()
    reseller_result = MagicMock()
    reseller_result.one_or_none.return_value = MagicMock(tier="pearl", tier_override=False)
    thresholds_result = MagicMock()
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000")]
    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0
    update_result = MagicMock()
    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result, update_result]

    result = await recalculate_reseller_tier(mock_db, "uuid-1")

    assert result == "rose"


@pytest.mark.asyncio
async def test_recalculate_reseller_tier_returns_none_when_no_upgrade():
    mock_db = AsyncMock()
    reseller_result = MagicMock()
    reseller_result.one_or_none.return_value = MagicMock(tier="pro", tier_override=False)
    thresholds_result = MagicMock()
    thresholds_result.all.return_value = [("pearl", "0"), ("rose", "1000"), ("pro", "5000")]
    revenue_result = MagicMock()
    revenue_result.scalar.return_value = 2000.0
    mock_db.execute.side_effect = [reseller_result, thresholds_result, revenue_result]

    result = await recalculate_reseller_tier(mock_db, "uuid-1")

    assert result is None
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_tier_service.py::test_recalculate_reseller_tier_returns_new_tier_on_upgrade \
       tests/test_tier_service.py::test_recalculate_reseller_tier_returns_none_when_no_upgrade -v
```
Expected: FAIL — `assert None == "rose"`

- [ ] **Step 3: Modify recalculate_reseller_tier to return str | None**

Replace the last block of `recalculate_reseller_tier` in `tsg-backend/app/services/tier.py`. Change the function signature and return statement:

```python
async def recalculate_reseller_tier(db: AsyncSession, reseller_id: str) -> str | None:
    result = await db.execute(
        text("SELECT tier, tier_override FROM resellers WHERE id = :id AND status = 'active'"),
        {"id": reseller_id},
    )
    reseller = result.one_or_none()
    if not reseller or reseller.tier_override:
        return None

    current_tier = reseller.tier
    current_year = datetime.now(timezone.utc).year

    thresholds_rows = await db.execute(
        text("SELECT tier, min_revenue_eur FROM tier_thresholds ORDER BY min_revenue_eur")
    )
    thresholds = [{"tier": r[0], "min_revenue_eur": r[1]} for r in thresholds_rows.all()]

    revenue_row = await db.execute(
        text("""
            SELECT COALESCE(SUM(total_eur), 0)
            FROM invoices
            WHERE reseller_id = :id
            AND status = 'paid'
            AND EXTRACT(year FROM invoice_date) = :year
        """),
        {"id": reseller_id, "year": current_year},
    )
    revenue = float(revenue_row.scalar())

    new_tier = calculate_tier(revenue, thresholds)

    current_idx = TIER_ORDER.index(current_tier) if current_tier in TIER_ORDER else 0
    new_idx = TIER_ORDER.index(new_tier) if new_tier in TIER_ORDER else 0
    if new_idx <= current_idx:
        return None

    await db.execute(
        text("UPDATE resellers SET tier = :tier, updated_at = now() WHERE id = :id"),
        {"tier": new_tier, "id": reseller_id},
    )
    await db.commit()
    logging.info(f"Tier upgraded: reseller {reseller_id} → {new_tier}")
    return new_tier
```

Also add the import and `recalculate_all_tiers` at the bottom of the file. Add `import asyncio` to the existing imports at the top of `tier.py`, and add `from app.integrations.email import send_email` at the top of the file (not inside the function — it's not circular):

```python
async def recalculate_all_tiers() -> None:
    from app.database import AsyncSessionLocal
    from app.integrations.email import send_email
    import asyncio
    logger = logging.getLogger("tsg.tier")
    logger.info("Starting nightly tier recalculation")
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            text("SELECT id, email, first_name FROM resellers WHERE status = 'active'")
        )
        resellers = result.all()

    upgraded = 0
    for row in resellers:
        async with AsyncSessionLocal() as db:
            new_tier = await recalculate_reseller_tier(db, str(row.id))
            if new_tier:
                upgraded += 1
                # send_email is sync (Resend SDK) — run in thread pool to avoid blocking event loop
                await asyncio.to_thread(
                    send_email,
                    to=row.email,
                    subject="Gefeliciteerd met je nieuwe tier!",
                    template="tier_upgraded",
                    context={"name": row.first_name or row.email, "new_tier": new_tier},
                )
    logger.info(f"Tier recalculation complete: {upgraded} resellers upgraded")
```

- [ ] **Step 4: Run all tier service tests**

```bash
pytest tests/test_tier_service.py -v
```
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add app/services/tier.py tests/test_tier_service.py
git commit -m "feat: recalculate_reseller_tier returns new tier; add recalculate_all_tiers wrapper"
```

---

## Task 3: APScheduler — Wire into FastAPI lifespan

**Files:**
- Modify: `tsg-backend/requirements.txt`
- Modify: `tsg-backend/app/main.py`

- [ ] **Step 1: Add APScheduler to requirements**

In `tsg-backend/requirements.txt`, add after the last line:

```
apscheduler>=3.10
```

- [ ] **Step 2: Add lifespan to main.py**

Replace the entire content of `tsg-backend/app/main.py` with:

```python
import json
import logging
import time
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, resellers, products, orders, files, admin, webhooks

logging.basicConfig(
    level=logging.DEBUG if settings.local_dev else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
request_logger = logging.getLogger("tsg.request")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.local_dev:
        from app.services.tier import recalculate_all_tiers
        scheduler = AsyncIOScheduler()
        scheduler.add_job(recalculate_all_tiers, "cron", hour=2, minute=0)
        scheduler.start()
        yield
        scheduler.shutdown()
    else:
        yield


app = FastAPI(title="TSG Backend", version="1.0.0", lifespan=lifespan)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000)
    request_logger.info(
        json.dumps({
            "method": request.method,
            "path": request.url.path,
            "query": str(request.query_params) or None,
            "status": response.status_code,
            "duration_ms": duration_ms,
        })
    )
    return response


_origins = [
    "https://theswedishglow.com",
    "http://localhost:3000",
    *settings.cors_origins,
]
if settings.local_dev:
    _origins += [f"http://localhost:{p}" for p in range(3001, 3010)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resellers.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(files.router)
app.include_router(admin.router)
app.include_router(webhooks.router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 3: Run health test to verify app still starts**

```bash
pytest tests/test_health.py -v
```
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add requirements.txt app/main.py
git commit -m "feat: add APScheduler lifespan to FastAPI — nightly tier recalculation at 02:00"
```

---

## Task 4: Resend Email — Integration + Templates

**Files:**
- Modify: `tsg-backend/requirements.txt`
- Modify: `tsg-backend/app/config.py`
- Create: `tsg-backend/app/integrations/email.py`
- Create: `tsg-backend/app/templates/email/account_approved.html`
- Create: `tsg-backend/app/templates/email/tier_upgraded.html`
- Create: `tsg-backend/app/templates/email/quotation_confirmed.html`
- Create: `tsg-backend/tests/test_email.py`

- [ ] **Step 1: Add dependencies**

In `tsg-backend/requirements.txt`, add:

```
resend>=2.0
jinja2>=3.1
```

- [ ] **Step 2: Add config field**

In `tsg-backend/app/config.py`, add `resend_api_key` to the `Settings` class:

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
    webhook_secret: str
    resend_api_key: str = ""
    local_dev: bool = False
    local_dev_reseller_email: str = "dev@theswedishglow.com"
    cors_origins: list[str] = []

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] **Step 3: Write the failing email test**

Create `tsg-backend/tests/test_email.py`:

```python
import pytest
from unittest.mock import patch, MagicMock


def test_send_email_calls_resend_with_rendered_html():
    with patch("resend.Emails.send") as mock_send:
        from app.integrations.email import send_email
        send_email(
            to="reseller@example.com",
            subject="Test onderwerp",
            template="account_approved",
            context={"name": "Jan", "company": "Bloemen BV", "tier": "pearl"},
        )
        mock_send.assert_called_once()
        call_args = mock_send.call_args[0][0]
        assert call_args["to"] == ["reseller@example.com"]
        assert call_args["subject"] == "Test onderwerp"
        assert "Jan" in call_args["html"]
        assert "from" in call_args


def test_send_email_skipped_when_no_api_key(monkeypatch):
    monkeypatch.setattr("app.config.settings.resend_api_key", "")
    with patch("resend.Emails.send") as mock_send:
        from importlib import reload
        import app.integrations.email as email_mod
        reload(email_mod)
        email_mod.send_email(
            to="reseller@example.com",
            subject="Test",
            template="account_approved",
            context={"name": "Jan", "company": "BV", "tier": "pearl"},
        )
        mock_send.assert_not_called()
```

- [ ] **Step 4: Run test to verify it fails**

```bash
pytest tests/test_email.py -v
```
Expected: FAIL — `ModuleNotFoundError` or `ImportError`

- [ ] **Step 5: Create the email integration**

Create `tsg-backend/app/integrations/email.py`:

```python
import logging
import resend
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from app.config import settings

logger = logging.getLogger("tsg.email")

_template_dir = Path(__file__).parent.parent / "templates" / "email"
_jinja = Environment(loader=FileSystemLoader(str(_template_dir)), autoescape=True)


def send_email(to: str, subject: str, template: str, context: dict) -> None:
    if not settings.resend_api_key:
        logger.warning("RESEND_API_KEY not set — skipping email to %s", to)
        return

    resend.api_key = settings.resend_api_key
    html = _jinja.get_template(f"{template}.html").render(**context)
    try:
        resend.Emails.send({
            "from": "The Swedish Glow <noreply@theswedishglow.com>",
            "to": [to],
            "subject": subject,
            "html": html,
        })
        logger.info("Email sent: %s → %s", template, to)
    except Exception:
        logger.exception("Failed to send email %s to %s", template, to)
```

- [ ] **Step 6: Create templates directory**

```bash
mkdir -p tsg-backend/app/templates/email
```

- [ ] **Step 7: Create account_approved.html**

Create `tsg-backend/app/templates/email/account_approved.html`:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welkom bij The Swedish Glow</title>
</head>
<body style="margin:0;padding:0;background:#F7F4F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4F0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:4px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#1A1A1A;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#D4A96A;font-size:11px;letter-spacing:3px;text-transform:uppercase;">The Swedish Glow</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px 32px;">
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:normal;color:#1A1A1A;">Welkom, {{ name }}</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;">
                Je aanmelding als reseller voor <strong>{{ company }}</strong> is goedgekeurd. Je kunt nu inloggen op het resellerportaal.
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;">
                Je bent gestart op <strong>tier {{ tier | upper }}</strong>. Naarmate je omzet groeit, stijg je automatisch naar hogere tiers met betere kortingen.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;">
                Je ontvangt een aparte e-mail van ons om je wachtwoord in te stellen.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1A1A1A;border-radius:2px;">
                    <a href="https://reseller.theswedishglow.com" style="display:inline-block;padding:14px 28px;color:#FFFFFF;font-family:Georgia,serif;font-size:14px;letter-spacing:1px;text-decoration:none;">Naar het portaal</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #F0EBE5;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                Vragen? Stuur een e-mail naar <a href="mailto:partner@theswedishglow.com" style="color:#D4A96A;">partner@theswedishglow.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

- [ ] **Step 8: Create tier_upgraded.html**

Create `tsg-backend/app/templates/email/tier_upgraded.html`:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nieuw tier bereikt</title>
</head>
<body style="margin:0;padding:0;background:#F7F4F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4F0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background:#1A1A1A;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#D4A96A;font-size:11px;letter-spacing:3px;text-transform:uppercase;">The Swedish Glow</p>
            </td>
          </tr>
          <tr>
            <td style="padding:48px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:normal;color:#1A1A1A;">Gefeliciteerd, {{ name }}!</h1>
              <p style="margin:0 0 24px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#D4A96A;">Tier {{ new_tier | upper }} bereikt</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;">
                Op basis van je omzet dit jaar heb je het <strong>{{ new_tier | capitalize }}</strong>-niveau bereikt. Je nieuwe kortingspercentage is vanaf nu actief in het portaal.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444444;">
                Log in om je bijgewerkte tarieven en nieuwe voordelen te bekijken.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1A1A1A;border-radius:2px;">
                    <a href="https://reseller.theswedishglow.com/tier" style="display:inline-block;padding:14px 28px;color:#FFFFFF;font-family:Georgia,serif;font-size:14px;letter-spacing:1px;text-decoration:none;">Bekijk mijn tier</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #F0EBE5;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                Vragen? <a href="mailto:partner@theswedishglow.com" style="color:#D4A96A;">partner@theswedishglow.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

- [ ] **Step 9: Create quotation_confirmed.html**

Create `tsg-backend/app/templates/email/quotation_confirmed.html`:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestelling bevestigd</title>
</head>
<body style="margin:0;padding:0;background:#F7F4F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4F0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background:#1A1A1A;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#D4A96A;font-size:11px;letter-spacing:3px;text-transform:uppercase;">The Swedish Glow</p>
            </td>
          </tr>
          <tr>
            <td style="padding:48px 40px 32px;">
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:normal;color:#1A1A1A;">Bestelling ontvangen</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444444;">
                Beste {{ name }}, je bestelling is bevestigd.
              </p>
              <!-- Order summary table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #F0EBE5;border-radius:2px;">
                <tr style="background:#F7F4F0;">
                  <td style="padding:10px 16px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888888;">Product</td>
                  <td style="padding:10px 16px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888888;text-align:right;">Aantal</td>
                  <td style="padding:10px 16px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888888;text-align:right;">Prijs</td>
                </tr>
                {% for item in line_items %}
                <tr>
                  <td style="padding:12px 16px;font-size:14px;color:#333333;border-top:1px solid #F0EBE5;">{{ item.description }}</td>
                  <td style="padding:12px 16px;font-size:14px;color:#333333;border-top:1px solid #F0EBE5;text-align:right;">{{ item.quantity }}</td>
                  <td style="padding:12px 16px;font-size:14px;color:#333333;border-top:1px solid #F0EBE5;text-align:right;">€ {{ "%.2f"|format(item.unit_price) }}</td>
                </tr>
                {% endfor %}
                <tr style="background:#F7F4F0;">
                  <td colspan="2" style="padding:12px 16px;font-size:14px;font-weight:bold;color:#1A1A1A;border-top:1px solid #E0D8D0;">Totaal (excl. BTW)</td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:bold;color:#1A1A1A;border-top:1px solid #E0D8D0;text-align:right;">€ {{ "%.2f"|format(total_eur) }}</td>
                </tr>
              </table>
              {% if auto_approved %}
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#D4A96A;">
                Als {{ tier | capitalize }}-reseller is je bestelling direct bevestigd.
              </p>
              {% else %}
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#444444;">
                We verwerken je offerte zo snel mogelijk. Je ontvangt een bevestiging zodra deze is goedgekeurd.
              </p>
              {% endif %}
              <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="background:#1A1A1A;border-radius:2px;">
                    <a href="https://reseller.theswedishglow.com/orders" style="display:inline-block;padding:14px 28px;color:#FFFFFF;font-family:Georgia,serif;font-size:14px;letter-spacing:1px;text-decoration:none;">Bekijk mijn bestellingen</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #F0EBE5;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                Vragen over je bestelling? <a href="mailto:partner@theswedishglow.com" style="color:#D4A96A;">partner@theswedishglow.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

- [ ] **Step 10: Run email tests**

```bash
pip install resend jinja2
pytest tests/test_email.py -v
```
Expected: all PASS

- [ ] **Step 11: Commit**

```bash
git add requirements.txt app/config.py app/integrations/email.py \
        app/templates/email/ tests/test_email.py
git commit -m "feat: add Resend email integration with 3 branded Dutch templates"
```

---

## Task 5: Wire Emails to admin.py and tier.py

**Files:**
- Modify: `tsg-backend/app/routers/admin.py`
- Modify: `tsg-backend/tests/test_admin.py`

- [ ] **Step 1: Write failing test for account_approved email**

Add to `tsg-backend/tests/test_admin.py`:

```python
@pytest.mark.asyncio
async def test_approve_application_sends_email(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_admin
    from app.database import get_db

    mock_admin = MagicMock()
    mock_admin.id = uuid4()
    mock_admin.is_admin = True

    mock_application = MagicMock()
    mock_application.id = uuid4()
    mock_application.email = "reseller@example.com"
    mock_application.first_name = "Jan"
    mock_application.last_name = "Smit"
    mock_application.company = "Bloemen BV"
    mock_application.phone = "0612345678"
    mock_application.status = "pending"

    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_application
    mock_db.execute.return_value = mock_result

    async def override_admin():
        return mock_admin

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_admin] = override_admin
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.supabase_admin.create_user", new_callable=AsyncMock) as mock_su, \
         patch("app.integrations.email.send_email") as mock_email:
        mock_su.return_value = str(uuid4())
        try:
            response = await client.post(
                f"/admin/applications/{mock_application.id}/approve",
                json={"assigned_tier": "pearl"},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

    mock_email.assert_called_once()
    call_kwargs = mock_email.call_args[1]
    assert call_kwargs["template"] == "account_approved"
    assert call_kwargs["to"] == "reseller@example.com"
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pytest tests/test_admin.py::test_approve_application_sends_email -v
```
Expected: FAIL — `mock_email.assert_called_once()` fails

- [ ] **Step 3: Add email to approve_application in admin.py**

In `tsg-backend/app/routers/admin.py`, add the import at the top:

```python
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from app.integrations.email import send_email
```

Replace the `approve_application` function signature and add email call after commit:

```python
@router.post("/applications/{application_id}/approve", response_model=ApplicationOut)
async def approve_application(
    application_id: uuid.UUID,
    body: ApplicationApproveIn,
    background_tasks: BackgroundTasks,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PartnerApplication).where(PartnerApplication.id == application_id)
    )
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

    background_tasks.add_task(
        send_email,
        to=application.email,
        subject="Je aanmelding is goedgekeurd — The Swedish Glow",
        template="account_approved",
        context={
            "name": application.first_name,
            "company": application.company,
            "tier": body.assigned_tier,
        },
    )
    return application
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pytest tests/test_admin.py::test_approve_application_sends_email -v
```
Expected: PASS

- [ ] **Step 5: Run full admin test suite**

```bash
pytest tests/test_admin.py -v
```
Expected: all PASS

- [ ] **Step 6: Commit**

```bash
git add app/routers/admin.py tests/test_admin.py
git commit -m "feat: send account_approved email on application approval"
```

---

## Task 6: TeamLeader — Add accept_quotation

**Files:**
- Modify: `tsg-backend/app/integrations/teamleader.py`

- [ ] **Step 1: Add accept_quotation to teamleader.py**

Append to `tsg-backend/app/integrations/teamleader.py`:

```python
async def accept_quotation(tl_quotation_id: str) -> None:
    if settings.local_dev:
        logger.warning("[LOCAL_DEV] mocked accept_quotation for %s", tl_quotation_id)
        return

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/quotations.accept",
            json={"id": tl_quotation_id},
            headers={"Authorization": f"Bearer {settings.teamleader_access_token}"},
        )
        response.raise_for_status()
```

> **Note:** Verify `POST /quotations.accept` is the correct TeamLeader API endpoint before deploying. Check https://developer.teamleader.eu/#/reference/quotations against the live TL docs.

- [ ] **Step 2: Commit**

```bash
git add app/integrations/teamleader.py
git commit -m "feat: add accept_quotation to TeamLeader client"
```

---

## Task 7: Auto-Approve Logic in orders.py

**Files:**
- Modify: `tsg-backend/app/routers/orders.py`
- Modify: `tsg-backend/tests/test_orders.py`

- [ ] **Step 1: Write failing tests**

Add to `tsg-backend/tests/test_orders.py`:

```python
@pytest.mark.asyncio
async def test_create_quotation_auto_approves_elite_tier(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_reseller
    from app.database import get_db

    product_id = uuid4()
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "elite@example.com"
    mock_reseller.first_name = "Elite"
    mock_reseller.tier = "elite"
    mock_reseller.teamleader_id = "tl-deal-123"

    mock_threshold = MagicMock()
    mock_threshold.discount_pct = 25.0
    mock_threshold.auto_approve = True

    mock_product = MagicMock()
    mock_product.id = product_id
    mock_product.name = "Marine Collageen"
    mock_product.list_price_eur = 45.0

    mock_db = AsyncMock()
    threshold_result = MagicMock()
    threshold_result.scalar_one_or_none.return_value = mock_threshold
    product_result = MagicMock()
    product_result.scalar_one_or_none.return_value = mock_product
    mock_db.execute.side_effect = [threshold_result, product_result]

    async def override_auth():
        return mock_reseller

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.teamleader.create_quotation", new_callable=AsyncMock) as mock_create, \
         patch("app.integrations.teamleader.accept_quotation", new_callable=AsyncMock) as mock_accept, \
         patch("app.integrations.email.send_email") as mock_email:
        mock_create.return_value = {"id": "tl-quot-abc"}
        try:
            response = await client.post(
                "/orders/quotation",
                json={"lines": [{"product_id": str(product_id), "quantity": 2}]},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

    mock_accept.assert_called_once_with("tl-quot-abc")
    mock_email.assert_called_once()
    call_kwargs = mock_email.call_args[1]
    assert call_kwargs["template"] == "quotation_confirmed"


@pytest.mark.asyncio
async def test_create_quotation_draft_for_pearl_tier(client):
    from unittest.mock import patch, AsyncMock, MagicMock
    from uuid import uuid4
    from app.main import app
    from app.auth import get_current_reseller
    from app.database import get_db

    product_id = uuid4()
    mock_reseller = MagicMock()
    mock_reseller.id = uuid4()
    mock_reseller.email = "pearl@example.com"
    mock_reseller.first_name = "Pearl"
    mock_reseller.tier = "pearl"
    mock_reseller.teamleader_id = "tl-deal-456"

    mock_threshold = MagicMock()
    mock_threshold.discount_pct = 10.0
    mock_threshold.auto_approve = False

    mock_product = MagicMock()
    mock_product.id = product_id
    mock_product.name = "Vitamine C"
    mock_product.list_price_eur = 22.5

    mock_db = AsyncMock()
    threshold_result = MagicMock()
    threshold_result.scalar_one_or_none.return_value = mock_threshold
    product_result = MagicMock()
    product_result.scalar_one_or_none.return_value = mock_product
    mock_db.execute.side_effect = [threshold_result, product_result]

    async def override_auth():
        return mock_reseller

    async def override_db():
        yield mock_db

    app.dependency_overrides[get_current_reseller] = override_auth
    app.dependency_overrides[get_db] = override_db

    with patch("app.integrations.teamleader.create_quotation", new_callable=AsyncMock) as mock_create, \
         patch("app.integrations.teamleader.accept_quotation", new_callable=AsyncMock) as mock_accept, \
         patch("app.integrations.email.send_email") as mock_email:
        mock_create.return_value = {"id": "tl-quot-xyz"}
        try:
            response = await client.post(
                "/orders/quotation",
                json={"lines": [{"product_id": str(product_id), "quantity": 1}]},
                headers={"Authorization": "Bearer fake"},
            )
        finally:
            app.dependency_overrides.clear()

    mock_accept.assert_not_called()
    mock_email.assert_called_once()
    call_kwargs = mock_email.call_args[1]
    assert call_kwargs["template"] == "quotation_confirmed"
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
pytest tests/test_orders.py::test_create_quotation_auto_approves_elite_tier \
       tests/test_orders.py::test_create_quotation_draft_for_pearl_tier -v
```
Expected: FAIL

- [ ] **Step 3: Update orders.py with auto-approve logic**

Replace the entire content of `tsg-backend/app/routers/orders.py`:

```python
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth import get_current_reseller
from app.models import Reseller, Product, Quotation, TierThreshold
from app.schemas.order import QuotationIn, QuotationOut
from app.integrations import teamleader
from app.integrations.email import send_email

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/quotation", response_model=QuotationOut, status_code=201)
async def create_quotation(
    body: QuotationIn,
    background_tasks: BackgroundTasks,
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
    auto_approve = threshold.auto_approve if threshold else False

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
    tl_quotation_id = tl_response.get("id") or tl_response.get("quotation_id")

    status = "draft"
    if auto_approve and tl_quotation_id:
        await teamleader.accept_quotation(tl_quotation_id)
        status = "accepted"

    quotation = Quotation(
        reseller_id=reseller.id,
        tl_quotation_id=tl_quotation_id,
        tl_deal_id=reseller.teamleader_id,
        status=status,
        total_eur=total,
        line_items=line_items,
    )
    db.add(quotation)
    await db.commit()
    await db.refresh(quotation)

    background_tasks.add_task(
        send_email,
        to=reseller.email,
        subject="Bestelling ontvangen — The Swedish Glow",
        template="quotation_confirmed",
        context={
            "name": reseller.first_name or reseller.email,
            "line_items": line_items,
            "total_eur": total,
            "auto_approved": auto_approve,
            "tier": str(reseller.tier),
        },
    )
    return quotation
```

- [ ] **Step 4: Run new tests**

```bash
pytest tests/test_orders.py -v
```
Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add app/routers/orders.py tests/test_orders.py
git commit -m "feat: tier-based auto-approve quotations + quotation_confirmed email"
```

---

## Task 8: Cleanup — Delete tier_recalculate ETL + Update Workflow + Docs

**Files:**
- Delete: `tsg-backend/etl/tier_recalculate/`
- Delete: `tsg-backend/tests/test_etl_tier.py`
- Modify: `.github/workflows/etl.yml`
- Modify: `CLAUDE.md`
- Modify: `docs/superpowers/specs/2026-05-07-tsg-backend-design.md`

- [ ] **Step 1: Delete tier_recalculate ETL directory**

```bash
rm -rf tsg-backend/etl/tier_recalculate
rm tsg-backend/tests/test_etl_tier.py
```

- [ ] **Step 2: Update etl.yml — remove tier_recalculate references**

In `.github/workflows/etl.yml`, update the test step from:

```yaml
- name: Run ETL tests
  run: pytest tests/test_etl_*.py tests/test_tier_service.py -v --tb=short
```

to:

```yaml
- name: Run ETL tests
  run: pytest tests/test_etl_wc_orders.py tests/test_etl_tl_invoices.py tests/test_tier_service.py -v --tb=short
```

Also update the `paths` trigger to remove `tier_recalculate`:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'tsg-backend/etl/wc_orders_sync/**'
      - 'tsg-backend/etl/tl_invoices_sync/**'
      - 'tsg-backend/requirements.txt'
      - '.github/workflows/etl.yml'
  pull_request:
    branches: [main]
    paths:
      - 'tsg-backend/etl/wc_orders_sync/**'
      - 'tsg-backend/etl/tl_invoices_sync/**'
      - 'tsg-backend/requirements.txt'
      - '.github/workflows/etl.yml'
```

- [ ] **Step 3: Run remaining ETL tests to verify nothing broken**

```bash
cd tsg-backend
pytest tests/test_tier_service.py -v
```
Expected: all PASS

- [ ] **Step 4: Update CLAUDE.md architecture**

In `CLAUDE.md`, find the Azure Functions block under Architecture and update it:

```
Azure Functions (ETL, Python) — scheduled timers
  ├── wc_orders_sync     (every 30 min → PostgreSQL)
  └── tl_invoices_sync   (every 30 min → PostgreSQL)
```

Remove `tier_recalculate` from the ETL block. Under the FastAPI block add:

```
Azure Container App — FastAPI (Python 3.12)       ← this repo
  ├── reads/writes → Azure PostgreSQL Flexible Server
  ├── auth verify → Supabase Auth
  ├── file storage → Azure Blob Storage
  ├── live API calls → TeamLeader Focus API
  ├── transactional email → Resend
  └── nightly tier recalc → APScheduler (02:00 AM, internal)
```

In the `tier_thresholds` table description row, add `auto_approve`:

```
| `tier_thresholds` | Configurable tier revenue thresholds, discounts, and auto-approve flag |
```

In the External Integrations section, add Resend:

```
### Resend
- **Auth:** API key (`RESEND_API_KEY`)
- **From:** noreply@theswedishglow.com
- **Templates:** account_approved, tier_upgraded, quotation_confirmed
- **Client:** `app/integrations/email.py`
```

- [ ] **Step 5: Update the 2026-05-07 design spec**

In `docs/superpowers/specs/2026-05-07-tsg-backend-design.md`, find the ETL section and remove `tier_recalculate`. Add Resend to the integrations table.

- [ ] **Step 6: Run full test suite**

```bash
cd tsg-backend
pytest tests/ -v --tb=short
```
Expected: all PASS, no references to deleted files

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: remove tier_recalculate ETL, update workflow paths and docs"
```

---

## Execution Notes

- Run `alembic upgrade head` after Task 1 when working against a real DB
- `RESEND_API_KEY` must be set in `.env` and in Azure Container App secrets before email sends work in staging/prod
- Verify `POST /quotations.accept` endpoint name in TeamLeader API docs before Task 7 deploy
- The APScheduler job is disabled in `local_dev` mode — test `recalculate_all_tiers()` directly via unit tests, not by waiting for cron
