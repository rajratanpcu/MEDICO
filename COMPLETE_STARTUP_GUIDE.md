# Complete Project Startup Guide

## Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ installed
- Java 21 installed
- Maven installed

### Start Everything

#### Option 1: Using Script (Linux/Mac)
```bash
chmod +x start-complete.sh
./start-complete.sh
```

#### Option 2: Docker Compose (Windows/Mac/Linux)
```bash
docker-compose up --build
```

#### Option 3: Manual Start
```bash
# Terminal 1: Start Docker services
docker-compose up

# Terminal 2: Start Backend
cd backend
mvn clean package -DskipTests
java -jar target/medical-backend-0.0.1-SNAPSHOT.jar

# Terminal 3: Start Frontend
cd frontend
npm install
npm start

# Terminal 4: Start AI Service (optional)
cd ai-service
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python main.py
```

---

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web UI |
| Backend API | http://localhost:8080 | REST API |
| AI Service | http://localhost:8000 | AI endpoints |
| PostgreSQL | localhost:5432 | Database |
| Kafka | localhost:9092 | Message broker |
| Prometheus | http://localhost:9090 | Metrics |
| Grafana | http://localhost:3001 | Dashboards (admin/admin) |
| Kibana | http://localhost:5601 | Log viewer |

---

## Test Credentials

### Doctor Account
```
Email: doctor@hospital.com
Password: SecurePass123!
Role: CLINICIAN
```

### Patient Account
```
Email: patient@clinic.com
Password: PatientPass123!
Role: PATIENT
```

### Admin Account
```
Email: admin@medical.org
Password: AdminPass123!
Role: ADMIN
```

---

## First Steps After Startup

### 1. Access the Application
```
http://localhost:3000
```

### 2. View Design System Showcase
```
http://localhost:3000/design-system
```

### 3. Login with Test Credentials
- Email: `doctor@hospital.com`
- Password: `SecurePass123!`

### 4. Try Key Features
- ✅ View Patient List
- ✅ Create New Patient
- ✅ Upload Medical Report
- ✅ Use Symptom Checker
- ✅ Chat with AI

### 5. Monitor Application
- **Metrics**: http://localhost:9090
- **Logs**: http://localhost:5601
- **Performance**: http://localhost:3000/metrics

---

## Project Structure

```
medical-assistant/
├── frontend/                    # React UI
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── context/            # React context
│   │   ├── services/           # API services
│   │   └── styles/             # Design system
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                     # Spring Boot API
│   ├── src/main/java/
│   │   ├── controllers/        # REST endpoints
│   │   ├── services/           # Business logic
│   │   ├── entities/           # Data models
│   │   ├── repositories/       # Database access
│   │   └── config/             # Configuration
│   ├── pom.xml
│   └── application.yml
│
├── ai-service/                  # FastAPI service
│   ├── main.py                 # Application entry
│   ├── models/                 # ML models
│   ├── routes/                 # API endpoints
│   └── requirements.txt
│
├── docker-compose.yml          # Container orchestration
├── prometheus.yml              # Metrics config
├── logstash.conf               # Log config
└── README.md                   # Documentation
```

---

## Key Features Implemented

### ✅ Complete
- User Authentication (JWT)
- Patient Management
- Design System (Tailwind CSS)
- API Integration
- Error Handling
- Form Validation
- Component Library

### 🔄 In Progress
- Report Upload & Analysis
- AI Features (Symptom Checker, Chat)
- Emergency Access
- Dashboard
- Notifications

### 📋 Coming Soon
- Advanced Analytics
- Appointment Scheduling
- Prescription Management
- Medication Reminders
- Patient Portal

---

## Development Commands

### Frontend
```bash
cd frontend

# Development
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Coverage report
npm run test:coverage

# View design system
npm start  # Navigate to http://localhost:3000/design-system
```

### Backend
```bash
cd backend

# Build
mvn clean package

# Run tests
mvn test

# Run application
java -jar target/medical-backend-0.0.1-SNAPSHOT.jar

# Run with dev profile
java -Dspring.profiles.active=dev -jar target/medical-backend-0.0.1-SNAPSHOT.jar
```

### AI Service
```bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py

# Run tests
pytest
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or change port in .env
REACT_APP_FRONTEND_PORT=3001
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up
```

