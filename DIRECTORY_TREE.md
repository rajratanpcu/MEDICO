# Project Directory Tree - Visual Reference

```
AI-Powered Smart Medical Assistant for Patient Records, Report Analysis & Clinical/
│
├── 📱 apps/                              ← ALL APPLICATIONS
│   ├── backend/                          ← Java Spring Boot REST API
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/example/medical/
│   │   │   │   │   ├── auth/            (JWT, Security)
│   │   │   │   │   ├── patient/         (Patient CRUD)
│   │   │   │   │   ├── doctor/          (Doctor management)
│   │   │   │   │   ├── report/          (Medical reports)
│   │   │   │   │   ├── prescription/    (Prescriptions)
│   │   │   │   │   ├── emergency/       (Emergency access)
│   │   │   │   │   ├── messaging/       (Kafka events)
│   │   │   │   │   ├── observability/   (Metrics, audit)
│   │   │   │   │   └── security/        (Security config)
│   │   │   │   └── resources/
│   │   │   │       └── application.yml
│   │   │   └── test/
│   │   ├── target/                       (Build artifacts)
│   │   ├── pom.xml                       (Maven config)
│   │   └── build.log
│   │
│   ├── frontend/                         ← React SPA (Vite)
│   │   ├── src/
│   │   │   ├── components/               (Reusable UI)
│   │   │   ├── pages/                    (Page views)
│   │   │   ├── hooks/                    (React hooks)
│   │   │   ├── services/                 (API clients)
│   │   │   ├── utils/                    (Helpers)
│   │   │   ├── styles/                   (TailwindCSS)
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── public/                       (Static assets)
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   └── postcss.config.cjs
│   │
│   └── ai-service/                       ← FastAPI Python Service
│       ├── app/
│       │   ├── main.py                   (FastAPI app)
│       │   ├── models.py                 (Pydantic schemas)
│       │   ├── routes/                   (Endpoints)
│       │   ├── services/                 (Business logic)
│       │   └── utils/                    (Helpers)
│       ├── requirements.txt              (Dependencies)
│       ├── Dockerfile
│       └── test_predictor.py
│
├── ⚙️ infra/                             ← INFRASTRUCTURE & DEVOPS
│   ├── docker/                           ← Container Configuration
│   │   ├── docker-compose.yml            (Service orchestration)
│   │   ├── Dockerfile.backend            (Backend image)
│   │   ├── prometheus.yml                (Metrics config)
│   │   └── logstash.conf                 (Log pipeline)
│   │
│   └── scripts/                          ← Build & Deployment
│       ├── build-backend.ps1             (Maven build)
│       ├── rebuild-gateway.ps1           (Docker rebuild)
│       ├── start-dev.ps1                 (Dev startup)
│       ├── start-complete.sh             (Full startup)
│       ├── test-database.ps1             (DB tests)
│       ├── test_ml_system.bat            (AI tests)
│       └── test_ml_system.sh
│
├── 📚 docs/                              ← DOCUMENTATION
│   ├── architecture/                     (System design)
│   │   ├── SYSTEM_DESIGN.md
│   │   ├── API_ARCHITECTURE.md
│   │   └── DATABASE_SCHEMA.md
│   │
│   ├── api/                              (Endpoint docs)
│   │   ├── AUTHENTICATION.md
│   │   ├── PATIENTS_API.md
│   │   ├── REPORTS_API.md
│   │   └── AI_SERVICES.md
│   │
│   ├── deployment/                       (Production guides)
│   │   ├── DOCKER_SETUP.md
│   │   ├── KUBERNETES.md
│   │   └── PRODUCTION.md
│   │
│   └── [45+ feature & guide documents]
│
├── 💾 data/                              ← DATA & SAMPLES
│   ├── samples/                          (Example requests)
│   │   ├── login.json
│   │   └── register.json
│   │
│   └── schemas/                          (Database setup)
│       ├── database-setup.sql
│       └── sample-data.sql
│
├── 🤖 automation/                        ← WORKFLOW AUTOMATION
│   └── n8n/
│       └── n8n_workflows.json            (Workflow definitions)
│
├── 🧪 tests/                             ← AUTOMATED TESTS
│   ├── unit/                             (Component tests)
│   │   ├── backend/
│   │   └── frontend/
│   │
│   └── integration/                      (Integration tests)
│       ├── api/
│       └── database/
│
├── 🎨 assets/                            ← STATIC RESOURCES
│   ├── images/
│   ├── styles/
│   └── icons/
│
├── 📦 .github/                           ← GITHUB CONFIG
│   ├── workflows/                        (CI/CD pipelines)
│   └── copilot-instructions.md           (Dev guidelines)
│
├── 📄 root-level documentation
│   ├── README.md                         ⭐ START HERE
│   ├── STRUCTURE.md                      (Directory guide)
│   ├── REFACTORING_MANIFEST.md           (Change log)
│   ├── REFACTORING_COMPLETE.md           (Completion summary)
│   ├── LICENSE                           (MIT)
│   └── NOTICE
│
└── 🔙 smart-medical-assistant/           (Legacy - Archival)
    ├── Main.java
    ├── medico.iml
    └── docs/
```

