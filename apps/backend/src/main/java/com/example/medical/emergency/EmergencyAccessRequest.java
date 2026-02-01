package com.example.medical.emergency;

import com.example.medical.common.EmergencyAccessStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class EmergencyAccessRequest {
    @NotBlank
    private String requesterName;
    @NotBlank
    private String reason;
    @NotNull
    private OffsetDateTime expiresAt;
    private String notes;
    private EmergencyAccessStatus status = EmergencyAccessStatus.PENDING;

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public OffsetDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(OffsetDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public EmergencyAccessStatus getStatus() {
        return status;
    }

    public void setStatus(EmergencyAccessStatus status) {
        this.status = status;
    }
}
