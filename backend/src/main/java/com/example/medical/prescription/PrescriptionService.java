package com.example.medical.prescription;

import com.example.medical.doctor.Doctor;
import com.example.medical.doctor.DoctorRepository;
import com.example.medical.exception.NotFoundException;
import com.example.medical.patient.Patient;
import com.example.medical.patient.PatientRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository repository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionService(PrescriptionRepository repository,
                               PatientRepository patientRepository,
                               DoctorRepository doctorRepository) {
        this.repository = repository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Prescription create(UUID patientId, UUID doctorId, Prescription payload) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new NotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
        payload.setPatient(patient);
        payload.setDoctor(doctor);
        return repository.save(payload);
    }

    public List<Prescription> findByPatient(UUID patientId) {
        return repository.findByPatientId(patientId);
    }
}
