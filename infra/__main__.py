import pulumi
import pulumi_azure_native as azure_native

config = pulumi.Config()
stack = pulumi.get_stack()  # "staging" or "prod"

location = config.get("location") or "westeurope"

# ── Resource Group ──────────────────────────────────────────────────────────
rg = azure_native.resources.ResourceGroup(
    f"tsg-{stack}-rg",
    resource_group_name=f"tsg-{stack}-rg",
    location=location,
)

# ── Log Analytics (required by Container Apps) ──────────────────────────────
log_workspace = azure_native.operationalinsights.Workspace(
    f"tsg-{stack}-logs",
    workspace_name=f"tsg-{stack}-logs",
    resource_group_name=rg.name,
    location=rg.location,
    sku=azure_native.operationalinsights.WorkspaceSkuArgs(
        name=azure_native.operationalinsights.WorkspaceSkuNameEnum.PER_GB2018,
    ),
    retention_in_days=30,
)

log_workspace_keys = azure_native.operationalinsights.get_shared_keys_output(
    resource_group_name=rg.name,
    workspace_name=log_workspace.name,
)

# ── Container Registry ────────────────────────────────────────────────────────
acr_name = f"tsg{stack}acr"
acr = azure_native.containerregistry.Registry(
    acr_name,
    registry_name=acr_name,
    resource_group_name=rg.name,
    location=rg.location,
    sku=azure_native.containerregistry.SkuArgs(
        name=azure_native.containerregistry.SkuName.BASIC,
    ),
    admin_user_enabled=True,
)

acr_creds = azure_native.containerregistry.list_registry_credentials_output(
    resource_group_name=rg.name,
    registry_name=acr.name,
)
acr_username = acr_creds.username
acr_password = acr_creds.passwords[0].value

# ── Container App Environment ─────────────────────────────────────────────────
container_env = azure_native.app.ManagedEnvironment(
    f"tsg-{stack}-env",
    environment_name=f"tsg-{stack}-env",
    resource_group_name=rg.name,
    location=rg.location,
    app_logs_configuration=azure_native.app.AppLogsConfigurationArgs(
        destination="log-analytics",
        log_analytics_configuration=azure_native.app.LogAnalyticsConfigurationArgs(
            customer_id=log_workspace.customer_id,
            shared_key=log_workspace_keys.primary_shared_key,
        ),
    ),
)

# ── Secrets for Container App ─────────────────────────────────────────────────
app_secrets = [
    azure_native.app.SecretArgs(name="acr-password", value=acr_password),
    azure_native.app.SecretArgs(name="db-url",       value=config.require_secret("database_url")),
    azure_native.app.SecretArgs(name="db-url-sync",  value=config.require_secret("database_url_sync")),
    azure_native.app.SecretArgs(name="supabase-url", value=config.require_secret("supabase_url")),
    azure_native.app.SecretArgs(name="supabase-srk", value=config.require_secret("supabase_service_role_key")),
    azure_native.app.SecretArgs(name="supabase-jwt", value=config.require_secret("supabase_jwt_secret")),
    azure_native.app.SecretArgs(name="webhook-secret", value=config.require_secret("webhook_secret")),
    azure_native.app.SecretArgs(name="tl-client-id",  value=config.require_secret("tl_client_id")),
    azure_native.app.SecretArgs(name="tl-client-secret", value=config.require_secret("tl_client_secret")),
    azure_native.app.SecretArgs(name="tl-access-token",  value=config.require_secret("tl_access_token")),
    azure_native.app.SecretArgs(name="tl-refresh-token", value=config.require_secret("tl_refresh_token")),
    azure_native.app.SecretArgs(name="wc-key",    value=config.require_secret("wc_consumer_key")),
    azure_native.app.SecretArgs(name="wc-secret", value=config.require_secret("wc_consumer_secret")),
    azure_native.app.SecretArgs(name="blob-cs",   value=config.require_secret("azure_storage_connection_string")),
]

app_env_vars = [
    azure_native.app.EnvironmentVarArgs(name="DATABASE_URL",                   secret_ref="db-url"),
    azure_native.app.EnvironmentVarArgs(name="DATABASE_URL_SYNC",               secret_ref="db-url-sync"),
    azure_native.app.EnvironmentVarArgs(name="SUPABASE_URL",                    secret_ref="supabase-url"),
    azure_native.app.EnvironmentVarArgs(name="SUPABASE_SERVICE_ROLE_KEY",       secret_ref="supabase-srk"),
    azure_native.app.EnvironmentVarArgs(name="SUPABASE_JWT_SECRET",             secret_ref="supabase-jwt"),
    azure_native.app.EnvironmentVarArgs(name="WEBHOOK_SECRET",                  secret_ref="webhook-secret"),
    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_CLIENT_ID",            secret_ref="tl-client-id"),
    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_CLIENT_SECRET",        secret_ref="tl-client-secret"),
    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_ACCESS_TOKEN",         secret_ref="tl-access-token"),
    azure_native.app.EnvironmentVarArgs(name="TEAMLEADER_REFRESH_TOKEN",        secret_ref="tl-refresh-token"),
    azure_native.app.EnvironmentVarArgs(name="WC_URL",                          value="https://theswedishglow.com"),
    azure_native.app.EnvironmentVarArgs(name="WC_CONSUMER_KEY",                 secret_ref="wc-key"),
    azure_native.app.EnvironmentVarArgs(name="WC_CONSUMER_SECRET",              secret_ref="wc-secret"),
    azure_native.app.EnvironmentVarArgs(name="AZURE_STORAGE_CONNECTION_STRING", secret_ref="blob-cs"),
    azure_native.app.EnvironmentVarArgs(name="AZURE_BLOB_CONTAINER",            value="marketing-files"),
    azure_native.app.EnvironmentVarArgs(name="LOCAL_DEV",                       value="false"),
    azure_native.app.EnvironmentVarArgs(name="CORS_ORIGINS",                    value=config.get("cors_origins") or ""),
]

