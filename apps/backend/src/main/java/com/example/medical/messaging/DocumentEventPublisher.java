package com.example.medical.messaging;

public interface DocumentEventPublisher {
    void publishDocumentUploaded(DocumentUploadedEvent event);
}