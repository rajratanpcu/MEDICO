package com.example.medical.emergency;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emergency")
public class EmergencyAccessRootController {

    private final EmergencyAccessService service;
    private final EmergencyAccessRepository repository;

    public EmergencyAccessRootController(EmergencyAccessService service, EmergencyAccessRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<EmergencyAccessResponse>> getAllEmergencyAccess() {
        List<EmergencyAccess> accesses = repository.findAll();
        return ResponseEntity.ok(accesses.stream()
            .map(EmergencyAccessResponse::from)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyAccessResponse> getEmergencyAccess(@PathVariable UUID id) {
        return repository.findById(id)
            .map(e -> ResponseEntity.ok(EmergencyAccessResponse.from(e)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmergencyAccessResponse> requestEmergencyAccess(
            @RequestParam UUID patientId,
            @RequestBody EmergencyAccessRequest request) {
        EmergencyAccess access = map(request);
        EmergencyAccess created = service.request(patientId, access);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(EmergencyAccessResponse.from(created));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EmergencyAccessResponse> approveEmergencyAccess(
            @PathVariable UUID id,
            @RequestParam UUID doctorId) {
        try {
            EmergencyAccess approved = service.approve(id, doctorId);
            return ResponseEntity.ok(EmergencyAccessResponse.from(approved));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/deny")
    public ResponseEntity<EmergencyAccessResponse> denyEmergencyAccess(
            @PathVariable UUID id) {
        try {
            EmergencyAccess denied = service.deny(id);
            return ResponseEntity.ok(EmergencyAccessResponse.from(denied));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergencyAccess(@PathVariable UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
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
