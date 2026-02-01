package com.example.medical;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MedicalApplication {
    public static void main(String[] args) {
        SpringApplication.run(MedicalApplication.class, args);
    }
}
