package com.example.medical.emergency;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients/{patientId}/emergency-access")
public class EmergencyAccessController {

    private final EmergencyAccessService service;

    public EmergencyAccessController(EmergencyAccessService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EmergencyAccessResponse> request(@PathVariable UUID patientId,
                                                           @Valid @RequestBody EmergencyAccessRequest request) {
        EmergencyAccess access = map(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(EmergencyAccessResponse.from(service.request(patientId, access)));
    }

    @PostMapping("/{requestId}/approve")
    public EmergencyAccessResponse approve(@PathVariable UUID patientId,
                                           @PathVariable UUID requestId,
                                           @RequestParam UUID doctorId) {
        return EmergencyAccessResponse.from(service.approve(requestId, doctorId));
    }

    @PostMapping("/{requestId}/deny")
    public EmergencyAccessResponse deny(@PathVariable UUID patientId,
                                        @PathVariable UUID requestId) {
        return EmergencyAccessResponse.from(service.deny(requestId));
    }

    @GetMapping
    public List<EmergencyAccessResponse> active(@PathVariable UUID patientId) {
        return service.activeForPatient(patientId).stream().map(EmergencyAccessResponse::from).toList();
    }

    private EmergencyAccess map(EmergencyAccessRequest request) {
        EmergencyAccess access = new EmergencyAccess();
        access.setRequesterName(request.getRequesterName());
        access.setReason(request.getReason());
        access.setExpiresAt(request.getExpiresAt());
        access.setNotes(request.getNotes());
        access.setStatus(request.getStatus());
        return access;
    }
}
