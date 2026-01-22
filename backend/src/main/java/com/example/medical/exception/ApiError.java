package com.example.medical.exception;

import java.time.OffsetDateTime;

public class ApiError {
    private final OffsetDateTime timestamp = OffsetDateTime.now();
    private final int status;
    private final String error;
    private final String message;

    public ApiError(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }
}
