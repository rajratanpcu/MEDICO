package com.example.medical.doctor;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    java.util.Optional<Doctor> findByEmail(String email);
}
