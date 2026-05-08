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
