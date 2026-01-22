package com.example.medical.patient;

import com.example.medical.common.Gender;
import com.example.medical.common.PatientStatus;
import java.time.LocalDate;
import java.util.UUID;

public class PatientResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String email;
    private String phone;
    private PatientStatus status;

    public static PatientResponse from(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.id = patient.getId();
        response.firstName = patient.getFirstName();
        response.lastName = patient.getLastName();
        response.dateOfBirth = patient.getDateOfBirth();
        response.gender = patient.getGender();
        response.email = patient.getEmail();
        response.phone = patient.getPhone();
        response.status = patient.getStatus();
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public PatientStatus getStatus() {
        return status;
    }
}
