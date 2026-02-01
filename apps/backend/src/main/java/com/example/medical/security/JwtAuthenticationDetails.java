package com.example.medical.security;

import java.util.UUID;

public class JwtAuthenticationDetails {
    private final UUID userId;
    private final String email;
    private final String role;

    public JwtAuthenticationDetails(UUID userId, String email, String role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
