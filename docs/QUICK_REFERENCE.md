# Quick Reference Guide - Medical Assistant System

## Build & Run

### Build Backend
```powershell
.\build-backend.ps1
```

### Start All Services
```powershell
.\start-dev.ps1
```

### Stop All Services
```powershell
docker-compose down
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f gateway
docker-compose logs -f ai-service
docker-compose logs -f kafka
```

## API Endpoints

### Authentication
```bash
# Register
POST http://localhost:8080/auth/register
{
  "email": "doctor@hospital.com",
  "password": "SecurePass123!",
  "role": "CLINICIAN"
}

# Login
POST http://localhost:8080/auth/login
{
  "email": "doctor@hospital.com",
  "password": "SecurePass123!"
}

# Response
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "expiresIn": 86400000
}
```

### Patients (Requires JWT)
```bash
# Create Patient
POST http://localhost:8080/patients
Authorization: Bearer <token>
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "MALE",
  "email": "john.doe@example.com",
  "phone": "+1234567890"
}

# List Patients
GET http://localhost:8080/patients
Authorization: Bearer <token>

# Get Patient by ID
GET http://localhost:8080/patients/{id}
Authorization: Bearer <token>
```

### Medical Reports
```bash
# Create Report
POST http://localhost:8080/patients/{patientId}/reports?doctorId={doctorId}
Authorization: Bearer <token>
{
  "title": "Blood Test Results",
  "reportType": "LAB_RESULT",
  "storageUrl": "s3://bucket/report.pdf",
  "reportDate": "2024-01-20"
}

# List Reports
GET http://localhost:8080/patients/{patientId}/reports
Authorization: Bearer <token>
```

### AI Services
```bash
# Analyze Report
POST http://localhost:8000/ocr/analyze-report
{
  "report_url": "https://example.com/report.pdf"
}

# Predict Symptoms
POST http://localhost:8000/predict/symptoms
{
  "symptoms": ["fever", "cough", "fatigue"]
}

# Medical Chat
POST http://localhost:8000/chat
{
  "question": "What are the symptoms of diabetes?"
}

# Fine-tune Model (Background Task)
POST http://localhost:8000/models/fine-tune
{
  "dataset_url": "https://example.com/dataset.csv",
  "model_name": "symptom-classifier",
  "epochs": 3,
  "learning_rate": 0.00002
}
```

## Monitoring URLs

- **Backend API**: http://localhost:8080
- **AI Service**: http://localhost:8000
- **API Docs (FastAPI)**: http://localhost:8000/docs
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Kibana**: http://localhost:5601

## Common Queries

### Prometheus
```promql
# Request rate
rate(http_server_requests_seconds_count[5m])

# Error rate
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# JVM heap usage
jvm_memory_used_bytes{area="heap"}

# Business metrics
medical_reports_created_total
medical_patients_created_total
medical_auth_login_total
```

### Kibana
```
# Search by log level
level: ERROR

# Search audit logs
log_type: audit AND action: PATIENT_ACCESS

# Search by logger
logger: com.example.medical.report.MedicalReportService

# Search by timeframe
@timestamp: [now-1h TO now]
```

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using port 8080
Get-NetTCPConnection -LocalPort 8080

# Stop specific container
docker-compose stop gateway
```

### Database Connection Issues
```powershell
# Check Postgres logs
docker-compose logs postgres

# Connect to Postgres
docker exec -it $(docker-compose ps -q postgres) psql -U medical_user -d medical
```

### Kafka Not Responding
```powershell
# Restart Kafka and Zookeeper
docker-compose restart zookeeper kafka

# Check Kafka logs
docker-compose logs kafka

# List Kafka topics
docker exec -it $(docker-compose ps -q kafka) kafka-topics --list --bootstrap-server localhost:9092
```

### AI Service Crashes
```powershell
# Check AI service logs
docker-compose logs ai-service

# Check disk space (models can be large)
docker system df

# Rebuild AI service
docker-compose up --build ai-service
```

## Configuration Files

- **Backend Config**: backend/src/main/resources/application.yml
- **Docker Services**: docker-compose.yml
- **Prometheus Config**: prometheus.yml
- **Logstash Pipeline**: logstash.conf
- **AI Dependencies**: ai-service/requirements.txt

## Security Checklist

- [ ] Change JWT secret in application.yml (512-bit random key)
- [ ] Update database password in docker-compose.yml
- [ ] Enable HTTPS for production endpoints
- [ ] Configure CORS allowed origins (no wildcard in prod)
- [ ] Set up database encryption (pgcrypto)
- [ ] Review audit logging configuration
- [ ] Enable API rate limiting
- [ ] Run security scan (Snyk, OWASP Dependency-Check)

## Development Workflow

1. **Start infrastructure**: `docker-compose up postgres zookeeper kafka`
2. **Build backend**: `.\build-backend.ps1`
3. **Run backend**: `java -jar backend/target/medical-backend-0.0.1-SNAPSHOT.jar`
4. **Run AI service**: `cd ai-service; uvicorn app.main:app --reload`
5. **Test API**: Use curl or Postman
6. **Check metrics**: http://localhost:9090
7. **View logs**: http://localhost:5601

## Production Deployment

1. **Build images**: `docker-compose build`
2. **Tag images**: `docker tag medical-backend:latest registry.example.com/medical-backend:v1.0.0`
3. **Push images**: `docker push registry.example.com/medical-backend:v1.0.0`
4. **Deploy to Kubernetes**: `kubectl apply -f k8s/`
5. **Verify deployment**: `kubectl get pods -n medical`
6. **Check logs**: `kubectl logs -f deployment/medical-backend -n medical`

## Useful Commands

```powershell
# Clean Docker
docker system prune -a --volumes

# Check Java version
java --version

# Check Maven version
mvn --version

# Install Python dependencies
cd ai-service
pip install -r requirements.txt

# Run backend tests
cd backend
mvn test

# Run AI service tests
cd ai-service
pytest tests/

# Generate API documentation
cd backend
mvn springdoc-openapi:generate
```
