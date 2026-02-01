package com.example.medical.doctor;

import com.example.medical.common.DoctorStatus;
import com.example.medical.exception.NotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DoctorService {

    private final DoctorRepository repository;

    public DoctorService(DoctorRepository repository) {
        this.repository = repository;
    }

    public Doctor create(Doctor doctor) {
        return repository.save(doctor);
    }

    public Doctor update(UUID id, Doctor payload) {
        Doctor existing = get(id);
        existing.setFirstName(payload.getFirstName());
        existing.setLastName(payload.getLastName());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setSpecialty(payload.getSpecialty());
        existing.setStatus(payload.getStatus());
        return existing;
    }

    public Doctor get(UUID id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Doctor not found"));
    }

    public List<Doctor> list() {
        return repository.findAll();
    }

    public Doctor changeStatus(UUID id, DoctorStatus status) {
        Doctor doctor = get(id);
        doctor.setStatus(status);
        return doctor;
    }
}
