package com.example.medical.ai;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIService service;

    public AIController(AIService service) {
        this.service = service;
    }

    @PostMapping("/analyze-report")
    public Map<String, Object> analyze(@RequestBody AnalyzeRequest request) {
        return service.analyzeReport(request.reportId());
    }

    @PostMapping("/chat")
    public Map<String, Object> chat(@RequestBody ChatRequest request) {
        // Handle both old format (patientId + question) and new format (message + conversationHistory)
        String message = request.question() != null ? request.question() : request.message();
        return service.chat(request.patientId(), message);
    }

    @PostMapping("/predict/symptoms")
    public Map<String, Object> predictSymptoms(@RequestBody SymptomRequest request) {
        return service.predictSymptoms(request.symptoms(), request.demographics(), request.vitals());
    }

    public record AnalyzeRequest(UUID reportId) { }
    public record ChatRequest(UUID patientId, String question, String message, Object conversationHistory) { }
    public record SymptomRequest(java.util.List<String> symptoms, Map<String, Object> demographics, Map<String, Object> vitals) { }
}