# ── Container App ─────────────────────────────────────────────────────────────
container_app = azure_native.app.ContainerApp(
    f"tsg-backend-{stack}",
    container_app_name=f"tsg-backend-{stack}",
    resource_group_name=rg.name,
    location=rg.location,
    managed_environment_id=container_env.id,
    configuration=azure_native.app.ConfigurationArgs(
        ingress=azure_native.app.IngressArgs(
            external=True,
            target_port=8000,
        ),
        registries=[
            azure_native.app.RegistryCredentialsArgs(
                server=acr.login_server,
                username=acr_username,
                password_secret_ref="acr-password",
            )
        ],
        secrets=app_secrets,
    ),
    template=azure_native.app.TemplateArgs(
        containers=[
            azure_native.app.ContainerArgs(
                name="tsg-backend",
                image=acr.login_server.apply(
                    lambda s: f"{s}/tsg-backend:latest"
                ),
                env=app_env_vars,
                resources=azure_native.app.ContainerResourcesArgs(
                    cpu=0.5,
                    memory="1Gi",
                ),
            )
        ],
        scale=azure_native.app.ScaleArgs(min_replicas=1, max_replicas=3),
    ),
)

# ── Storage Account (ETL Functions) ──────────────────────────────────────────
fn_storage_name = f"tsg{stack}fnstorage"
fn_storage = azure_native.storage.StorageAccount(
    fn_storage_name,
    account_name=fn_storage_name,
    resource_group_name=rg.name,
    location=rg.location,
    sku=azure_native.storage.SkuArgs(
        name=azure_native.storage.SkuName.STANDARD_LRS,
    ),
    kind=azure_native.storage.Kind.STORAGE_V2,
)

fn_storage_keys = azure_native.storage.list_storage_account_keys_output(
    resource_group_name=rg.name,
    account_name=fn_storage.name,
)
fn_storage_cs = pulumi.Output.all(fn_storage.name, fn_storage_keys).apply(
    lambda args: f"DefaultEndpointsProtocol=https;AccountName={args[0]};AccountKey={args[1].keys[0].value};EndpointSuffix=core.windows.net"
)

# ── App Service Plan (Consumption / serverless) ───────────────────────────────
fn_plan = azure_native.web.AppServicePlan(
    f"tsg-{stack}-fn-plan",
    name=f"tsg-{stack}-fn-plan",
    resource_group_name=rg.name,
    location=rg.location,
    kind="functionapp",
    reserved=True,  # required for Linux
    sku=azure_native.web.SkuDescriptionArgs(
        name="Y1",
        tier="Dynamic",
    ),
)

# ── Functions App (ETL) ───────────────────────────────────────────────────────
fn_app_name = f"tsg-etl-{stack}"
fn_app = azure_native.web.WebApp(
    fn_app_name,
    name=fn_app_name,
    resource_group_name=rg.name,
    location=rg.location,
    server_farm_id=fn_plan.id,
    kind="functionapp,linux",
    site_config=azure_native.web.SiteConfigArgs(
        linux_fx_version="Python|3.12",
        app_settings=[
            azure_native.web.NameValuePairArgs(
                name="AzureWebJobsStorage", value=fn_storage_cs,
            ),
            azure_native.web.NameValuePairArgs(
                name="FUNCTIONS_EXTENSION_VERSION", value="~4",
            ),
            azure_native.web.NameValuePairArgs(
                name="FUNCTIONS_WORKER_RUNTIME", value="python",
            ),
            azure_native.web.NameValuePairArgs(
                name="DATABASE_URL_SYNC",
                value=config.require_secret("database_url_sync"),
            ),
            azure_native.web.NameValuePairArgs(
                name="TEAMLEADER_CLIENT_ID",
                value=config.require_secret("tl_client_id"),
            ),
            azure_native.web.NameValuePairArgs(
                name="TEAMLEADER_CLIENT_SECRET",
                value=config.require_secret("tl_client_secret"),
            ),
            azure_native.web.NameValuePairArgs(
                name="TEAMLEADER_ACCESS_TOKEN",
                value=config.require_secret("tl_access_token"),
            ),
            azure_native.web.NameValuePairArgs(
                name="TEAMLEADER_REFRESH_TOKEN",
                value=config.require_secret("tl_refresh_token"),
            ),
            azure_native.web.NameValuePairArgs(
                name="WC_URL", value="https://theswedishglow.com",
            ),
            azure_native.web.NameValuePairArgs(
                name="WC_CONSUMER_KEY",
                value=config.require_secret("wc_consumer_key"),
            ),
            azure_native.web.NameValuePairArgs(
                name="WC_CONSUMER_SECRET",
                value=config.require_secret("wc_consumer_secret"),
            ),
        ],
    ),
)

# ── Outputs ────────────────────────────────────────────────────────────────────
pulumi.export("acr_login_server",   acr.login_server)
pulumi.export("container_app_fqdn", container_app.configuration.apply(
    lambda c: c.ingress.fqdn if c and c.ingress else ""
))
pulumi.export("functions_app_name", fn_app.name)
pulumi.export("resource_group",     rg.name)
