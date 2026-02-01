package com.example.medical.ai;

import com.example.medical.common.BaseEntity;
import com.example.medical.report.MedicalReport;
import com.example.medical.patient.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ai_request_logs")
public class AIRequestLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private MedicalReport report;

    @Column(name = "request_type", nullable = false)
    private String requestType;

    @Column(name = "payload_hash")
    private String payloadHash;

    @Column(name = "response_summary")
    private String responseSummary;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "model_version")
    private String modelVersion;

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public MedicalReport getReport() {
        return report;
    }

    public void setReport(MedicalReport report) {
        this.report = report;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getPayloadHash() {
        return payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getResponseSummary() {
        return responseSummary;
    }

    public void setResponseSummary(String responseSummary) {
        this.responseSummary = responseSummary;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }
}
