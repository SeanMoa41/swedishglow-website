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
