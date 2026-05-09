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
    local_dev: bool = False
    local_dev_reseller_email: str = "dev@theswedishglow.com"

    class Config:
        env_file = ".env"

settings = Settings()
