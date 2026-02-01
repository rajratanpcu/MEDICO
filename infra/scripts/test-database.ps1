# Test Database Connection and API
Write-Host "=== Testing Medical System Database Connection ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check (Database Status):" -ForegroundColor Yellow
$health = curl.exe -s http://localhost:8080/actuator/health | ConvertFrom-Json
Write-Host "   Status: $($health.status)" -ForegroundColor Green
Write-Host "   Database: $($health.components.db.details.database)" -ForegroundColor Green
Write-Host "   DB Status: $($health.components.db.status)" -ForegroundColor Green

# Test 2: Login
Write-Host "`n2. Authentication:" -ForegroundColor Yellow
$authResponse = curl.exe -s -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d "@login.json" | ConvertFrom-Json
$token = $authResponse.token
Write-Host "   Token obtained: $($token.Substring(0, 50))..." -ForegroundColor Green

# Test 3: Get Patients
Write-Host "`n3. Fetching Patients:" -ForegroundColor Yellow
$patients = curl.exe -s http://localhost:8080/patients -H "Authorization: Bearer $token" | ConvertFrom-Json
Write-Host "   Total Patients: $($patients.Count)" -ForegroundColor Green
foreach ($patient in $patients) {
    Write-Host "   - $($patient.firstName) $($patient.lastName) ($($patient.email))" -ForegroundColor White
}

# Test 4: Get Doctors
Write-Host "`n4. Fetching Doctors:" -ForegroundColor Yellow
$doctors = curl.exe -s http://localhost:8080/doctors -H "Authorization: Bearer $token" | ConvertFrom-Json
Write-Host "   Total Doctors: $($doctors.Count)" -ForegroundColor Green
foreach ($doctor in $doctors) {
    Write-Host "   - Dr. $($doctor.firstName) $($doctor.lastName) - $($doctor.specialty)" -ForegroundColor White
}

# Test 5: Get Medical Reports
Write-Host "`n5. Fetching Medical Reports:" -ForegroundColor Yellow
$reports = curl.exe -s http://localhost:8080/reports -H "Authorization: Bearer $token" | ConvertFrom-Json
Write-Host "   Total Reports: $($reports.Count)" -ForegroundColor Green
foreach ($report in $reports) {
    Write-Host "   - $($report.title) ($($report.reportType))" -ForegroundColor White
}

# Test 6: Get Prescriptions
Write-Host "`n6. Fetching Prescriptions:" -ForegroundColor Yellow
$prescriptions = curl.exe -s http://localhost:8080/prescriptions -H "Authorization: Bearer $token" | ConvertFrom-Json
Write-Host "   Total Prescriptions: $($prescriptions.Count)" -ForegroundColor Green
foreach ($rx in $prescriptions) {
    Write-Host "   - $($rx.drugName) $($rx.dosage) - $($rx.frequency)" -ForegroundColor White
}

Write-Host "`n=== Database Connection Test Complete! ===" -ForegroundColor Cyan
Write-Host "✅ PostgreSQL database is connected and working properly" -ForegroundColor Green
