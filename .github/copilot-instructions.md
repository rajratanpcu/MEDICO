# AI-Powered Smart Medical Assistant - Development Guide

## Project Overview
Production-ready medical system with Spring Boot backend, FastAPI AI service, JWT authentication, Kafka messaging, and comprehensive observability.

## Technology Stack
- **Backend**: Spring Boot 3.3.2, Java 21, Spring Security, Spring Kafka, JPA/Hibernate
- **AI Service**: FastAPI 0.104, Python 3.11, transformers, BioClinicalBERT
- **Database**: PostgreSQL 15 with UUID primary keys
- **Messaging**: Apache Kafka 7.5.0 with Zookeeper
- **Monitoring**: Prometheus, Grafana, ELK Stack (Elasticsearch, Logstash, Kibana)
- **Security**: JWT (jjwt 0.12.3), BCrypt password hashing
- **Containerization**: Docker, Docker Compose

## Architecture Patterns
- **Layered Architecture**: Controller → Service → Repository → Entity
- **JWT Stateless Authentication**: Bearer tokens with HS512 signature
- **Event-Driven**: Kafka events for async workflows (document-uploaded topic)
- **Repository Pattern**: Spring Data JPA abstractions
- **DTO Pattern**: Separate API contracts from domain models
- **Global Exception Handling**: `@RestControllerAdvice` with ApiError
- **Audit Logging**: Structured logs for compliance

## Key Modules
1. **patient**: Patient CRUD with status tracking
2. **doctor**: Doctor management with specialty and status
3. **report**: Medical reports with Kafka event publishing on creation
4. **prescription**: Prescription management with dosage tracking
5. **emergency**: Emergency access request/approval workflow
6. **auth**: User registration, login, JWT token generation
7. **security**: JWT provider, authentication filter, SecurityConfig
8. **messaging**: Kafka producer, consumer, event models
9. **observability**: Prometheus metrics, audit logging
10. **ai**: AI service REST client (OCR, symptom prediction, chat)

## Development Guidelines

### Code Style
- Use UUID for primary keys (distributed-friendly)
- Add audit timestamps (createdAt, updatedAt) via @PrePersist/@PreUpdate
- Validate all DTOs with @Valid + JSR-380 annotations
- Use @Transactional on service methods that modify data
- Log audit events for compliance (USER_LOGIN, PATIENT_ACCESS, etc.)
- Publish Kafka events for async workflows

### Security Best Practices
- Never commit JWT secrets or database passwords
- Use BCrypt with strength 10 for password hashing
- Validate JWT signature and expiration on every request
- Set CORS allowed origins explicitly (no wildcard in prod)
- Audit all patient data access
- Use HTTPS in production

### Testing
- Unit tests with JUnit5 + Mockito for backend
- pytest for AI service
- Integration tests with Testcontainers for DB and Kafka
- Manual API testing with curl or Postman

## Building & Running

### Local Development
```powershell
# Build backend
.\build-backend.ps1

# Or manually
cd backend
mvn clean package -DskipTests
java -jar target/medical-backend-0.0.1-SNAPSHOT.jar
```

### Docker Compose
```powershell
# Start all services
.\start-dev.ps1

# Or manually
docker-compose up --build
```

### Services
- Backend API: http://localhost:8080
- AI Service: http://localhost:8000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)
- Kibana: http://localhost:5601

## Configuration

### JWT Secret
**CRITICAL**: Change JWT secret in `application.yml` before production:
```yaml
jwt:
  secret: "generate-512-bit-random-key-here"
  expiration-ms: 86400000  # 24 hours
```

### Database
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medical
    username: medical_user
    password: change_in_production
```

### Kafka
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: medical-group
```

## API Examples

### Authentication
```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"SecurePass123!","role":"CLINICIAN"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hospital.com","password":"SecurePass123!"}'

# Use token
curl http://localhost:8080/patients \
  -H "Authorization: Bearer <token>"
```

## Monitoring

### Prometheus Metrics
- Access: http://localhost:9090
- Scrapes: Spring Boot Actuator at /actuator/prometheus
- Custom metrics: medical_reports_created_total, medical_patients_created_total, medical_auth_login_total

### ELK Logging
- Kibana: http://localhost:5601
- Index pattern: medical-logs-*
- Query audit logs: `log_type: audit AND action: PATIENT_ACCESS`

### Grafana Dashboards
- Access: http://localhost:3000 (admin/admin)
- Data source: Prometheus (http://prometheus:9090)
- Panels: API request rate, error rate, JVM heap, business metrics

## Troubleshooting

### Build Errors
- Verify Java 21 installed: `java --version`
- Verify Maven installed: `mvn --version`
- Clean build: `mvn clean package -DskipTests`

### Docker Issues
- Check Docker running: `docker info`
- Check ports available: 5432, 2181, 9092, 8080, 8000, 9090, 3000, 9200, 5601
- View logs: `docker-compose logs -f <service-name>`
- Restart services: `docker-compose restart`

### Kafka Connection Issues
- Verify Zookeeper running: `docker-compose ps zookeeper`
- Verify Kafka running: `docker-compose ps kafka`
- Check broker config: kafka://localhost:9092 (host) or kafka:29092 (container)

## Common Tasks

### Add New Entity
1. Create entity in appropriate package (extends BaseEntity)
2. Add repository interface (extends JpaRepository)
3. Create service with @Transactional methods
4. Add controller with @RestController
5. Create request/response DTOs with validation
6. Add unit tests for service layer

### Add Kafka Event
1. Create event POJO in messaging package
2. Add producer method in KafkaProducerService
3. Add consumer method in KafkaConsumerService with @KafkaListener
4. Publish event in service method after state change
5. Add metrics counter for event tracking

### Add Custom Metric
```java
// In MetricsService
private Counter customMetric;

@PostConstruct
public void init() {
    customMetric = Counter.builder("medical.custom.metric")
        .description("Description")
        .register(meterRegistry);
}

public void incrementCustomMetric() {
    customMetric.increment();
}
```

### Add Audit Log
```java
// In service method
auditLogger.logPatientAccess(userId, patientId, "READ");
```

## Next Steps
- Add frontend (React/Angular) for clinicians
- Implement Redis caching for sessions
- Add S3/MinIO for report file storage
- Build FHIR APIs for interoperability
- Set up CI/CD pipeline with GitHub Actions
- Configure automated backups
- Add unit/integration tests
- Deploy to Kubernetes

## References
- README.md: Full documentation
- application.yml: Configuration examples
- docker-compose.yml: Service orchestration
- prometheus.yml: Metrics scraping
- logstash.conf: Log parsing pipeline

Before starting a new task in the above plan, update progress in the plan.
-->
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.
