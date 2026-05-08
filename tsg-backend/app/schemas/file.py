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

    model_config = {"from_attributes": True}


class FileListOut(BaseModel):
    accessible: list[FileOut]
    locked: list[FileOut]
