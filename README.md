# AI-Powered Smart Medical Assistant

Production-ready medical system with JWT authentication, Kafka messaging, AI fine-tuning, and comprehensive observability.

**Important:** This software is non-clinical and provided "AS IS"; it is not cleared for diagnosis or treatment. See NOTICE for details.

## Features

### Core Capabilities
- **Patient & Doctor Management**: Complete CRUD with status tracking and audit trails
- **Medical Reports**: Upload, store, analyze reports with AI-powered OCR and NER
- **Prescriptions**: Create, track prescriptions with dosage and duration management
- **Emergency Access**: Request/approve emergency access to patient records with audit logging
- **AI Analysis**: Symptom prediction, entity extraction (drugs/diagnoses/procedures), medical chat

### Security & Authentication
- **JWT Authentication**: Secure endpoints with Bearer tokens (24h expiration)
- **Role-Based Access Control**: ADMIN, CLINICIAN, AUDITOR roles
- **BCrypt Password Hashing**: Industry-standard password encryption
- **Stateless Sessions**: Horizontal scalability with JWT

### Event-Driven Architecture
- **Kafka Messaging**: Async document processing pipeline
- **Event Publishing**: Report uploads trigger OCR/analysis workflows
- **Consumer Groups**: Scalable event processing with "medical-group"

### AI & Machine Learning
- **Fine-Tuning Pipeline**: Train custom models on medical datasets (MIMIC-III, i2b2)
- **BioClinicalBERT**: Base model for clinical NLP tasks
- **Background Training**: Non-blocking fine-tuning with FastAPI BackgroundTasks
- **Model Artifacts**: Persistent storage in /models volume

### Observability & Monitoring
- **Prometheus Metrics**: Spring Boot Actuator + custom business metrics
- **ELK Stack**: Centralized logging with Elasticsearch, Logstash, Kibana
- **Audit Logging**: Structured logs for compliance (USER_LOGIN, PATIENT_ACCESS, DATA_EXPORTED)
- **Grafana Dashboards**: Real-time metrics visualization

## Project Structure
```
.
├── backend/                      # Spring Boot microservices
│   ├── src/main/java/com/example/medical/
│   │   ├── patient/              # Patient CRUD, service, controller, DTOs
│   │   ├── doctor/               # Doctor management
│   │   ├── report/               # Medical reports with Kafka event publishing
│   │   ├── prescription/         # Prescription management
│   │   ├── emergency/            # Emergency access request/approval flow
│   │   ├── auth/                 # User entity, AuthService, AuthController
│   │   ├── security/             # JWT provider, filter, SecurityConfig
│   │   ├── messaging/            # Kafka producer, consumer, events
│   │   ├── observability/        # Metrics, audit logging
│   │   ├── ai/                   # AI service REST client
│   │   ├── config/               # KafkaConfig, WebClientConfig
│   │   ├── exception/            # Global exception handler
│   │   └── common/               # Enums, base entity
│   ├── src/main/resources/
│   │   └── application.yml       # Spring Boot config (DB, Kafka, JWT, metrics)
│   └── pom.xml                   # Maven dependencies
├── ai-service/                   # FastAPI microservice
│   ├── app/
│   │   ├── main.py               # OCR, symptoms, chat, fine-tune endpoints
│   │   └── training/
│   │       ├── fine_tune.py      # MedicalModelTrainer with BioClinicalBERT
│   │       └── __init__.py
│   ├── requirements.txt          # transformers, torch, datasets, faiss, langchain
│   └── Dockerfile
├── docker-compose.yml            # Full stack: Postgres, Kafka, Prometheus, ELK, Grafana
├── prometheus.yml                # Prometheus scrape config
├── logstash.conf                 # Logstash pipeline with grok filters
├── Dockerfile.backend            # Spring Boot container
├── build-backend.ps1             # Build script for Windows
├── start-dev.ps1                 # Docker Compose startup script
└── README.md                     # This file
```

## Quick Start

### Option 1: Docker Compose (Recommended)

**Prerequisites:**
- Docker Desktop with Docker Compose
- 8GB+ RAM allocated to Docker
- Ports available: 5432, 2181, 9092, 8080, 8000, 9090, 3000, 9200, 5044, 5601

