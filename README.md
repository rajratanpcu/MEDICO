# AI-Powered Smart Medical Assistant
## Patient Records, Report Analysis & Clinical Decision Support

A production-ready medical system providing intelligent patient record management, medical report analysis, and clinical decision support powered by advanced AI/ML algorithms.

---

## 📋 Project Structure

```
project-root/
├── apps/                          # Core applications
│   ├── backend/                   # Spring Boot REST API (Java 21)
│   ├── frontend/                  # React SPA (Vite + TailwindCSS)
│   └── ai-service/                # FastAPI ML Engine (Python 3.11)
│
├── automation/                    # Workflow & Automation
│   └── n8n/                       # n8n workflow definitions
│
├── infra/                         # Infrastructure & DevOps
│   ├── docker/                    # Container configurations
│   │   └── docker-compose.yml     # Stack orchestration
│   └── scripts/                   # Build & deployment scripts
│
├── docs/                          # Documentation & guides
├── data/                          # Samples & database schemas
├── tests/                         # Automated testing
├── assets/                        # Static resources
└── .github/                       # GitHub workflows
```

---

## 🚀 Quick Start

### Prerequisites
- Java 21, Node.js 18+, Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15, Apache Kafka 7.5

### One-Command Startup
```powershell
# Windows
.\infra\scripts\start-dev.ps1

# Linux/macOS
bash infra/scripts/start-complete.sh
```

### Services Available
- **Backend API**: http://localhost:8080
- **Frontend UI**: http://localhost:3000
- **AI Service**: http://localhost:8000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

---

## 🏗️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Spring Boot | 3.3.2 |
| Database | PostgreSQL | 15 |
| Frontend | React + Vite | 18.2 + 5.0 |
| AI/ML | FastAPI + BioClinicalBERT | 0.104 |
| Messaging | Apache Kafka | 7.5.0 |
| Auth | JWT (jjwt) | 0.12.3 |
| Monitoring | Prometheus + Grafana | v2.47 + v10.1 |
| Logging | ELK Stack | 8.11.3 |

---

## 🔐 Security Configuration

Before production, update these critical settings in `apps/backend/src/main/resources/application.yml`:

```yaml
jwt:
  secret: "CHANGE_TO_512BIT_RANDOM_KEY"
  expiration-ms: 86400000

spring:
  datasource:
    username: CHANGE_ME
    password: CHANGE_ME
```

---

## 📊 Key Features

✅ Patient & Doctor Management  
✅ Medical Report Upload & Analysis  
✅ Prescription Management  
✅ Emergency Access ("Break-the-Glass")  
✅ AI-Powered Report Analysis  
✅ Symptom Checker & Triage  
✅ Clinical Chatbot  
✅ JWT Authentication & RBAC  
✅ Kafka Event-Driven Architecture  
✅ ELK Stack Monitoring  

---

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
mvn test

# AI Service tests
cd apps/ai-service
pytest

# Database tests
.\infra\scripts\test-database.ps1
```

---

## 📖 Documentation

- [Architecture Guide](docs/architecture/)
- [API Reference](docs/api/)
- [Deployment Guide](docs/deployment/)
- [Feature Documentation](docs/)

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit: `git commit -m "feat: add feature"`
3. Push and create Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**Version**: 1.0.0 | **Status**: Production Ready ✅ | **Last Updated**: February 1, 2026
