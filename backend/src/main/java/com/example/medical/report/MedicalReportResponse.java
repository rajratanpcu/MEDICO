package com.example.medical.report;

import com.example.medical.common.ReportStatus;
import java.time.LocalDate;
import java.util.UUID;

public class MedicalReportResponse {
    private UUID id;
    private UUID patientId;
    private UUID doctorId;
    private String title;
    private String reportType;
    private String storageUrl;
    private String summary;
    private ReportStatus status;
    private LocalDate reportDate;

    public static MedicalReportResponse from(MedicalReport report) {
        MedicalReportResponse response = new MedicalReportResponse();
        response.id = report.getId();
        response.patientId = report.getPatient() != null ? report.getPatient().getId() : null;
        response.doctorId = report.getDoctor() != null ? report.getDoctor().getId() : null;
        response.title = report.getTitle();
        response.reportType = report.getReportType();
        response.storageUrl = report.getStorageUrl();
        response.summary = report.getSummary();
        response.status = report.getStatus();
        response.reportDate = report.getReportDate();
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

    public String getTitle() {
        return title;
    }

    public String getReportType() {
        return reportType;
    }

    public String getStorageUrl() {
        return storageUrl;
    }

    public String getSummary() {
        return summary;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }
}
