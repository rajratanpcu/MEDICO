package com.example.medical.observability;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class MetricsService {

    private final Counter reportCreatedCounter;
    private final Counter patientCreatedCounter;
    private final Counter authLoginCounter;
    private final Counter documentAnalyzedCounter;

    public MetricsService(MeterRegistry meterRegistry) {
        this.reportCreatedCounter = Counter.builder("medical.reports.created")
            .description("Total medical reports created")
            .register(meterRegistry);
        this.patientCreatedCounter = Counter.builder("medical.patients.created")
            .description("Total patients created")
            .register(meterRegistry);
        this.authLoginCounter = Counter.builder("medical.auth.login")
            .description("Total login attempts")
            .register(meterRegistry);
        this.documentAnalyzedCounter = Counter.builder("medical.documents.analyzed")
            .description("Total documents analyzed by AI")
            .register(meterRegistry);
    }

    public void incrementReportCreated() {
        reportCreatedCounter.increment();
    }

    public void incrementPatientCreated() {
        patientCreatedCounter.increment();
    }

    public void incrementAuthLogin() {
        authLoginCounter.increment();
    }

    public void incrementDocumentAnalyzed() {
        documentAnalyzedCounter.increment();
    }
}
