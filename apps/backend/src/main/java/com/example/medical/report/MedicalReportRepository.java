package com.example.medical.report;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, UUID> {
    List<MedicalReport> findByPatientId(UUID patientId);
    Page<MedicalReport> findByPatientId(UUID patientId, Pageable pageable);
    List<MedicalReport> findByDoctorId(UUID doctorId);
}
