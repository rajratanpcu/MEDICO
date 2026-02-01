# AI Voice Assistant Setup Guide

## 1. System Overview
You have installed a complete Voice AI system with:
*   **Infrastructure**: Docker containers for AI, Backend, Frontend, Gateway, and n8n.
*   **Ears**: `faster-whisper` (Local Speech-to-Text).
*   **Mouth**: `edge-tts` (Neural Text-to-Speech).
*   **Brain**: `BrainService` (Intent Classification & Safety).
*   **Nervous System**: n8n (Automation Workflows).

## 2. Installation Instructions

### Step 1: Build the Infrastructure
(This is currently running on your machine)
```powershell
docker-compose up -d --build
```
*Note: The first build takes 10+ minutes to download AI models.*

### Step 2: Configure Automation (n8n)
1.  Open [http://localhost:5678](http://localhost:5678)
2.  Create an owner account (email/password).
3.  **Import Workflow**:
    *   Click "Workflows" > "Import from File".
    *   Select `n8n_workflows.json` (found in your project root).
    *   Activate the workflow (Toggle "Active" to ON).

### Step 3: Access the App
1.  Open [http://localhost:3000](http://localhost:3000)
2.  Login as a Doctor.
3.  Click the **Microphone Icon** (bottom right).
4.  Say: *"This is an emergency alert for patient Raj in Room 302."*
5.  Check n8n to see the automation trigger!

## 3. Troubleshooting
*   **"Connection Refused"**: The containers are still building. Wait 5 mins.
*   **"Mic Access Denied"**: Allow microphone permission in Chrome.
*   **No Audio Response**: Check `docker logs ai-service` for TTS errors.

## 4. Developer Notes
*   **AI Logic**: Located in `ai-service/app/services/brain_service.py`.
*   **Voice UI**: Located in `frontend/src/components/common/VoiceRecorder.jsx`.
