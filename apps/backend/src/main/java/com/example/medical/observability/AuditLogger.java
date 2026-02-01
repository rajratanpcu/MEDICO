package com.example.medical.observability;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class AuditLogger {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");

    public void logUserLogin(UUID userId, String email, boolean success) {
        auditLog.info("USER_LOGIN|userId={}|email={}|success={}", userId, email, success);
    }

    public void logPatientAccess(UUID userId, UUID patientId, String action) {
        auditLog.info("PATIENT_ACCESS|userId={}|patientId={}|action={}", userId, patientId, action);
    }

    public void logReportCreated(UUID userId, UUID reportId, UUID patientId) {
        auditLog.info("REPORT_CREATED|userId={}|reportId={}|patientId={}", userId, reportId, patientId);
    }

    public void logEmergencyAccessRequest(UUID patientId, String requesterName) {
        auditLog.info("EMERGENCY_ACCESS_REQUEST|patientId={}|requesterName={}", patientId, requesterName);
    }

    public void logEmergencyAccessApproved(UUID requestId, UUID doctorId) {
        auditLog.info("EMERGENCY_ACCESS_APPROVED|requestId={}|doctorId={}", requestId, doctorId);
    }

    public void logDataExported(UUID userId, String resourceType, UUID resourceId) {
        auditLog.info("DATA_EXPORTED|userId={}|resourceType={}|resourceId={}", userId, resourceType, resourceId);
    }
}
