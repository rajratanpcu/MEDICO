-- Medical System Database Optimization Script
-- Run this to add performance indexes and verify schema integrity

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

-- Patients table indexes
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- Doctors table indexes
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);

-- Medical Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_doctor_id ON medical_reports(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reports_report_date ON medical_reports(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON medical_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON medical_reports(report_type);

-- Prescriptions indexes
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_start_date ON prescriptions(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_prescriptions_drug_name ON prescriptions(drug_name);

-- Emergency Access indexes
CREATE INDEX IF NOT EXISTS idx_emergency_patient_id ON emergency_access(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_access(status);
CREATE INDEX IF NOT EXISTS idx_emergency_expires_at ON emergency_access(expires_at);
CREATE INDEX IF NOT EXISTS idx_emergency_approver ON emergency_access(approved_by_doctor_id);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- AI Request Logs indexes
CREATE INDEX IF NOT EXISTS idx_ai_logs_request_type ON ai_request_logs(request_type);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_request_logs(created_at DESC);

-- ============================================
-- VERIFY SCHEMA INTEGRITY
-- ============================================

-- Count tables
SELECT 'Total Tables' as metric, COUNT(*) as value
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

-- Count foreign keys
SELECT 'Foreign Keys' as metric, COUNT(*) as value
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY'

UNION ALL

-- Count indexes
SELECT 'Indexes' as metric, COUNT(*) as value
FROM pg_indexes
WHERE schemaname = 'public'

UNION ALL

-- Count check constraints
SELECT 'Check Constraints' as metric, COUNT(*) as value
FROM information_schema.table_constraints
WHERE table_schema = 'public' AND constraint_type = 'CHECK';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data

/*
-- Insert sample patient
INSERT INTO patients (id, first_name, last_name, dob, gender, email, phone, status, created_at, updated_at)
VALUES (gen_random_uuid(), 'John', 'Doe', '1985-05-15', 'MALE', 'john.doe@example.com', '+1234567890', 'ACTIVE', NOW(), NOW());

-- Insert sample doctor
INSERT INTO doctors (id, first_name, last_name, email, phone, specialty, status, created_at, updated_at)
VALUES (gen_random_uuid(), 'Sarah', 'Smith', 'dr.smith@hospital.com', '+1987654321', 'Cardiology', 'ACTIVE', NOW(), NOW());
*/

-- ============================================
-- DATABASE STATISTICS
-- ============================================

-- Show table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