**Start all services:**
```powershell
# Windows PowerShell
.\start-dev.ps1

# Or manually:
docker-compose up --build
```

**Access the application:**
- Backend API: http://localhost:8080
- AI Service: http://localhost:8000
- API Docs (FastAPI): http://localhost:8000/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- Kibana: http://localhost:5601

### Option 2: Local Development

**Prerequisites:**
- Java 21 (JDK)
- Maven 3.9+
- PostgreSQL 15
- Python 3.11
- Docker (for Kafka, Prometheus, ELK)

**1. Start infrastructure services:**
```powershell
# Start only Postgres, Kafka, monitoring stack
docker-compose up postgres zookeeper kafka prometheus grafana elasticsearch logstash kibana
```

**2. Build and run Spring Boot backend:**
```powershell
# Windows
.\build-backend.ps1

# Or manually:
cd backend
mvn clean package -DskipTests
java -jar target/medical-backend-0.0.1-SNAPSHOT.jar
```

**3. Run FastAPI AI service:**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Documentation

### Authentication

**Register a new user:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "SecurePass123!",
    "role": "CLINICIAN"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@hospital.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "expiresIn": 86400000
}
```

**Use token in requests:**
```bash
curl http://localhost:8080/patients \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

### Patients
- `POST /patients` - Create patient
- `GET /patients` - List all patients
- `GET /patients/{id}` - Get patient details
- `PUT /patients/{id}` - Update patient

### Doctors
- `POST /doctors` - Create doctor
- `GET /doctors` - List all doctors
- `GET /doctors/{id}` - Get doctor details
- `PUT /doctors/{id}` - Update doctor
- `PUT /doctors/{id}/status` - Change status (ACTIVE/SUSPENDED/RETIRED)

### Medical Reports
- `POST /patients/{patientId}/reports?doctorId=...` - Create report
- `GET /patients/{patientId}/reports` - List patient reports
- `GET /patients/{patientId}/reports/{reportId}` - Get report
- `PATCH /patients/{patientId}/reports/{reportId}/status` - Update status (PROCESSING/READY/ERROR)
- `PATCH /patients/{patientId}/reports/{reportId}/summary` - Update OCR summary

### Prescriptions
- `POST /patients/{patientId}/prescriptions?doctorId=...` - Create prescription
- `GET /patients/{patientId}/prescriptions` - List patient prescriptions

### Emergency Access
- `POST /patients/{patientId}/emergency-access` - Request emergency access
- `POST /patients/{patientId}/emergency-access/{requestId}/approve?doctorId=...` - Approve request
- `POST /patients/{patientId}/emergency-access/{requestId}/deny` - Deny request
- `GET /patients/{patientId}/emergency-access` - List active emergency access

### AI Services
- `POST /ai/analyze-report` - Analyze medical report (OCR + NER)
- `POST /ai/chat` - Clinical decision support chat
- `POST /ai/fine-tune` - Fine-tune medical NLP models (background task)

## Architecture

### Layered Backend
- **Controller**: HTTP/JSON, validation (@Valid), authorization, no business logic
- **Service**: Business logic, @Transactional boundaries, event publishing
- **Repository**: Data access via Spring Data JPA
- **Entity**: Domain model with JPA annotations, audit fields
- **DTO**: Request/response objects for API contracts

### Microservices
- **Spring Boot Gateway** (Port 8080): REST APIs, JWT auth, Kafka producer
- **FastAPI AI** (Port 8000): OCR, symptom prediction, chat, model fine-tuning
- **PostgreSQL** (Port 5432): Relational storage with UUID PKs
- **Kafka + Zookeeper** (9092, 2181): Event streaming for async workflows
- **Prometheus** (9090): Metrics collection from Spring Boot Actuator
- **Grafana** (3000): Dashboards and visualization
- **ELK Stack** (9200, 5044, 5601): Centralized logging and search

### Security Architecture
```
Client Request
    ↓
JWT Filter → Extract Bearer token
    ↓
JWT Provider → Validate signature, expiration, extract claims
    ↓
Security Context → Set authentication (userId, email, role)
    ↓
Controller → Access via @AuthenticationPrincipal or SecurityContextHolder
```

