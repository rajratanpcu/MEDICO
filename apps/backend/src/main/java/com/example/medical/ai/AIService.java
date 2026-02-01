package com.example.medical.ai;

import com.example.medical.exception.ExternalServiceException;
import java.time.Duration;
import java.util.List;
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
        Map<String, Object> aiResponse = callEndpoint("/chat", Map.of(
            "patient_id", patientId != null ? patientId.toString() : "",
            "question", question
        ));
        
        // Map AI service response to frontend expected format
        // AI service returns: { "answer": "...", "citations": [...], "safety_banner": "...", "model_version": "..." }
        // Frontend expects: { "response": "..." }
        return Map.of(
            "response", aiResponse.getOrDefault("answer", "I'm sorry, I couldn't process that request."),
            "citations", aiResponse.getOrDefault("citations", List.of()),
            "safetyBanner", aiResponse.getOrDefault("safety_banner", "")
        );
    }

    public Map<String, Object> predictSymptoms(List<String> symptoms, Map<String, Object> demographics, Map<String, Object> vitals) {
        return callEndpoint("/predict/symptoms", Map.of(
            "symptoms", symptoms,
            "demographics", demographics != null ? demographics : Map.of(),
            "vitals", vitals != null ? vitals : Map.of()
        ));
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
            String summary = response != null ? response.toString() : null;
            log.setResponseSummary(summary != null && summary.length() > 250 ? summary.substring(0, 250) : summary);
            logRepository.save(log);
            return response;
        } catch (Exception ex) {
            AIRequestLog log = new AIRequestLog();
            log.setRequestType(path);
            log.setStatus("ERROR");
            String errorMsg = ex.getMessage();
            log.setResponseSummary(errorMsg != null && errorMsg.length() > 250 ? errorMsg.substring(0, 250) : errorMsg);
            logRepository.save(log);
            throw new ExternalServiceException("AI service call failed", ex);
        }
    }
}
