package com.example.medical.prescription;

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
@RequestMapping("/patients/{patientId}/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PrescriptionResponse> create(@PathVariable UUID patientId,
                                                       @RequestParam UUID doctorId,
                                                       @Valid @RequestBody PrescriptionRequest request) {
        Prescription prescription = map(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(PrescriptionResponse.from(service.create(patientId, doctorId, prescription)));
    }

    @GetMapping
    public List<PrescriptionResponse> list(@PathVariable UUID patientId) {
        return service.findByPatient(patientId).stream().map(PrescriptionResponse::from).toList();
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
