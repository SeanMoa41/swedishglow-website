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

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    blob_url: Mapped[str] = mapped_column(String, nullable=False)
    min_tier: Mapped[FileTierEnum] = mapped_column(
        Enum(FileTierEnum), default=FileTierEnum.all
    )
    file_size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("resellers.id")
    )
    download_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )


class FileDownload(Base):
    __tablename__ = "file_downloads"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    file_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("marketing_files.id"), nullable=False
    )
    reseller_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("resellers.id"), nullable=False
    )
    downloaded_at: Mapped[str] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
