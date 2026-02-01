package com.example.medical.patient;

import com.example.medical.common.PatientStatus;
import com.example.medical.exception.NotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PatientService {

    private final PatientRepository repository;

    public PatientService(PatientRepository repository) {
        this.repository = repository;
    }

    public Patient create(Patient patient) {
        return repository.save(patient);
    }

    public Patient update(UUID id, Patient payload) {
        Patient existing = get(id);
        existing.setFirstName(payload.getFirstName());
        existing.setLastName(payload.getLastName());
        existing.setDateOfBirth(payload.getDateOfBirth());
        existing.setGender(payload.getGender());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setStatus(payload.getStatus());
        return existing;
    }

    public Patient get(UUID id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Patient not found"));
    }

    public List<Patient> list() {
        return repository.findAll();
    }

    public void deactivate(UUID id) {
        Patient patient = get(id);
        patient.setStatus(PatientStatus.INACTIVE);
    }
}
