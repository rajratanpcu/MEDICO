# n8n Workflow Automation Design
> **Component**: Workflow Engine (The "Hands")  
> **Tool**: n8n (Self-hosted via Docker)  
> **Author**: Antigravity (Workflow Architect)

## 1. Architecture: The "Delegator" Pattern

We follow strict **Separation of Concerns**:
*   **Spring Boot**: Holds state and business rules.
*   **n8n**: Moves data between inputs and outputs (Orchestration). **It has NO business logic.**

**Rule**: n8n never decides *who* to email. The Backend tells it "Email John". n8n just executes the delivery.

---

## 2. Core Workflows

### Workflow A: New Report Uploaded -> AI Analysis
**Trigger**: Backend Webhook (Event: `REPORT_UPLOADED`)
**Goal**: Analyze content + Notify.

1.  **Webhook Node**: Receives `{ "report_id": 101, "patient_id": 55, "file_url": "..." }`.
2.  **HTTP Request (AI)**: POST `file_url` to Python Service for analysis.
    *   *Result*: `{ "summary": "Normal X-ray", "critical": false }`
3.  **If Node**: `critical == true`?
    *   **True**: HTTP Request -> Backend `POST /alerts`. Send SMS to Doctor.
    *   **False**: HTTP Request -> Backend `PATCH /reports/101` (store summary).
4.  **Email Node**: Send "Report Ready" notification to Patient.

### Workflow B: Emergency Voice Alert
**Trigger**: AI Brain Webhook (Intent: `EMERGENCY_ALERT`)
**Goal**: Immediate multi-channel escalation.

1.  **Webhook Node**: Receives `{ "patient_id": 55, "location": "Room 302", "type": "Cardiac" }`.
2.  **Parallel Execution**:
    *   **Branch 1 (SMS)**: Twilio/Service Node -> Send "CODE BLUE Room 302" to On-Call Doctors.
    *   **Branch 2 (Email)**: Send detailed incident report to Admin.
    *   **Branch 3 (Log)**: Append to Google Sheets/Database for audit trail.

### Workflow C: Daily Appointment Reminders
**Trigger**: Cron Node (Every Morning at 08:00 AM)
**Goal**: Reduce no-shows.

1.  **Cron**: Runs daily.
2.  **HTTP Request (Backend)**: `GET /api/appointments?date=tomorrow`.
    *   *Result*: `[ { "email": "john@...", "time": "10:00" }, ... ]`
3.  **Split In Batches**: Loop through each appointment.
4.  **Email Node**: Send "Reminder: You have an appointment tomorrow at {{time}}".

### Workflow D: Voice "Send Email" Command
**Trigger**: AI Brain Webhook (Intent: `WORKFLOW_AUTO`)
**Goal**: Execute doctor's specific command.

1.  **Webhook Node**: `{ "action": "email_patient", "patient_email": "...", "subject": "...", "body": "..." }`.
2.  **Gmail/SMTP Node**: Send the email.
3.  **Response Node**: Return JSON `{ "status": "success" }` so the Voice Assistant can say "Email sent."

---

## 3. Webhook Payloads (Contracts)

### From Python AI Brain -> n8n
```json
// POST http://n8n:5678/webhook/voice-command
{
  "intent": "WORKFLOW_AUTO",
  "action": "send_email",
  "meta": {
    "recipient": "patient@example.com",
    "subject": "Lab Results",
    "body": "Your results are ready."
  },
  "auth_token": "secure-internal-token"
}
```

### From Spring Boot -> n8n
```json
// POST http://n8n:5678/webhook/events
{
  "event": "REPORT_UPLOADED",
  "payload": {
    "report_id": 123,
    "url": "http://minio/bucket/file.pdf"
  }
}
```

---

## 4. Error Handling & Traceability

1.  **Global Error Workflow**:
    *   If ANY workflow fails, the **Error Trigger** node executes.
    *   **Action**: Email System Admin: "Workflow X Failed. Data: {...}".

2.  **Retry Policy**:
    *   For **HTTP Requests** (e.g., Calling AI Service): Set "Retry on Fail" to 3 times (wait 1s).
    *   For **Notifications**: Do NOT retry if email address is invalid (4xx error).

3.  **Logging**:
    *   Enable standard n8n execution logging (saved to SQLite/Postgres internal DB).
    *   For critical Audit (Emergency), add an explicit step to write to the main Backend Database via API.

---

## 5. Security Checklist
- [ ] **Webhook Auth**: Use "Basic Auth" or efficient "Header Auth" validation on all Webhook nodes.
- [ ] **Network**: Docker network only. Do not expose 5678 to public internet. Webhooks are internal calls.
