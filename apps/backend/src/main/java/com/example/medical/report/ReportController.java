package com.example.medical.report;

import com.example.medical.doctor.Doctor;
import com.example.medical.doctor.DoctorRepository;
import com.example.medical.security.JwtAuthenticationDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final MedicalReportService reportService;
    private final MedicalReportRepository reportRepository;
    private final DoctorRepository doctorRepository;
    private static final String UPLOAD_DIR = "uploads/reports/";

    public ReportController(MedicalReportService reportService, 
                            MedicalReportRepository reportRepository,
                            DoctorRepository doctorRepository) {
        this.reportService = reportService;
        this.reportRepository = reportRepository;
        this.doctorRepository = doctorRepository;
        
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") String patientIdStr,
            @RequestParam("title") String title,
            @RequestParam("reportType") String reportType,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            // Get current authenticated doctor
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = null;
            Object details = authentication.getDetails();
            
            if (details instanceof JwtAuthenticationDetails) {
                email = ((JwtAuthenticationDetails) details).getEmail();
            } else {
                // Fallback: This might fail if principal is not email, but usually in JWT filter we set details
                // If details aren't set, we can't reliably get email unless principal IS the email string
                email = authentication.getName(); 
            }
            
            if (email == null) {
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User email not found in token"));
            }

            Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user is not a registered doctor. Please contact admin."));

            UUID patientId = UUID.fromString(patientIdStr);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create report entity payload
            MedicalReport report = new MedicalReport();
            report.setTitle(title);
            report.setReportType(reportType);
            report.setStorageUrl(filePath.toString());
            report.setSummary(description);
            report.setStatus(com.example.medical.common.ReportStatus.PROCESSING);
            report.setReportDate(java.time.LocalDate.now());

            // Use service to create report (handles relationships and kafka)
            MedicalReport savedReport = reportService.create(patientId, doctor.getId(), report);

            // Return response
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedReport.getId());
            response.put("title", savedReport.getTitle());
            response.put("reportType", savedReport.getReportType());
            response.put("uploadedAt", savedReport.getCreatedAt());
            response.put("status", savedReport.getStatus());
            response.put("message", "Report uploaded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Error creating report: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<MedicalReport> reportPage = reportRepository.findAll(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", reportPage.getContent().stream()
            .map(this::mapToResponse)
            .toList());
        response.put("totalPages", reportPage.getTotalPages());
        response.put("totalElements", reportPage.getTotalElements());
        response.put("currentPage", reportPage.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getReport(@PathVariable UUID id) {
        return reportRepository.findById(id)
            .map(report -> ResponseEntity.ok(mapToResponse(report)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientReports(
            @PathVariable UUID patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<MedicalReport> reportPage = reportRepository.findByPatientId(patientId, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", reportPage.getContent().stream()
            .map(this::mapToResponse)
            .toList());
        response.put("totalPages", reportPage.getTotalPages());
        response.put("totalElements", reportPage.getTotalElements());
        response.put("currentPage", reportPage.getNumber());
        response.put("patientId", patientId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable UUID id) {
        if (!reportRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reportRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> mapToResponse(MedicalReport report) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", report.getId());
        response.put("title", report.getTitle());
        response.put("reportType", report.getReportType());
        response.put("description", report.getSummary());
        response.put("uploadedAt", report.getCreatedAt());
        response.put("status", report.getStatus());
        response.put("analysisStatus", report.getStatus());
        
        if (report.getPatient() != null) {
            response.put("patientName", report.getPatient().getFirstName() + " " + report.getPatient().getLastName());
            response.put("patientId", report.getPatient().getId());
        }
        
        return response;
    }
}
