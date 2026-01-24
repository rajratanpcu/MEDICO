package com.example.medical.auth;

import com.example.medical.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final long expirationMs;

    public AuthController(AuthService authService,
                        JwtTokenProvider jwtTokenProvider,
                        @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.expirationMs = expirationMs;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getEmail(), request.getPassword());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new TokenResponse(token, expirationMs / 1000, user.getId().toString(), user.getEmail(), user.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody LoginRequest request) {
        User user = authService.register(request.getEmail(), request.getPassword(), UserRole.CLINICIAN);
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return ResponseEntity.status(HttpStatus.CREATED).body(new TokenResponse(token, expirationMs / 1000, user.getId().toString(), user.getEmail(), user.getRole().name()));
    }
}
