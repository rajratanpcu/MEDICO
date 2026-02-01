package com.example.medical.prescription;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prescriptions")
public class PrescriptionRootController {

    private final PrescriptionService service;
    private final PrescriptionRepository repository;

    public PrescriptionRootController(PrescriptionService service, PrescriptionRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions() {
        List<Prescription> prescriptions = repository.findAll();
        return ResponseEntity.ok(prescriptions.stream()
            .map(PrescriptionResponse::from)
            .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescription(@PathVariable UUID id) {
        return repository.findById(id)
            .map(p -> ResponseEntity.ok(PrescriptionResponse.from(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(
            @RequestParam UUID patientId,
            @RequestParam UUID doctorId,
            @RequestBody PrescriptionRequest request) {
        Prescription prescription = map(request);
        Prescription created = service.create(patientId, doctorId, prescription);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PrescriptionResponse.from(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> updatePrescription(
            @PathVariable UUID id,
            @RequestBody PrescriptionRequest request) {
        return repository.findById(id)
            .map(existing -> {
                existing.setDrugName(request.getDrugName());
                existing.setDosage(request.getDosage());
                existing.setFrequency(request.getFrequency());
                existing.setRoute(request.getRoute());
                existing.setStartDate(request.getStartDate());
                existing.setEndDate(request.getEndDate());
                existing.setStatus(request.getStatus());
                Prescription updated = repository.save(existing);
                return ResponseEntity.ok(PrescriptionResponse.from(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private Prescription map(PrescriptionRequest request) {
        Prescription prescription = new Prescription();
        prescription.setDrugName(request.getDrugName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setRoute(request.getRoute());
        prescription.setStartDate(request.getStartDate());
        prescription.setEndDate(request.getEndDate());
        prescription.setStatus(request.getStatus());
        return prescription;
    }
}
