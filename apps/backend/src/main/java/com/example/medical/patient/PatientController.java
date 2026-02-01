package com.example.medical.patient;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientService service;

    public PatientController(PatientService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PatientResponse> create(@Valid @RequestBody PatientRequest request) {
        Patient patient = map(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(PatientResponse.from(service.create(patient)));
    }

    @PutMapping("/{id}")
    public PatientResponse update(@PathVariable UUID id, @Valid @RequestBody PatientRequest request) {
        Patient patient = map(request);
        return PatientResponse.from(service.update(id, patient));
    }

    @GetMapping("/{id}")
    public PatientResponse get(@PathVariable UUID id) {
        return PatientResponse.from(service.get(id));
    }

    @GetMapping
    public List<PatientResponse> list() {
        return service.list().stream().map(PatientResponse::from).toList();
    }

    private Patient map(PatientRequest request) {
        Patient patient = new Patient();
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setStatus(request.getStatus());
        return patient;
    }
}
