package com.example.medical.ai;

import com.example.medical.exception.ExternalServiceException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class AIService {

    private final WebClient webClient;
    private final AIRequestLogRepository logRepository;

    public AIService(@Value("${ai.service.base-url:http://localhost:8000}") String baseUrl,
                     AIRequestLogRepository logRepository) {
        this.webClient = WebClient.builder()
            .baseUrl(baseUrl)
            .build();
        this.logRepository = logRepository;
    }

    public Map<String, Object> analyzeReport(UUID reportId) {
        return callEndpoint("/ocr/analyze-report", Map.of("report_id", reportId.toString()));
    }

    public Map<String, Object> chat(UUID patientId, String question) {
        return callEndpoint("/chat", Map.of("patient_id", patientId != null ? patientId.toString() : null,
            "question", question));
    }

    private Map<String, Object> callEndpoint(String path, Map<String, Object> payload) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.post()
                .uri(path)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(10))
                .block();
            AIRequestLog log = new AIRequestLog();
            log.setRequestType(path);
            log.setStatus("SUCCESS");
            log.setResponseSummary(response != null ? response.toString() : null);
            logRepository.save(log);
            return response;
        } catch (Exception ex) {
            AIRequestLog log = new AIRequestLog();
            log.setRequestType(path);
            log.setStatus("ERROR");
            log.setResponseSummary(ex.getMessage());
            logRepository.save(log);
            throw new ExternalServiceException("AI service call failed", ex);
        }
    }
}
