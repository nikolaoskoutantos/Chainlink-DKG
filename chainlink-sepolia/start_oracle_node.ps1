# Define variables
$networkName = "chainlink-net"
$postgresPassword = "mysecretpassword"
$cwd = $pwd.Path.Replace("\", "/").Replace("C:", "/c")

# Create Docker network if it doesn't exist
if (-not (docker network ls --filter name=^$networkName$ -q)) {
    Write-Host "Creating Docker network: $networkName"
    docker network create $networkName
}

# Start Postgres container
Write-Host "Starting Postgres container..."
docker run --name cl-postgres `
    --network $networkName `
    -e POSTGRES_PASSWORD=$postgresPassword `
    -d postgres

# Wait for Postgres to initialize
Write-Host "Waiting for Postgres to initialize..."
Start-Sleep -Seconds 10

# Start Chainlink oracle node
Write-Host "Starting Chainlink oracle node..."
docker run --platform linux/amd64 --name chainlink `
    --network $networkName `
    -v "${cwd}:/chainlink" `
    -d -p 6688:6688 `
    smartcontract/chainlink:2.20.0 `
    node -config /chainlink/config.toml -secrets /chainlink/secrets.toml start -a /chainlink/.api
