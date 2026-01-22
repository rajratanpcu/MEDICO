package com.example.medical.emergency;

import com.example.medical.common.EmergencyAccessStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public class EmergencyAccessResponse {
    private UUID id;
    private UUID patientId;
    private String requesterName;
    private String reason;
    private UUID approvedByDoctorId;
    private OffsetDateTime expiresAt;
    private EmergencyAccessStatus status;
    private String notes;

    public static EmergencyAccessResponse from(EmergencyAccess access) {
        EmergencyAccessResponse response = new EmergencyAccessResponse();
        response.id = access.getId();
        response.patientId = access.getPatient() != null ? access.getPatient().getId() : null;
        response.requesterName = access.getRequesterName();
        response.reason = access.getReason();
        response.approvedByDoctorId = access.getApprovedBy() != null ? access.getApprovedBy().getId() : null;
        response.expiresAt = access.getExpiresAt();
        response.status = access.getStatus();
        response.notes = access.getNotes();
        return response;
    }

    public UUID getId() {
        return id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public String getReason() {
        return reason;
    }

    public UUID getApprovedByDoctorId() {
        return approvedByDoctorId;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public EmergencyAccessStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }
}