### Event-Driven Workflow
```
POST /patients/{id}/reports
    ↓
MedicalReportService.create()
    ↓
Save report to DB → Publish DocumentUploadedEvent to Kafka
    ↓
KafkaConsumerService receives event → Call AI Service OCR endpoint
    ↓
Update report with OCR results
```

### Key Design Patterns
- **JWT Stateless Auth**: No server-side session storage, horizontally scalable
- **Event Sourcing**: Kafka events capture state changes for audit trail
- **CQRS-lite**: Read models optimized separately from write models
- **Repository Pattern**: Abstraction over JPA, easy to mock for testing
- **DTO Pattern**: Separate API contracts from domain entities
- **Global Exception Handling**: `@RestControllerAdvice` with consistent ApiError
- **Validation**: `@Valid` + JSR-380 annotations (NotBlank, Email, Pattern)
- **Audit Timestamps**: `@PrePersist/@PreUpdate` for createdAt/updatedAt
- **UUID Primary Keys**: Distributed-friendly identifiers

## Database Schema (PostgreSQL)

Core tables (auto-created via JPA ddl-auto=update):
- `users` (id, email unique, passwordHash, role, status, createdAt, updatedAt)
- `patients` (id, firstName, lastName, dob, gender, email, phone, status, createdAt, updatedAt)
- `doctors` (id, firstName, lastName, email, phone, specialty, status, createdAt, updatedAt)
- `medical_reports` (id, patient_id FK, doctor_id FK, title, reportType, storageUrl, summary, status, reportDate, createdAt, updatedAt)
- `prescriptions` (id, patient_id FK, doctor_id FK, drugName, dosage, frequency, route, startDate, endDate, status, createdAt, updatedAt)
- `emergency_access` (id, patient_id FK, requesterName, reason, approvedByDoctorId FK, expiresAt, status, notes, createdAt, updatedAt)
- `ai_request_logs` (id, patient_id FK, report_id FK, requestType, payloadHash, responseSummary, status, modelVersion, createdAt, updatedAt)

## Configuration

### Spring Boot (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medical
    username: medical_user
    password: change_me
  jpa:
    hibernate:
      ddl-auto: update
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: medical-group
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"

jwt:
  secret: "your-secret-key-min-256-bits-for-hs512-algorithm-change-in-production"
  expiration-ms: 86400000  # 24 hours

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true

logging:
  level:
    AUDIT: INFO
    com.example.medical: DEBUG
  file:
    name: logs/application.log
```

### AI Service Configuration
```python
# Environment variables
MODEL_DIR = "/models"  # Persistent volume for trained models
KAFKA_BOOTSTRAP_SERVERS = "kafka:29092"

# Fine-tuning defaults
BASE_MODEL = "emilyalsentzer/Bio_ClinicalBERT"
DEFAULT_EPOCHS = 3
DEFAULT_BATCH_SIZE = 16
DEFAULT_LEARNING_RATE = 2e-5
## Security & Best Practices

### Implemented Security Features
- **JWT Authentication**: Secure endpoints with Bearer tokens (HS512 signature)
- **Password Hashing**: BCrypt with strength 10 for password storage
- **Stateless Sessions**: No server-side state, JWT contains all auth info
- **CORS Configuration**: Configurable allowed origins (default: localhost:3000)
- **Role-Based Access Control**: ADMIN, CLINICIAN, AUDITOR roles
- **Audit Logging**: Structured logs for compliance (USER_LOGIN, PATIENT_ACCESS, REPORT_CREATED, EMERGENCY_ACCESS, DATA_EXPORTED)
- **Validation**: All DTOs validated via @Valid + JSR-380 annotations
- **Error Handling**: Global exception handler with consistent ApiError shape
- **PII Protection**: Store sensitive fields encrypted; audit all access

### Production Recommendations
1. **Change JWT Secret**: Replace placeholder in application.yml with 512-bit random key
2. **Enable HTTPS**: TLS/SSL certificates for all endpoints
3. **Rotate Secrets**: Regular rotation of JWT signing keys
4. **Database Encryption**: Enable Postgres column-level encryption (pgcrypto) for PII
5. **API Rate Limiting**: Add Spring Cloud Gateway rate limiter or Bucket4j
6. **Input Sanitization**: Add OWASP ESAPI for XSS prevention
7. **Dependency Scanning**: Run Snyk or OWASP Dependency-Check in CI/CD
8. **Penetration Testing**: Regular security audits

