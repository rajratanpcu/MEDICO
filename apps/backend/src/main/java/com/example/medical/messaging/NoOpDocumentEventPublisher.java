package com.example.medical.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpDocumentEventPublisher implements DocumentEventPublisher {

    private static final Logger logger = LoggerFactory.getLogger(NoOpDocumentEventPublisher.class);

    @Override
    public void publishDocumentUploaded(DocumentUploadedEvent event) {
        logger.debug("Kafka disabled, skipping document-uploaded event for report: {}", event.getReportId());
    }
}