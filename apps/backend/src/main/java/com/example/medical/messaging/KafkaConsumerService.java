package com.example.medical.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @KafkaListener(topics = "document-uploaded", groupId = "medical-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeDocumentUploadedEvent(DocumentUploadedEvent event) {
        logger.info("Received document-uploaded event: reportId={}, patientId={}, storageUrl={}",
            event.getReportId(), event.getPatientId(), event.getStorageUrl());
        // Trigger AI analysis via HTTP call to FastAPI
        // e.g., call AIService.analyzeReport(event.getReportId())
    }
}
