package com.example.medical.emergency;

import com.example.medical.common.EmergencyAccessStatus;
import com.example.medical.doctor.Doctor;
import com.example.medical.doctor.DoctorRepository;
import com.example.medical.exception.NotFoundException;
import com.example.medical.patient.Patient;
import com.example.medical.patient.PatientRepository;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class EmergencyAccessService {

    private final EmergencyAccessRepository repository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public EmergencyAccessService(EmergencyAccessRepository repository,
                                  PatientRepository patientRepository,
                                  DoctorRepository doctorRepository) {
        this.repository = repository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public EmergencyAccess request(UUID patientId, EmergencyAccess payload) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new NotFoundException("Patient not found"));
        payload.setPatient(patient);
        payload.setStatus(EmergencyAccessStatus.PENDING);
        if (payload.getExpiresAt() == null) {
            payload.setExpiresAt(OffsetDateTime.now().plusHours(4));
        }
        return repository.save(payload);
    }

    public EmergencyAccess approve(UUID requestId, UUID doctorId) {
        EmergencyAccess access = get(requestId);
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
        access.setApprovedBy(doctor);
        access.setStatus(EmergencyAccessStatus.APPROVED);
        return access;
    }

    public EmergencyAccess deny(UUID requestId) {
        EmergencyAccess access = get(requestId);
        access.setStatus(EmergencyAccessStatus.DENIED);
        return access;
    }

    public List<EmergencyAccess> activeForPatient(UUID patientId) {
        return repository.findByPatientIdAndStatus(patientId, EmergencyAccessStatus.APPROVED)
            .stream()
            .filter(a -> a.getExpiresAt().isAfter(OffsetDateTime.now()))
            .toList();
    }

    public EmergencyAccess get(UUID requestId) {
        return repository.findById(requestId)
            .orElseThrow(() -> new NotFoundException("Emergency access not found"));
    }
}
