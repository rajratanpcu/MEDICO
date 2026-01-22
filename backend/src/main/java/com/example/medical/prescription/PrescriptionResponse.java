package com.example.medical.prescription;

import com.example.medical.common.PrescriptionStatus;
import java.time.LocalDate;
import java.util.UUID;

public class PrescriptionResponse {
    private UUID id;
    private UUID patientId;
    private UUID doctorId;
    private String drugName;
    private String dosage;
    private String frequency;
    private String route;
    private LocalDate startDate;
    private LocalDate endDate;
    private PrescriptionStatus status;

    public static PrescriptionResponse from(Prescription prescription) {
        PrescriptionResponse response = new PrescriptionResponse();
        response.id = prescription.getId();
        response.patientId = prescription.getPatient() != null ? prescription.getPatient().getId() : null;
        response.doctorId = prescription.getDoctor() != null ? prescription.getDoctor().getId() : null;
        response.drugName = prescription.getDrugName();
        response.dosage = prescription.getDosage();
        response.frequency = prescription.getFrequency();
        response.route = prescription.getRoute();
        response.startDate = prescription.getStartDate();
        response.endDate = prescription.getEndDate();
        response.status = prescription.getStatus();
        return response;
    }

    public UUID getId() {
        return id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public UUID getDoctorId() {
        return doctorId;
    }

    public String getDrugName() {
        return drugName;
    }

    public String getDosage() {
        return dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getRoute() {
        return route;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public PrescriptionStatus getStatus() {
        return status;
    }
}
