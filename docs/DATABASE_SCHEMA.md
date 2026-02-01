# Medical System Database Schema Design
**Database**: PostgreSQL 15+  
**Design Pattern**: Normalized Relational Model (3NF)  
**Key Strategy**: UUID Primary Keys (Distributed-Friendly)

---

## 📊 Entity Relationship Diagram Description

```
┌─────────────┐           ┌──────────────┐           ┌─────────────┐
│   USERS     │           │   DOCTORS    │           │  PATIENTS   │
│             │           │              │           │             │
│ PK: id(UUID)│           │ PK: id(UUID) │           │ PK: id(UUID)│
│ • email     │           │ • first_name │           │ • first_name│
│ • password  │           │ • last_name  │           │ • last_name │
│ • role      │           │ • email      │           │ • dob       │
│ • status    │           │ • phone      │           │ • gender    │
└─────────────┘           │ • specialty  │           │ • email     │
                          │ • status     │           │ • phone     │
                          └──────┬───────┘           │ • status    │
                                 │                   └──────┬──────┘
                                 │                          │
                     ┌───────────┴───────────┬──────────────┴──────┐
                     │                       │                     │
              ┌──────▼────────┐      ┌──────▼────────┐    ┌──────▼─────────┐
              │MEDICAL_REPORTS│      │ PRESCRIPTIONS │    │EMERGENCY_ACCESS│
              │               │      │               │    │                │
              │ PK: id(UUID)  │      │ PK: id(UUID)  │    │ PK: id(UUID)   │
              │ FK: patient_id│      │ FK: patient_id│    │ FK: patient_id │
              │ FK: doctor_id │      │ FK: doctor_id │    │ • requester    │
              │ • title       │      │ • drug_name   │    │ • reason       │
              │ • report_type │      │ • dosage      │    │ FK: approved_by│
              │ • storage_url │      │ • frequency   │    │ • expires_at   │
              │ • summary     │      │ • route       │    │ • status       │
              │ • status      │      │ • start_date  │    │ • notes        │
              │ • report_date │      │ • end_date    │    └────────────────┘
              └───────────────┘      │ • status      │
                                     └───────────────┘
                                             
              ┌──────────────┐
              │AI_REQUEST_LOG│
              │              │
              │ PK: id(UUID) │
              │ • request_typ│
              │ • input_data │
              │ • response   │
              │ • latency_ms │
              └──────────────┘
```

---

## 📋 Table Definitions

### 1. **PATIENTS** (Core Medical Records)
Primary entity for patient demographics and contact information.

```sql
CREATE TABLE patients (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Demographics
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    dob                 DATE NOT NULL,
    gender              VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    
    -- Contact Information
    email               VARCHAR(255),
    phone               VARCHAR(20),
    
    -- Status Management
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' 
                        CHECK (status IN ('ACTIVE', 'INACTIVE', 'DECEASED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT patient_email_unique UNIQUE (email)
);

CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_created_at ON patients(created_at);
```

**Relationships**: 
- One-to-Many with `medical_reports`
- One-to-Many with `prescriptions`
- One-to-Many with `emergency_access`

---

### 2. **DOCTORS** (Healthcare Providers)
Medical professionals authorized to create reports and prescriptions.

```sql
CREATE TABLE doctors (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Personal Information
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20),
    
    -- Professional Details
    specialty           VARCHAR(100),  -- e.g., Cardiology, Neurology
    
    -- Status Management
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'RETIRED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_status ON doctors(status);
```

**Relationships**:
- One-to-Many with `medical_reports`
- One-to-Many with `prescriptions`
- One-to-Many with `emergency_access` (as approver)

---

### 3. **MEDICAL_REPORTS** (Clinical Documents)
Lab results, imaging reports, pathology reports, etc.

