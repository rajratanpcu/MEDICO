package com.example.medical.doctor;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.medical.common.DoctorStatus;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DoctorResponse> create(@Valid @RequestBody DoctorRequest request) {
        Doctor doctor = map(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(DoctorResponse.from(service.create(doctor)));
    }

    @PutMapping("/{id}")
    public DoctorResponse update(@PathVariable UUID id, @Valid @RequestBody DoctorRequest request) {
        Doctor doctor = map(request);
        return DoctorResponse.from(service.update(id, doctor));
    }

    @GetMapping("/{id}")
    public DoctorResponse get(@PathVariable UUID id) {
        return DoctorResponse.from(service.get(id));
    }

    @GetMapping
    public List<DoctorResponse> list() {
        return service.list().stream().map(DoctorResponse::from).toList();
    }

    @PutMapping("/{id}/status")
    public DoctorResponse changeStatus(@PathVariable UUID id, @RequestParam DoctorStatus status) {
        return DoctorResponse.from(service.changeStatus(id, status));
    }

    private Doctor map(DoctorRequest request) {
        Doctor doctor = new Doctor();
        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setSpecialty(request.getSpecialty());
        doctor.setStatus(request.getStatus());
        return doctor;
    }
}
