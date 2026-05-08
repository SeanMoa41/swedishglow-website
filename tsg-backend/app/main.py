from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, resellers, products, orders, files, admin, webhooks

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
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(files.router)
app.include_router(admin.router)
app.include_router(webhooks.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
