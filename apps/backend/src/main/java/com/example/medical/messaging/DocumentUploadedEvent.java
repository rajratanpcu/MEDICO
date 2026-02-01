package com.example.medical.messaging;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import java.util.UUID;

public class DocumentUploadedEvent {
    @JsonProperty("event_id")
    private UUID eventId = UUID.randomUUID();

    @JsonProperty("report_id")
    private UUID reportId;

    @JsonProperty("patient_id")
    private UUID patientId;

    @JsonProperty("storage_url")
    private String storageUrl;

    @JsonProperty("timestamp")
    private OffsetDateTime timestamp = OffsetDateTime.now();

    public DocumentUploadedEvent() {}

    public DocumentUploadedEvent(UUID reportId, UUID patientId, String storageUrl) {
        this.reportId = reportId;
        this.patientId = patientId;
        this.storageUrl = storageUrl;
    }

    public UUID getEventId() {
        return eventId;
    }

    public UUID getReportId() {
        return reportId;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public String getStorageUrl() {
        return storageUrl;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }
}