```sql
CREATE TABLE medical_reports (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys (Many-to-One)
    patient_id          UUID NOT NULL,
    doctor_id           UUID NOT NULL,
    
    -- Report Metadata
    title               VARCHAR(255) NOT NULL,
    report_type         VARCHAR(50) NOT NULL,  -- LAB, IMAGING, PATHOLOGY, CONSULTATION
    storage_url         VARCHAR(500) NOT NULL,  -- S3/File storage path
    summary             TEXT,  -- AI-generated or manual summary
    
    -- Clinical Details
    report_date         DATE NOT NULL,
    
    -- Processing Status
    status              VARCHAR(20) NOT NULL DEFAULT 'PROCESSING'
                        CHECK (status IN ('PROCESSING', 'COMPLETED', 'REVIEWED', 'ARCHIVED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign Key Constraints
    CONSTRAINT fk_report_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_doctor FOREIGN KEY (doctor_id) 
        REFERENCES doctors(id) ON DELETE RESTRICT
);

CREATE INDEX idx_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX idx_reports_doctor_id ON medical_reports(doctor_id);
CREATE INDEX idx_reports_report_date ON medical_reports(report_date DESC);
CREATE INDEX idx_reports_status ON medical_reports(status);
CREATE INDEX idx_reports_report_type ON medical_reports(report_type);
```

**Relationships**:
- Many-to-One with `patients` (patient_id)
- Many-to-One with `doctors` (doctor_id)

**Business Rules**:
- Cascade delete when patient deleted (GDPR compliance)
- Restrict delete when doctor deleted (audit trail preservation)

---

### 4. **PRESCRIPTIONS** (Medication Orders)
Electronic prescriptions with dosage and schedule.

```sql
CREATE TABLE prescriptions (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys (Many-to-One)
    patient_id          UUID NOT NULL,
    doctor_id           UUID NOT NULL,
    
    -- Medication Details
    drug_name           VARCHAR(255) NOT NULL,
    dosage              VARCHAR(100) NOT NULL,  -- e.g., "500mg"
    frequency           VARCHAR(100) NOT NULL,  -- e.g., "Twice daily"
    route               VARCHAR(50),            -- e.g., "Oral", "IV"
    
    -- Treatment Period
    start_date          DATE NOT NULL,
    end_date            DATE,
    
    -- Status Management
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign Key Constraints
    CONSTRAINT fk_prescription_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctor_id) 
        REFERENCES doctors(id) ON DELETE RESTRICT,
    
    -- Business Rules
    CONSTRAINT chk_prescription_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_start_date ON prescriptions(start_date DESC);
CREATE INDEX idx_prescriptions_drug_name ON prescriptions(drug_name);
```

**Relationships**:
- Many-to-One with `patients` (patient_id)
- Many-to-One with `doctors` (doctor_id)

**Business Rules**:
- End date must be >= start date
- Active prescriptions should have NULL or future end_date

---

### 5. **EMERGENCY_ACCESS** (Break-Glass Access)
Tracks emergency access requests to patient records with approval workflow.

```sql
CREATE TABLE emergency_access (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    patient_id          UUID NOT NULL,
    approved_by_doctor_id UUID,  -- NULL if pending
    
    -- Access Request Details
    requester_name      VARCHAR(255) NOT NULL,  -- Name of emergency staff
    reason              TEXT NOT NULL,          -- Justification for access
    notes               TEXT,                   -- Additional context
    
    -- Access Control
    expires_at          TIMESTAMP WITH TIME ZONE NOT NULL,  -- Time-limited access
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'APPROVED', 'DENIED', 'EXPIRED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Foreign Key Constraints
    CONSTRAINT fk_emergency_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_emergency_approver FOREIGN KEY (approved_by_doctor_id) 
        REFERENCES doctors(id) ON DELETE SET NULL
);

CREATE INDEX idx_emergency_patient_id ON emergency_access(patient_id);
CREATE INDEX idx_emergency_status ON emergency_access(status);
CREATE INDEX idx_emergency_expires_at ON emergency_access(expires_at);
CREATE INDEX idx_emergency_approver ON emergency_access(approved_by_doctor_id);
```

**Relationships**:
- Many-to-One with `patients` (patient_id)
- Many-to-One with `doctors` (approved_by_doctor_id) - Optional

