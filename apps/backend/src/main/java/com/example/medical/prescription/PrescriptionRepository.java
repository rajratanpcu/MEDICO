package com.example.medical.prescription;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    List<Prescription> findByPatientId(UUID patientId);
}
