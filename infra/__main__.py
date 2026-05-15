"""
TSG Website — Pulumi IaC
Stacks: staging | prod

First-time setup for a new stack:
  pulumi stack init <staging|prod>
  pulumi config set azure-native:location westeurope
  pulumi config set --secret database_url "postgresql+asyncpg://..."
  pulumi config set --secret database_url_sync "postgresql+psycopg2://..."
  pulumi config set --secret supabase_url "https://xxxx.supabase.co"
  pulumi config set --secret supabase_service_role_key "eyJ..."
  pulumi config set --secret supabase_jwt_secret "..."
  pulumi config set --secret webhook_secret "..."
  pulumi config set --secret tl_client_id "..."
  pulumi config set --secret tl_client_secret "..."
  pulumi config set --secret tl_access_token "..."
  pulumi config set --secret tl_refresh_token "..."
  pulumi config set --secret wc_consumer_key "ck_..."
  pulumi config set --secret wc_consumer_secret "cs_..."
  pulumi config set --secret azure_storage_connection_string "DefaultEndpointsProtocol=..."
  pulumi config set --secret resend_api_key "re_..."
  pulumi config set cors_origins "https://your-netlify-url.netlify.app"
  pulumi up

Outputs (use as GitHub secrets / Netlify env vars):
  pulumi stack output acr_login_server    -> ACR_LOGIN_SERVER
  pulumi stack output container_app_fqdn  -> NEXT_PUBLIC_API_URL
  pulumi stack output functions_app_name  -> FUNCTIONS_APP_NAME
"""

import pulumi
import pulumi_azure_native as azure_native

config = pulumi.Config()
stack = pulumi.get_stack()  # "staging" or "prod"
location = "westeurope"

# ── Secrets ───────────────────────────────────────────────────
database_url              = config.require_secret("database_url")
database_url_sync         = config.require_secret("database_url_sync")
supabase_url              = config.require_secret("supabase_url")
supabase_service_role_key = config.require_secret("supabase_service_role_key")
supabase_jwt_secret       = config.require_secret("supabase_jwt_secret")
webhook_secret            = config.require_secret("webhook_secret")
tl_client_id              = config.require_secret("tl_client_id")
tl_client_secret          = config.require_secret("tl_client_secret")
tl_access_token           = config.require_secret("tl_access_token")
tl_refresh_token          = config.require_secret("tl_refresh_token")
wc_consumer_key           = config.require_secret("wc_consumer_key")
wc_consumer_secret        = config.require_secret("wc_consumer_secret")
azure_storage_conn        = config.require_secret("azure_storage_connection_string")
resend_api_key            = config.require_secret("resend_api_key")
cors_origins              = config.get("cors_origins") or ""

# ── Resource Group ────────────────────────────────────────────
rg = azure_native.resources.ResourceGroup(
    f"tsg-{stack}-rg",
    resource_group_name=f"tsg-{stack}-rg",
    location=location,
)

# ── Log Analytics Workspace ───────────────────────────────────
workspace = azure_native.operationalinsights.Workspace(
    f"tsg-{stack}-logs",
    workspace_name=f"tsg-{stack}-logs",
    resource_group_name=rg.name,
    location=location,
    sku=azure_native.operationalinsights.WorkspaceSkuArgs(name="PerGB2018"),
    retention_in_days=30,
)

workspace_keys = azure_native.operationalinsights.get_shared_keys_output(
    resource_group_name=rg.name,
    workspace_name=workspace.name,
)

# ── Container Registry ────────────────────────────────────────
acr_name = f"tsg{stack}acr"
acr = azure_native.containerregistry.Registry(
    acr_name,
    registry_name=acr_name,
    resource_group_name=rg.name,
    location=location,
    sku=azure_native.containerregistry.SkuArgs(name="Basic"),
    admin_user_enabled=True,
)

acr_creds = azure_native.containerregistry.list_registry_credentials_output(
    resource_group_name=rg.name,
    registry_name=acr.name,
)