**Business Rules**:
- Access automatically expires after `expires_at` timestamp
- Requires approval from authorized doctor
- Audit logging for compliance

---

### 6. **USERS** (Authentication & Authorization)
System users with role-based access control.

```sql
CREATE TABLE users (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,  -- BCrypt hashed
    
    -- Authorization
    role                VARCHAR(20) NOT NULL DEFAULT 'CLINICIAN'
                        CHECK (role IN ('ADMIN', 'CLINICIAN', 'NURSE', 'RECEPTIONIST')),
    
    -- Status Management
    status              VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
                        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'LOCKED')),
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Security Notes**:
- Passwords stored as BCrypt hashes (strength 10)
- JWT tokens for stateless authentication
- Role-based access control (RBAC)

---

### 7. **AI_REQUEST_LOGS** (Observability)
Tracks AI service requests for monitoring and audit.

```sql
CREATE TABLE ai_request_logs (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Request Details
    request_type        VARCHAR(50) NOT NULL,  -- OCR, SYMPTOM_PREDICTION, CHAT
    input_data          TEXT,                  -- Serialized input
    response_data       TEXT,                  -- Serialized output
    
    -- Performance Metrics
    latency_ms          INTEGER,               -- Response time
    
    -- Audit Timestamps
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_request_type ON ai_request_logs(request_type);
CREATE INDEX idx_ai_logs_created_at ON ai_request_logs(created_at DESC);
CREATE INDEX idx_ai_logs_latency ON ai_request_logs(latency_ms);
```

**Use Cases**:
- Performance monitoring
- Cost tracking (AI API calls)
- Debugging and troubleshooting

---

## 🔑 Key Relationships Summary

| Relationship | Type | From Table | To Table | Foreign Key | Delete Rule |
|--------------|------|------------|----------|-------------|-------------|
| Patient → Reports | 1:N | patients | medical_reports | patient_id | CASCADE |
| Doctor → Reports | 1:N | doctors | medical_reports | doctor_id | RESTRICT |
| Patient → Prescriptions | 1:N | patients | prescriptions | patient_id | CASCADE |
| Doctor → Prescriptions | 1:N | doctors | prescriptions | doctor_id | RESTRICT |
| Patient → Emergency Access | 1:N | patients | emergency_access | patient_id | CASCADE |
| Doctor → Emergency Approvals | 1:N | doctors | emergency_access | approved_by_doctor_id | SET NULL |

---

## 📏 Normalization & Best Practices

### ✅ Third Normal Form (3NF) Compliance
1. **First Normal Form (1NF)**: All columns contain atomic values (no arrays)
2. **Second Normal Form (2NF)**: No partial dependencies on composite keys
3. **Third Normal Form (3NF)**: No transitive dependencies

### ✅ Medical Data Best Practices

**HIPAA Compliance Considerations**:
- Audit timestamps on all tables (created_at, updated_at)
- Soft delete capability via status fields
- Emergency access tracking with justification
- Encryption at rest (PostgreSQL TDE)
- Encryption in transit (SSL/TLS connections)

**Data Integrity**:
- Foreign key constraints enforce referential integrity
- CHECK constraints validate enum values
- NOT NULL constraints prevent missing critical data
- UNIQUE constraints prevent duplicate records

**Performance Optimization**:
- B-tree indexes on foreign keys
- Composite indexes on common query patterns
- Descending indexes on date fields (recent-first queries)
- UUID primary keys for distributed scalability

**Scalability**:
- UUID primary keys enable distributed ID generation
- No auto-incrementing integers (avoid single point of failure)
- Timestamp with time zone for global deployments
- Partitioning strategy ready (by created_at date)

---

## 🔒 Security & Compliance

### Row-Level Security (RLS) Example
```sql
-- Enable RLS on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Policy: Doctors can only see patients they've treated
CREATE POLICY doctor_patient_access ON patients
    FOR SELECT
    TO doctor_role
    USING (
        id IN (
            SELECT patient_id FROM medical_reports WHERE doctor_id = current_user_id()
        )
    );
```

### Audit Logging Trigger
```sql
CREATE TABLE audit_log (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name          VARCHAR(50) NOT NULL,
    record_id           UUID NOT NULL,
    action              VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    user_id             UUID,
    changed_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    old_values          JSONB,
    new_values          JSONB
);

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        row_to_json(OLD),
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to sensitive tables
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

---

## 📊 Sample Queries

### Get Patient's Complete Medical History
```sql
SELECT 
    p.id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.dob,
    json_agg(DISTINCT jsonb_build_object(
        'report_id', mr.id,
        'title', mr.title,
        'type', mr.report_type,
        'date', mr.report_date,
        'doctor', d1.first_name || ' ' || d1.last_name
    )) AS reports,
    json_agg(DISTINCT jsonb_build_object(
        'prescription_id', pr.id,
        'drug', pr.drug_name,
        'dosage', pr.dosage,
        'doctor', d2.first_name || ' ' || d2.last_name
    )) AS prescriptions
FROM patients p
LEFT JOIN medical_reports mr ON p.id = mr.patient_id
LEFT JOIN doctors d1 ON mr.doctor_id = d1.id
LEFT JOIN prescriptions pr ON p.id = pr.patient_id
LEFT JOIN doctors d2 ON pr.doctor_id = d2.id
WHERE p.id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY p.id;
```

### Active Prescriptions Expiring Soon
```sql
SELECT 
    pr.id,
    p.first_name || ' ' || p.last_name AS patient_name,
    pr.drug_name,
    pr.end_date,
    d.first_name || ' ' || d.last_name AS prescribing_doctor
FROM prescriptions pr
JOIN patients p ON pr.patient_id = p.id
JOIN doctors d ON pr.doctor_id = d.id
WHERE pr.status = 'ACTIVE'
  AND pr.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY pr.end_date ASC;
```

### Emergency Access Audit Report
```sql
SELECT 
    ea.id,
    p.first_name || ' ' || p.last_name AS patient_name,
    ea.requester_name,
    ea.reason,
    ea.status,
    CASE 
        WHEN ea.approved_by_doctor_id IS NOT NULL 
        THEN d.first_name || ' ' || d.last_name 
        ELSE 'Pending'
    END AS approved_by,
    ea.created_at,
    ea.expires_at
FROM emergency_access ea
JOIN patients p ON ea.patient_id = p.id
LEFT JOIN doctors d ON ea.approved_by_doctor_id = d.id
WHERE ea.created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY ea.created_at DESC;
```

---

## 🚀 Database Initialization Script

```sql
-- Run as superuser
CREATE DATABASE medical WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8';

-- Connect to database
\c medical

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in dependency order
-- (Execute all CREATE TABLE statements above in order)

-- Create admin user
INSERT INTO users (email, password_hash, role, status)
VALUES ('admin@hospital.com', '$2a$10$...bcrypt_hash...', 'ADMIN', 'ACTIVE');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO medical_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO medical_app;
```

---

## 📈 Performance Considerations

**Query Optimization**:
- Use prepared statements to prevent SQL injection
- Implement connection pooling (HikariCP configured)
- Enable query result caching for static data
- Monitor slow queries with pg_stat_statements

**Partitioning Strategy** (Future):
```sql
-- Partition medical_reports by year
CREATE TABLE medical_reports_2026 PARTITION OF medical_reports
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

**Backup Strategy**:
- Daily full backups to S3
- Point-in-time recovery (PITR) with WAL archiving
- Automated backup verification
- 30-day retention policy

---

## 📚 References
- PostgreSQL 15 Documentation: https://www.postgresql.org/docs/15/
- HIPAA Technical Safeguards: https://www.hhs.gov/hipaa/
- Database Normalization: https://en.wikipedia.org/wiki/Database_normalization
- UUID Best Practices: https://www.postgresql.org/docs/current/datatype-uuid.html

---

**Last Updated**: January 22, 2026  
**Schema Version**: 1.0.0  
**Author**: AI Database Architect