## Monitoring & Observability

### Metrics (Prometheus)
- **Spring Boot Actuator**: JVM metrics, HTTP request metrics, DB connection pool
- **Custom Business Metrics**:
  - `medical_reports_created_total`: Counter for report creation
  - `medical_patients_created_total`: Counter for patient registration
  - `medical_auth_login_total`: Counter for authentication attempts
  - `medical_documents_analyzed_total`: Counter for AI analysis requests

**Access Prometheus**: http://localhost:9090
**Query examples**:
```promql
rate(http_server_requests_seconds_count[5m])
medical_reports_created_total
jvm_memory_used_bytes{area="heap"}
```

### Logging (ELK Stack)
- **Application Logs**: Java logs from Spring Boot backend
- **Audit Logs**: Structured logs with action, userId, timestamp, details
- **Grok Patterns**: Parse timestamp, thread, level, logger, message
- **Index Pattern**: `medical-logs-YYYY.MM.dd` in Elasticsearch

**Access Kibana**: http://localhost:5601
**Sample Queries**:
```
level: ERROR
log_type: audit AND action: PATIENT_ACCESS
logger: com.example.medical.report.MedicalReportService
```

### Dashboards (Grafana)
- **Access**: http://localhost:3000 (admin/admin)
- **Data Source**: Prometheus (http://prometheus:9090)
- **Recommended Panels**:
  - API Request Rate (rate of http_server_requests_seconds_count)
  - Error Rate (4xx/5xx responses)
  - JVM Heap Usage
  - Business Metrics (reports created, patients registered)
  - Kafka Consumer Lag

## Testing

### Backend Unit Tests
```powershell
cd backend
mvn test
```

### AI Service Tests
```bash
cd ai-service
pytest tests/
```

### Integration Tests
```powershell
# Start dependencies
docker-compose up postgres kafka

# Run integration tests
cd backend
mvn verify -P integration-tests
```

### Manual API Testing
```bash
# Register user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","role":"CLINICIAN"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Use token
TOKEN="<token-from-login-response>"
curl http://localhost:8080/patients \
  -H "Authorization: Bearer $TOKEN"
```

## Deployment

### Docker Compose Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # Use secrets
  gateway:
    environment:
      JWT_SECRET: ${JWT_SECRET}  # Use secrets
      SPRING_PROFILES_ACTIVE: prod
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
```

```powershell
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: medical-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: medical-backend
  template:
    metadata:
      labels:
        app: medical-backend
    spec:
      containers:
      - name: gateway
        image: medical-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: medical-secrets
              key: jwt-secret
        resources:
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

```bash
kubectl apply -f k8s/
```

## Next Steps

### Completed ✅
- Spring Boot backend with 6 medical domain modules
- JWT authentication with Spring Security
- Kafka event-driven architecture
- AI service with BioClinicalBERT fine-tuning
- Prometheus + Grafana monitoring
- ELK stack centralized logging
- Docker Compose full-stack deployment

### Recommended Enhancements
1. **Frontend**: Build React/Angular dashboard for clinicians
2. **Model Registry**: Deploy MLflow or BentoML for model versioning
3. **API Gateway**: Add Spring Cloud Gateway with rate limiting
4. **Caching**: Redis for session caching and query results
5. **Search**: Elasticsearch for full-text search on reports
6. **File Storage**: AWS S3 or MinIO for report PDFs/images
7. **Notifications**: Email/SMS alerts via Twilio or SendGrid
8. **FHIR Integration**: HL7 FHIR APIs for interoperability
9. **Backup/Restore**: Automated Postgres backups to S3
10. **CI/CD**: GitHub Actions pipeline with automated tests and deployments

## Support & Documentation

- **Spring Boot**: https://spring.io/projects/spring-boot
- **FastAPI**: https://fastapi.tiangolo.com
- **Hugging Face Transformers**: https://huggingface.co/docs/transformers
- **BioClinicalBERT**: https://huggingface.co/emilyalsentzer/Bio_ClinicalBERT
- **Prometheus**: https://prometheus.io/docs
- **ELK Stack**: https://www.elastic.co/guide/index.html
- **Kafka**: https://kafka.apache.org/documentation
