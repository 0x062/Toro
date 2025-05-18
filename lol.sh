#!/usr/bin/env bash
# Usage: ./open8000.sh <RESOURCE_GROUP> <VM_NAME>

RG="$1"
VM="$2"

# Buka port 8000/tcp dengan priority 1000
az vm open-port \
  --resource-group "$RG" \
  --name "$VM" \
  --port 8000 \
  --priority 1000 \
  --only-show-errors

echo "Port 8000 dibuka untuk $VM di RG $RG"
