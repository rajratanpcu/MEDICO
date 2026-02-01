package com.example.medical.auth;

public class TokenResponse {
    private String token;
    private String type = "Bearer";
    private long expiresIn;

    private String userId;
    private String email;
    private String role;

    public TokenResponse(String token, long expiresIn, String userId, String email, String role) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getType() {
        return type;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
