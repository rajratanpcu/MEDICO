package com.example.medical.report;

import com.example.medical.common.ReportStatus;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients/{patientId}/reports")
public class MedicalReportController {

    private final MedicalReportService service;

    public MedicalReportController(MedicalReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MedicalReportResponse> create(@PathVariable UUID patientId,
                                                        @RequestParam UUID doctorId,
                                                        @Valid @RequestBody MedicalReportRequest request) {
        MedicalReport report = map(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(MedicalReportResponse.from(service.create(patientId, doctorId, report)));
    }

    @GetMapping
    public List<MedicalReportResponse> list(@PathVariable UUID patientId) {
        return service.findByPatient(patientId).stream().map(MedicalReportResponse::from).toList();
    }

    @GetMapping("/{reportId}")
    public MedicalReportResponse get(@PathVariable UUID reportId) {
        return MedicalReportResponse.from(service.get(reportId));
    }

    @PatchMapping("/{reportId}/status")
    public MedicalReportResponse updateStatus(@PathVariable UUID reportId,
                                              @RequestParam ReportStatus status) {
        return MedicalReportResponse.from(service.updateStatus(reportId, status));
    }

    @PatchMapping("/{reportId}/summary")
    public MedicalReportResponse updateSummary(@PathVariable UUID reportId,
                                               @RequestBody String summary) {
        return MedicalReportResponse.from(service.updateSummary(reportId, summary));
    }

    private MedicalReport map(MedicalReportRequest request) {
        MedicalReport report = new MedicalReport();
        report.setTitle(request.getTitle());
        report.setReportType(request.getReportType());
        report.setStorageUrl(request.getStorageUrl());
        report.setSummary(request.getSummary());
        report.setStatus(request.getStatus());
        report.setReportDate(request.getReportDate());
        return report;
    }
}
