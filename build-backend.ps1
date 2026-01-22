# Build Spring Boot Backend

Write-Host "=== Building Medical Assistant Backend ===" -ForegroundColor Cyan
Write-Host ""

$backendDir = "backend"

# Check if backend directory exists
if (!(Test-Path $backendDir)) {
    Write-Host "ERROR: Backend directory not found" -ForegroundColor Red
    exit 1
}

# Check if Maven is installed
$mvnVersion = mvn --version 2>&1 | Select-String "Apache Maven"
if (!$mvnVersion) {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven from https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found: $mvnVersion" -ForegroundColor Green
Write-Host ""

# Build the project
Write-Host "Building backend..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

cd $backendDir
mvn clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Build Successful ===" -ForegroundColor Green
    
    # Check JAR file
    $jarFile = Get-ChildItem target\*.jar -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "*-sources.jar" -and $_.Name -notlike "*-javadoc.jar" }
    
    if ($jarFile) {
        $sizeMB = [math]::Round($jarFile.Length / 1MB, 2)
        Write-Host "Created: $($jarFile.Name) ($sizeMB MB)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To run the backend:" -ForegroundColor Yellow
        Write-Host "  java -jar backend\target\$($jarFile.Name)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Or use Docker Compose:" -ForegroundColor Yellow
        Write-Host "  docker-compose up --build" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "=== Build Failed ===" -ForegroundColor Red
    Write-Host "Check the errors above and fix any issues" -ForegroundColor Yellow
    exit 1
}
