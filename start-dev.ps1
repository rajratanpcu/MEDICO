# Start Medical Assistant Development Environment

Write-Host "=== Medical Assistant Development Environment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Select-String "Server Version"
if (-not $dockerRunning) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker is running" -ForegroundColor Green

# Check if ports are available
Write-Host "`nChecking required ports..." -ForegroundColor Yellow
$ports = @(5432, 2181, 9092, 8080, 8000, 9090, 3000, 9200, 5044, 5601)
$portsInUse = @()

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $portsInUse += $port
        Write-Host "  Port $port is in use" -ForegroundColor Yellow
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host "`nWarning: The following ports are in use:" -ForegroundColor Yellow
    $portsInUse | ForEach-Object { Write-Host "  - $_" }
    Write-Host "`nDocker Compose may fail if these ports are required." -ForegroundColor Yellow
    $continue = Read-Host "`nDo you want to continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

Write-Host "`n✓ Port check complete" -ForegroundColor Green

# Start Docker Compose
Write-Host "`nStarting services with Docker Compose..." -ForegroundColor Yellow
Write-Host "This may take several minutes on first run..." -ForegroundColor Gray
docker-compose up --build

Write-Host "`n=== Services Started ===" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "AI Service: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Prometheus: http://localhost:9090" -ForegroundColor Cyan
Write-Host "Grafana: http://localhost:3000 (admin/admin)" -ForegroundColor Cyan
Write-Host "Kibana: http://localhost:5601" -ForegroundColor Cyan
