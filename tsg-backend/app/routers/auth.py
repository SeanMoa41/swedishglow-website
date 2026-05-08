from fastapi import APIRouter, Depends
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