# ── Container App Environment ─────────────────────────────────
app_env = azure_native.app.ManagedEnvironment(
    f"tsg-{stack}-env",
    environment_name=f"tsg-{stack}-env",
    resource_group_name=rg.name,
    location=location,
    app_logs_configuration=azure_native.app.AppLogsConfigurationArgs(
        destination="log-analytics",
        log_analytics_configuration=azure_native.app.LogAnalyticsConfigurationArgs(
            customer_id=workspace.customer_id,
            shared_key=workspace_keys.primary_shared_key,
        ),
    ),
)

# ── Container App ─────────────────────────────────────────────
# Image starts as a placeholder. CI/CD (backend.yml) overwrites it on every push.
container_app = azure_native.app.ContainerApp(
    f"tsg-backend-{stack}",
    container_app_name=f"tsg-backend-{stack}",
    resource_group_name=rg.name,
    location=location,
    managed_environment_id=app_env.id,
    configuration=azure_native.app.ConfigurationArgs(
        ingress=azure_native.app.IngressArgs(
            external=True,
            target_port=8000,
            transport="http",
        ),
        registries=[
            azure_native.app.RegistryCredentialsArgs(
                server=acr.login_server,
                username=acr_creds.username,
                password_secret_ref="acr-password",
            )
        ],
        secrets=[
            azure_native.app.SecretArgs(name="acr-password",                     value=acr_creds.passwords[0].value),
            azure_native.app.SecretArgs(name="database-url",                     value=database_url),
            azure_native.app.SecretArgs(name="database-url-sync",                value=database_url_sync),
            azure_native.app.SecretArgs(name="supabase-url",                     value=supabase_url),
            azure_native.app.SecretArgs(name="supabase-service-role-key",        value=supabase_service_role_key),
            azure_native.app.SecretArgs(name="supabase-jwt-secret",              value=supabase_jwt_secret),
            azure_native.app.SecretArgs(name="webhook-secret",                   value=webhook_secret),
            azure_native.app.SecretArgs(name="tl-client-id",                    value=tl_client_id),
            azure_native.app.SecretArgs(name="tl-client-secret",                value=tl_client_secret),
            azure_native.app.SecretArgs(name="tl-access-token",                 value=tl_access_token),
            azure_native.app.SecretArgs(name="tl-refresh-token",                value=tl_refresh_token),
            azure_native.app.SecretArgs(name="wc-consumer-key",                 value=wc_consumer_key),
            azure_native.app.SecretArgs(name="wc-consumer-secret",              value=wc_consumer_secret),
            azure_native.app.SecretArgs(name="azure-storage-connection-string",  value=azure_storage_conn),
            azure_native.app.SecretArgs(name="resend-api-key",                   value=resend_api_key),
        ],
    ),
    template=azure_native.app.TemplateArgs(
        containers=[
            azure_native.app.ContainerArgs(
                name="tsg-backend",
                image="mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
                resources=azure_native.app.ContainerResourcesArgs(cpu=0.5, memory="1Gi"),
                env=[
                    azure_native.app.EnvironmentVarArgs(name="DATABASE_URL",                    secret_ref="database-url"),
                    azure_native.app.EnvironmentVarArgs(name="DATABASE_URL_SYNC",               secret_ref="database-url-sync"),
                    azure_native.app.EnvironmentVarArgs(name="SUPABASE_URL",                    secret_ref="supabase-url"),
                    azure_native.app.EnvironmentVarArgs(name="SUPABASE_SERVICE_ROLE_KEY",       secret_ref="supabase-service-role-key"),
                    azure_native.app.EnvironmentVarArgs(name="SUPABASE_JWT_SECRET",             secret_ref="supabase-jwt-secret"),
                    azure_native.app.EnvironmentVarArgs(name="WEBHOOK_SECRET",                  secret_ref="webhook-secret"),
                    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_CLIENT_ID",            secret_ref="tl-client-id"),
                    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_CLIENT_SECRET",        secret_ref="tl-client-secret"),
                    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_ACCESS_TOKEN",         secret_ref="tl-access-token"),
                    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_REFRESH_TOKEN",        secret_ref="tl-refresh-token"),
                    azure_native.app.EnvironmentVarArgs(name="WC_CONSUMER_KEY",                 secret_ref="wc-consumer-key"),
                    azure_native.app.EnvironmentVarArgs(name="WC_CONSUMER_SECRET",              secret_ref="wc-consumer-secret"),
                    azure_native.app.EnvironmentVarArgs(name="AZURE_STORAGE_CONNECTION_STRING", secret_ref="azure-storage-connection-string"),
                    azure_native.app.EnvironmentVarArgs(name="RESEND_API_KEY",                  secret_ref="resend-api-key"),
                    azure_native.app.EnvironmentVarArgs(name="CORS_ORIGINS",                    value=cors_origins),
                    azure_native.app.EnvironmentVarArgs(name="LOCAL_DEV",                       value="false"),
                ],
            )
        ],
        scale=azure_native.app.ScaleArgs(min_replicas=1, max_replicas=3),
    ),
)

