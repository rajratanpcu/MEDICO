#!/usr/bin/env pwsh
# Script to rebuild and restart the gateway service

Write-Host "Building backend JAR..." -ForegroundColor Cyan
cd backend
mvn -B -DskipTests clean package

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    Write-Host "Rebuilding Docker image..." -ForegroundColor Cyan
    cd ..
    docker-compose build gateway
    
    Write-Host "Restarting gateway service..." -ForegroundColor Cyan
    docker-compose up -d gateway
    
    Write-Host "Waiting for service to start..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10
    
    Write-Host "Testing health endpoint..." -ForegroundColor Cyan
    curl.exe http://localhost:8080/actuator/health
    
    Write-Host "`nGateway rebuild complete!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
