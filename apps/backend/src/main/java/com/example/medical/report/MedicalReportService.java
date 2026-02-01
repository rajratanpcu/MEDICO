package com.example.medical.report;

import com.example.medical.common.ReportStatus;
import com.example.medical.doctor.Doctor;
import com.example.medical.doctor.DoctorRepository;
import com.example.medical.exception.NotFoundException;
import com.example.medical.messaging.DocumentUploadedEvent;
import com.example.medical.messaging.KafkaProducerService;
import com.example.medical.patient.Patient;
import com.example.medical.patient.PatientRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MedicalReportService {

    private final MedicalReportRepository repository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final KafkaProducerService kafkaProducerService;

    public MedicalReportService(MedicalReportRepository repository,
                                PatientRepository patientRepository,
                                DoctorRepository doctorRepository,
                                KafkaProducerService kafkaProducerService) {
        this.repository = repository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    public MedicalReport create(UUID patientId, UUID doctorId, MedicalReport payload) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new NotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new NotFoundException("Doctor not found"));
        payload.setPatient(patient);
        payload.setDoctor(doctor);
        MedicalReport saved = repository.save(payload);
        // Publish document-uploaded event to Kafka
        kafkaProducerService.publishDocumentUploaded(
            new DocumentUploadedEvent(saved.getId(), patientId, saved.getStorageUrl())
        );
        return saved;
    }

    @Transactional
    public MedicalReport updateStatus(UUID reportId, ReportStatus status) {
        MedicalReport report = get(reportId);
        report.setStatus(status);
        return report;
    }

    @Transactional
    public MedicalReport updateSummary(UUID reportId, String summary) {
        MedicalReport report = get(reportId);
        report.setSummary(summary);
        return report;
    }

    public MedicalReport get(UUID reportId) {
        return repository.findById(reportId).orElseThrow(() -> new NotFoundException("Report not found"));
    }

    public List<MedicalReport> findByPatient(UUID patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<MedicalReport> findByDoctor(UUID doctorId) {
        return repository.findByDoctorId(doctorId);
    }
}
