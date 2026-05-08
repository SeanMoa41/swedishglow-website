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
async def list_files(
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MarketingFile).order_by(MarketingFile.created_at.desc()))
    files = result.scalars().all()
    accessible, locked = [], []
    for f in files:
        out = FileOut(
            id=f.id,
            name=f.name,
            min_tier=f.min_tier,
            file_size_bytes=f.file_size_bytes,
            download_count=f.download_count,
            accessible=_can_access(f.min_tier, reseller.tier),
        )
        (accessible if out.accessible else locked).append(out)
    return FileListOut(accessible=accessible, locked=locked)


@router.get("/{file_id}/download")
async def download_file(
    file_id: uuid.UUID,
    reseller: Reseller = Depends(get_current_reseller),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MarketingFile).where(MarketingFile.id == file_id))
    f = result.scalar_one_or_none()
    if not f:
        raise HTTPException(status_code=404)
    if not _can_access(f.min_tier, reseller.tier):
        raise HTTPException(status_code=403, detail="Upgrade your tier to access this file")
    db.add(FileDownload(file_id=file_id, reseller_id=reseller.id))
    await db.execute(
        update(MarketingFile)
        .where(MarketingFile.id == file_id)
        .values(download_count=MarketingFile.download_count + 1)
    )
    await db.commit()
    blob_name = f.blob_url.split("/")[-1]
    signed_url = blob.generate_download_url(blob_name)
    return RedirectResponse(url=signed_url)


@router.post("", response_model=FileOut, status_code=201)
async def upload_file_endpoint(
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
        name=name,
        blob_url=url,
        min_tier=min_tier,
        file_size_bytes=len(content),
        uploaded_by=admin.id,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return FileOut(
        id=record.id,
        name=record.name,
        min_tier=record.min_tier,
        file_size_bytes=record.file_size_bytes,
        download_count=record.download_count,
        accessible=True,
    )


@router.delete("/{file_id}", status_code=204)
async def delete_file_endpoint(
    file_id: uuid.UUID,
    admin: Reseller = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MarketingFile).where(MarketingFile.id == file_id))
    f = result.scalar_one_or_none()
    if not f:
        raise HTTPException(status_code=404)
    blob_name = f.blob_url.split("/")[-1]
    await blob.delete_file(blob_name)
    await db.delete(f)
    await db.commit()