# ── ETL: Storage Account ──────────────────────────────────────
fn_storage = azure_native.storage.StorageAccount(
    f"tsg{stack}fnstorage",
    account_name=f"tsg{stack}fnstorage",
    resource_group_name=rg.name,
    location=location,
    sku=azure_native.storage.SkuArgs(name="Standard_LRS"),
    kind="StorageV2",
)

fn_storage_keys = azure_native.storage.list_storage_account_keys_output(
    resource_group_name=rg.name,
    account_name=fn_storage.name,
)

fn_connection_string = pulumi.Output.concat(
    "DefaultEndpointsProtocol=https;AccountName=", fn_storage.name,
    ";AccountKey=", fn_storage_keys.keys[0].value,
    ";EndpointSuffix=core.windows.net",
)

# ── ETL: Functions App ────────────────────────────────────────
fn_plan = azure_native.web.AppServicePlan(
    f"tsg-{stack}-fn-plan",
    name=f"tsg-{stack}-fn-plan",
    resource_group_name=rg.name,
    location=location,
    kind="Linux",
    reserved=True,
    sku=azure_native.web.SkuDescriptionArgs(tier="Dynamic", name="Y1"),
)

fn_app = azure_native.web.WebApp(
    f"tsg-etl-{stack}",
    name=f"tsg-etl-{stack}",
    resource_group_name=rg.name,
    location=location,
    kind="functionapp,linux",
    server_farm_id=fn_plan.id,
    site_config=azure_native.web.SiteConfigArgs(
        linux_fx_version="Python|3.12",
        app_settings=[
            azure_native.web.NameValuePairArgs(name="AzureWebJobsStorage",        value=fn_connection_string),
            azure_native.web.NameValuePairArgs(name="FUNCTIONS_EXTENSION_VERSION", value="~4"),
            azure_native.web.NameValuePairArgs(name="FUNCTIONS_WORKER_RUNTIME",    value="python"),
            azure_native.web.NameValuePairArgs(name="DATABASE_URL",                value=database_url),
            azure_native.web.NameValuePairArgs(name="WC_URL",                      value="https://theswedishglow.com"),
            azure_native.web.NameValuePairArgs(name="WC_CONSUMER_KEY",             value=wc_consumer_key),
            azure_native.web.NameValuePairArgs(name="WC_CONSUMER_SECRET",          value=wc_consumer_secret),
            azure_native.web.NameValuePairArgs(name="TL_CLIENT_ID",                value=tl_client_id),
            azure_native.web.NameValuePairArgs(name="TL_CLIENT_SECRET",            value=tl_client_secret),
            azure_native.web.NameValuePairArgs(name="TL_ACCESS_TOKEN",             value=tl_access_token),
            azure_native.web.NameValuePairArgs(name="TL_REFRESH_TOKEN",            value=tl_refresh_token),
        ],
    ),
)

# ── Outputs ───────────────────────────────────────────────────
pulumi.export("acr_login_server", acr.login_server)
pulumi.export("container_app_fqdn", container_app.configuration.apply(
    lambda c: c.ingress.fqdn if c and c.ingress else "pending"
))
pulumi.export("functions_app_name", fn_app.name)