### Backend Won't Start
```bash
# Check Java version (need 21+)
java --version

# Check Maven
mvn --version

# Clean build
cd backend
mvn clean package -DskipTests
```

### Frontend Won't Load
```bash
# Check Node version (need 18+)
node --version

# Install dependencies
npm install

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Testing

### Run All Tests
```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
mvn test

# AI Service
cd ai-service
pytest
```

### Run Specific Tests
```bash
# Frontend - specific file
npm test LoginPage.test.jsx

# Frontend - watch mode
npm test -- --watch

# Backend - specific class
mvn test -Dtest=PatientControllerTest

# Coverage
npm run test:coverage
```

---

## Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build
# Output: build/ directory

# Backend
cd backend
mvn clean package
# Output: target/medical-backend-0.0.1-SNAPSHOT.jar

# Docker
docker build -f Dockerfile.backend -t medical-backend:latest .
docker-compose -f docker-compose.prod.yml up
```

### Environment Configuration

#### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://api.example.com
REACT_APP_AI_BASE_URL=http://ai.example.com
REACT_APP_JWT_SECRET=your-secret-key
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/medical
    username: prod_user
    password: secure_password

jwt:
  secret: your-512-bit-secret-key
  expiration-ms: 86400000
```

---

## Monitoring & Logs

### View Metrics (Prometheus)
```
http://localhost:9090
```

### View Dashboards (Grafana)
```
http://localhost:3000
Username: admin
Password: admin
```

### View Logs (Kibana)
```
http://localhost:5601
```

### View Application Logs
```bash
# Backend
docker-compose logs -f backend

# Frontend
npm start  # Logs in terminal

# Docker services
docker-compose logs -f postgres
docker-compose logs -f kafka
```

---

## Database Management

### Access Database
```bash
# Connect to PostgreSQL
psql -h localhost -U medical_user -d medical

# Or using Docker
docker-compose exec postgres psql -U medical_user -d medical
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U medical_user medical > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U medical_user medical < backup.sql
```

### Seed Test Data
```bash
docker-compose exec postgres psql -U medical_user medical < sample-data.sql
```

---

## API Documentation

### Available Endpoints

#### Authentication
```
POST   /auth/register       - Register new user
POST   /auth/login          - Login user
POST   /auth/refresh        - Refresh JWT token
POST   /auth/logout         - Logout user
```

#### Patients
```
GET    /patients            - List all patients
GET    /patients/:id        - Get patient by ID
POST   /patients            - Create patient
PUT    /patients/:id        - Update patient
DELETE /patients/:id        - Delete patient
```

#### Reports
```
GET    /patients/:id/reports - List patient reports
POST   /patients/:id/reports - Upload report
GET    /reports/:id         - Get report details
DELETE /reports/:id         - Delete report
```

#### AI
```
POST   /ai/symptom-check    - Analyze symptoms
POST   /ai/chat             - Chat with AI
POST   /ai/analyze-report   - Analyze medical report
```

---

## Additional Resources

- **Design System**: [DESIGN_SYSTEM_DELIVERY.md](DESIGN_SYSTEM_DELIVERY.md)
- **Testing Guide**: [FRONTEND_TESTING_STRATEGY.md](frontend/FRONTEND_TESTING_STRATEGY.md)
- **API Guide**: [COMPLETE_INTEGRATION_GUIDE.md](COMPLETE_INTEGRATION_GUIDE.md)
- **Setup Guide**: [INTEGRATION_SETUP_COMPLETE.md](INTEGRATION_SETUP_COMPLETE.md)

---

## Support & Troubleshooting

### Common Issues

**Issue**: Services won't connect
**Solution**: Check all containers are running (`docker-compose ps`)

**Issue**: Out of memory
**Solution**: Increase Docker memory in settings

**Issue**: Tests failing
**Solution**: Run `npm test -- --clearCache` and reinstall

**Issue**: Port conflicts
**Solution**: Change ports in docker-compose.yml or kill existing processes

---

## Next Steps

1. ✅ Start the application
2. ✅ View design system showcase
3. ✅ Login with test credentials
4. ✅ Explore patient management
5. ✅ Test AI features
6. ✅ Run test suite
7. ✅ Review documentation
8. ✅ Customize for your needs

---

**Status**: ✅ **COMPLETE & READY TO USE**

**Created**: January 23, 2026  
**Last Updated**: January 23, 2026
