package com.example.medical.emergency;

import com.example.medical.common.EmergencyAccessStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyAccessRepository extends JpaRepository<EmergencyAccess, UUID> {
    List<EmergencyAccess> findByPatientIdAndStatus(UUID patientId, EmergencyAccessStatus status);
}
