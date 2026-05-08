#!/bin/bash
set -e
RESOURCE_GROUP="tsg-backend-rg"
LOCATION="westeurope"
ACR_NAME="tsgbackendacr"
APP_NAME="tsg-backend"
ENV_NAME="tsg-backend-env"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Container Registry
az acr create --name $ACR_NAME --resource-group $RESOURCE_GROUP --sku Basic --admin-enabled true

# Build and push image
az acr build --registry $ACR_NAME --image tsg-backend:latest .

# Create Container App environment
az containerapp env create --name $ENV_NAME --resource-group $RESOURCE_GROUP --location $LOCATION

# Create Container App
az containerapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_NAME.azurecr.io/tsg-backend:latest \
  --target-port 8000 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 5 \
  --env-vars DATABASE_URL=secretref:database-url SUPABASE_JWT_SECRET=secretref:jwt-secret

echo "Deployed. URL: $(az containerapp show --name $APP_NAME --resource-group $RESOURCE_GROUP --query 'properties.configuration.ingress.fqdn' -o tsv)"
