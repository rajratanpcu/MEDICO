-- Insert Sample Medical Data for Testing

-- Sample Doctors
INSERT INTO doctors (id, first_name, last_name, email, phone, specialty, status, created_at, updated_at)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Smith', 'dr.smith@hospital.com', '+1-555-0101', 'Cardiology', 'ACTIVE', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Michael', 'Johnson', 'dr.johnson@hospital.com', '+1-555-0102', 'Neurology', 'ACTIVE', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Emily', 'Davis', 'dr.davis@hospital.com', '+1-555-0103', 'Pediatrics', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Patients
INSERT INTO patients (id, first_name, last_name, dob, gender, email, phone, status, created_at, updated_at)
VALUES 
    ('650e8400-e29b-41d4-a716-446655440001', 'John', 'Doe', '1985-05-15', 'MALE', 'john.doe@email.com', '+1-555-1001', 'ACTIVE', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440002', 'Jane', 'Wilson', '1990-08-22', 'FEMALE', 'jane.wilson@email.com', '+1-555-1002', 'ACTIVE', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440003', 'Robert', 'Brown', '1978-12-10', 'MALE', 'robert.brown@email.com', '+1-555-1003', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Medical Reports
INSERT INTO medical_reports (id, patient_id, doctor_id, title, report_type, storage_url, summary, status, report_date, created_at, updated_at)
VALUES 
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
     'Cardiac Stress Test Results', 'IMAGING', '/reports/cardiac-stress-2026-01-15.pdf', 
     'Normal cardiac function observed during stress test.', 'READY', '2026-01-15', NOW(), NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 
     'Annual Physical Examination', 'CONSULTATION', '/reports/physical-2026-01-20.pdf', 
     'Patient in good overall health. Recommended follow-up in 6 months.', 'READY', '2026-01-20', NOW(), NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 
     'MRI Brain Scan', 'IMAGING', '/reports/mri-brain-2026-01-18.pdf', 
     'No abnormalities detected in brain MRI scan.', 'READY', '2026-01-18', NOW(), NOW());

-- Sample Prescriptions
INSERT INTO prescriptions (id, patient_id, doctor_id, drug_name, dosage, frequency, route, start_date, end_date, status, created_at, updated_at)
VALUES 
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 
     'Lisinopril', '10mg', 'Once daily', 'Oral', '2026-01-15', '2026-07-15', 'ACTIVE', NOW(), NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 
     'Amoxicillin', '500mg', 'Three times daily', 'Oral', '2026-01-20', '2026-01-30', 'ACTIVE', NOW(), NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 
     'Ibuprofen', '200mg', 'As needed (max 4 times daily)', 'Oral', '2026-01-18', NULL, 'ACTIVE', NOW(), NOW());

-- Verify data insertion
SELECT 'Doctors' as entity, COUNT(*) as count FROM doctors
UNION ALL
SELECT 'Patients' as entity, COUNT(*) as count FROM patients
UNION ALL
SELECT 'Medical Reports' as entity, COUNT(*) as count FROM medical_reports
UNION ALL
SELECT 'Prescriptions' as entity, COUNT(*) as count FROM prescriptions;

-- Show sample data
SELECT 'Sample Patient Data' as info;
SELECT id, first_name, last_name, email FROM patients LIMIT 3;

SELECT 'Sample Doctor Data' as info;
SELECT id, first_name, last_name, specialty FROM doctors LIMIT 3;
