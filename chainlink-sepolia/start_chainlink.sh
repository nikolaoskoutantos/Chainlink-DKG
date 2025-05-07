#!/bin/bash

# Define variables
NETWORK_NAME="chainlink-net"
POSTGRES_PASSWORD="mysecretpassword"

# Create network if not exists
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "Creating Docker network: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
fi

# Start Postgres container
echo "Starting Postgres container..."
docker run --name cl-postgres \
  --network "$NETWORK_NAME" \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -d postgres

# Wait for Postgres to be ready
echo "Waiting for Postgres to initialize..."
sleep 10

# Start Chainlink node
echo "Starting Chainlink oracle node..."
docker run --platform linux/amd64 --name chainlink \
  --network "$NETWORK_NAME" \
  -v "$(pwd):/chainlink" \
  -it -p 6688:6688 \
  smartcontract/chainlink:2.20.0 \
  node -config /chainlink/config.toml -secrets /chainlink/secrets.toml start -a /chainlink/.api
