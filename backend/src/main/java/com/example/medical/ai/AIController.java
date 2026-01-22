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
        return service.chat(request.patientId(), request.question());
    }

    public record AnalyzeRequest(UUID reportId) { }
    public record ChatRequest(UUID patientId, @NotBlank String question) { }
}