---

## Directory Size & Contents

| Directory | Purpose | Size | Files |
|-----------|---------|------|-------|
| `apps/backend/` | Java Spring Boot API | ~150 MB | 500+ |
| `apps/frontend/` | React SPA | ~200 MB | 1000+ |
| `apps/ai-service/` | FastAPI Python | ~500 MB | 100+ |
| `infra/docker/` | Container configs | <1 MB | 4 |
| `infra/scripts/` | Build scripts | <1 MB | 7 |
| `docs/` | Documentation | <5 MB | 45+ |
| `data/` | Samples & schemas | <1 MB | 4 |
| `automation/` | Workflows | <1 MB | 1 |
| `tests/` | Test suites | - | - |
| `assets/` | Static resources | <10 MB | 50+ |

---

## Key Services in docker-compose.yml

```
postgres            Port 5432   Database
kafka               Port 9092   Message Queue
zookeeper           Port 2181   Kafka Coordination
frontend            Port 3000   React UI
gateway             Port 8080   Spring Boot API
ai-service          Port 8000   FastAPI Service
prometheus          Port 9090   Metrics (optional)
grafana             Port 3001   Dashboards (optional)
elasticsearch       Port 9200   Logs (optional)
logstash            -           Log Pipeline (optional)
kibana              Port 5601   Log Viewer (optional)
n8n                 Port 5678   Workflows (optional)
```

---

## Quick Navigation Guide

### For Developers
```bash
# Start coding
cd apps/backend        # Backend development
cd apps/frontend       # Frontend development
cd apps/ai-service     # AI development

# Run services
cd infra/docker
docker-compose up --build
```

### For DevOps Engineers
```bash
# Infrastructure
cd infra/docker        # All Docker configs
cd infra/scripts       # Build & test scripts

# Monitor
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
# Kibana: http://localhost:5601
```

### For Documentation
```bash
# Main entry points
cat README.md              # Quick start
cat STRUCTURE.md           # This structure
cat REFACTORING_MANIFEST.md # What changed
cat docs/                  # Detailed guides
```

---

## File Organization Principles

### ✅ Best Practices Implemented

1. **Clear Separation**
   - Applications in `apps/`
   - Infrastructure in `infra/`
   - Documentation in `docs/`
   - Data separate from code

2. **Easy Discovery**
   - Scripts grouped in `infra/scripts/`
   - Docker configs in `infra/docker/`
   - Related files together

3. **Scalable**
   - Easy to add `apps/new-service/`
   - Easy to add `docs/new-guide/`
   - Pattern-based organization

4. **Enterprise-Standard**
   - Matches industry conventions
   - Familiar to new team members
   - Supports CI/CD automation

5. **Documentation-Friendly**
   - README.md at project root
   - STRUCTURE.md for detailed guide
   - Docs organized by category

---

## Integration Points

### Frontend ↔ Backend
- API calls to `http://localhost:8080`
- Configured in `apps/frontend/.env`

### Backend ↔ AI Service
- REST calls to `http://localhost:8000`
- Configured in `apps/backend/application.yml`

### All Services ↔ Database
- PostgreSQL at `localhost:5432`
- Migrations in `data/schemas/`

### All Services ↔ Message Queue
- Kafka at `localhost:9092`
- Configured in each service

### All Services ↔ Monitoring
- Prometheus scrapes metrics
- Logstash collects logs
- Grafana visualizes dashboards

---

## Ready for Production

This structure supports:
- ✅ Microservices architecture
- ✅ Container orchestration
- ✅ CI/CD pipelines
- ✅ Kubernetes deployment
- ✅ Multi-environment configs
- ✅ Team scalability
- ✅ Enterprise monitoring

---

## Next Steps

1. **Review Structure**: Understand how files are organized
2. **Update Documentation**: Add team-specific guides
3. **Configure CI/CD**: Use `.github/workflows/`
4. **Deploy to Production**: Use `infra/` configs
5. **Monitor System**: Access Prometheus/Grafana
6. **Scale Services**: Add new apps under `apps/`

---

**This structure is ready for viva presentation and recruiter portfolios! ✨**

*Last Updated: February 1, 2026*
