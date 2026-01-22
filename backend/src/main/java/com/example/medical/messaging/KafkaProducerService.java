package com.example.medical.messaging;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC_DOCUMENT_UPLOADED = "document-uploaded";

    private final KafkaTemplate<String, DocumentUploadedEvent> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, DocumentUploadedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishDocumentUploaded(DocumentUploadedEvent event) {
        try {
            kafkaTemplate.send(TOPIC_DOCUMENT_UPLOADED, event.getReportId().toString(), event);
            logger.info("Published document-uploaded event for report: {}", event.getReportId());
        } catch (Exception ex) {
            logger.error("Failed to publish document-uploaded event", ex);
        }
    }
}
