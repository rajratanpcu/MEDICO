package com.example.medical.ai;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AIRequestLogRepository extends JpaRepository<AIRequestLog, UUID> {
}
