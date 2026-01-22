package com.example.medical.doctor;

import com.example.medical.common.DoctorStatus;
import java.util.UUID;

public class DoctorResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialty;
    private DoctorStatus status;

    public static DoctorResponse from(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.id = doctor.getId();
        response.firstName = doctor.getFirstName();
        response.lastName = doctor.getLastName();
        response.email = doctor.getEmail();
        response.phone = doctor.getPhone();
        response.specialty = doctor.getSpecialty();
        response.status = doctor.getStatus();
        return response;
    }

    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSpecialty() {
        return specialty;
    }

    public DoctorStatus getStatus() {
        return status;
    }
}
