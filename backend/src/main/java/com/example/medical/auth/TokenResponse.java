package com.example.medical.auth;

public class TokenResponse {
    private String token;
    private String type = "Bearer";
    private long expiresIn;

    public TokenResponse(String token, long expiresIn) {
        this.token = token;
        this.expiresIn = expiresIn;
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
}
