# CI/CD + IaC Design Spec — TSG Website

## Environments

| Environment | GitHub Environment | Protection |
|---|---|---|
| `staging` | `staging` | None — auto-deploy on push to main |
| `production` | `production` | Required reviewer approval |

## Workflow Map

| File | Trigger paths | Test | Staging deploy | Prod deploy |
|---|---|---|---|---|
| `backend.yml` | `tsg-backend/**` excl. `etl/` | `pytest tests/ -v` | `docker build` → ACR → `az containerapp update` | Same, prod app |
| `etl.yml` | `tsg-backend/etl/**` | `pytest tests/test_etl_*.py` | `azure/functions-action` to staging Functions | Same, prod app |
| `frontend.yml` | `tsg-frontend/**` | `tsc --noEmit` + `jest` | — (Netlify owns deploy) | — |
| `infra.yml` | `infra/**` | `pulumi preview --stack staging` (PR only) | `pulumi up --stack staging` | `pulumi up --stack prod` |

All workflows use the same OIDC login block. Deploy jobs have `if: github.event_name == 'push'` so PRs only run tests.

## Job Dependency Graph

```
[test] ─── push to main? ──► [deploy-staging] ──► [deploy-prod]
                                environment:          environment:
                                staging (auto)        production (approval)
PR only runs [test]
```

## Pulumi IaC

**State backend:** Pulumi Cloud (`PULUMI_ACCESS_TOKEN` secret)
**Language:** Python
**Provider:** `pulumi-azure-native`

**Stacks:** `staging`, `prod` — each gets its own resource group and all compute resources.

**Resources per stack:**

| Resource | Staging name | Prod name |
|---|---|---|
| Resource Group | `tsg-staging-rg` | `tsg-prod-rg` |
| Log Analytics Workspace | `tsg-staging-logs` | `tsg-prod-logs` |
| Container Registry | `tsgstagingacr` | `tsgprodacr` |
| Container App Environment | `tsg-staging-env` | `tsg-prod-env` |
| Container App | `tsg-backend-staging` | `tsg-backend-prod` |
| Storage Account (ETL) | `tsgstagingfnstorage` | `tsgprodfnstorage` |
| Functions App | `tsg-etl-staging` | `tsg-etl-prod` |

**Not owned by Pulumi:** Azure PostgreSQL Flexible Server, Blob Storage container — passed in as encrypted config secrets.

**Pulumi stack config keys** (set once locally via `pulumi config set -s <stack> --secret`):
`database_url`, `database_url_sync`, `supabase_url`, `supabase_service_role_key`, `supabase_jwt_secret`, `webhook_secret`, `tl_client_id`, `tl_client_secret`, `tl_access_token`, `tl_refresh_token`, `wc_consumer_key`, `wc_consumer_secret`, `azure_storage_connection_string`, `cors_origins` (not secret)

**Pulumi exports:** `acr_login_server`, `container_app_fqdn`, `functions_app_name`

## .gitignore additions (root)

```
# Pulumi local cache
.pulumi/

# Defensive root-level node
node_modules/
```

`Pulumi.staging.yaml` and `Pulumi.prod.yaml` are **committed** (Pulumi encrypts secrets inline).

## Documentation updates
- `CLAUDE.md` — new "CI/CD & Deployment" section
- `README.md` — new "Deployment" section

## Files deleted
- `.github/workflows/cd.yml` — replaced by `backend.yml` + `etl.yml`
- `tsg-backend/deploy.sh` — superseded by CI/CD

## GitHub Secrets Setup

### Repository-level secrets (Settings → Secrets → Actions)
| Secret | Value |
|---|---|
| `AZURE_CLIENT_ID` | Client ID of the OIDC-enabled Azure AD app |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `ACR_LOGIN_SERVER` | e.g. `tsgprodacr.azurecr.io` |

### Environment-level secrets

**staging** environment:
| Secret | Value |
|---|---|
| `PULUMI_ACCESS_TOKEN` | From Pulumi Cloud account |
| `RESOURCE_GROUP` | `tsg-staging-rg` |
| `CONTAINER_APP_NAME` | `tsg-backend-staging` |
| `FUNCTIONS_APP_NAME` | `tsg-etl-staging` |

**production** environment:
| Secret | Value |
|---|---|
| `PULUMI_ACCESS_TOKEN` | Same token |
| `RESOURCE_GROUP` | `tsg-prod-rg` |
| `CONTAINER_APP_NAME` | `tsg-backend-prod` |
| `FUNCTIONS_APP_NAME` | `tsg-etl-prod` |

## OIDC One-Time Setup

```bash
# 1. Create Azure AD app
APP_ID=$(az ad app create --display-name "tsg-github-actions" --query appId -o tsv)
az ad sp create --id $APP_ID

# 2. Assign Contributor role on subscription
az role assignment create \
  --role Contributor \
  --assignee $APP_ID \
  --scope /subscriptions/<SUBSCRIPTION_ID>

# 3. Add federated credential for main branch pushes
az ad app federated-credential create --id $APP_ID --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:<OWNER>/<REPO>:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'

# 4. Add federated credential for PRs
az ad app federated-credential create --id $APP_ID --parameters '{
  "name": "github-pr",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:<OWNER>/<REPO>:pull_request",
  "audiences": ["api://AzureADTokenExchange"]
}'

# 5. Save outputs as GitHub secrets
echo "AZURE_CLIENT_ID: $APP_ID"
az account show --query tenantId -o tsv   # → AZURE_TENANT_ID
az account show --query id -o tsv         # → AZURE_SUBSCRIPTION_ID
```

## One-Time Setup Order

1. Create Pulumi Cloud account → get `PULUMI_ACCESS_TOKEN`
2. Run OIDC setup commands above → get `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
3. Create GitHub Environments: `staging` (no protection), `production` (required reviewer)
4. Set repository secrets: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `ACR_LOGIN_SERVER`
5. Set environment secrets on `staging` and `production`
6. `cd infra && pulumi stack init staging && pulumi config set ... && pulumi up`
7. `cd infra && pulumi stack init prod && pulumi config set ... && pulumi up`
8. Push first backend change → full pipeline runs end-to-end
