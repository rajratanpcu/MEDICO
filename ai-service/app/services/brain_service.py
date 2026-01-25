import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

SAFETY_DISCLAIMER = "Disclaimer: I am an AI assistant, not a doctor. I cannot provide medical diagnoses. Please consult a professional."

class BrainService:
    @staticmethod
    def classify_intent(text: str) -> str:
        text = text.lower()
        if "emergency" in text or "alert" in text or "code blue" in text:
            return "EMERGENCY_ALERT"
        if "email" in text or "sms" in text or "send" in text:
            return "WORKFLOW_AUTO"
        if "diagnose" in text or "do i have" in text:
            return "DIAGNOSIS_REQUEST"
        return "MEDICAL_INFO"

    @staticmethod
    def process_query(text: str) -> Dict[str, Any]:
        intent = BrainService.classify_intent(text)
        logger.info(f"Detected Intent: {intent}")

        response = {
            "intent": intent,
            "text": "",
            "action": None,
            "safety_warning": ""
        }

        if intent == "DIAGNOSIS_REQUEST":
            response["text"] = f"I cannot diagnose conditions. {SAFETY_DISCLAIMER}"
            response["safety_warning"] = "DIAGNOSIS_ATTEMPT_BLOCKED"
        
        elif intent == "EMERGENCY_ALERT":
            response["action"] = "TRIGGER_N8N_EMERGENCY"
            response["text"] = "Processing emergency alert..."
            
        elif intent == "WORKFLOW_AUTO":
             response["action"] = "TRIGGER_N8N_EMAIL"
             response["text"] = "Processing notification request..."

        else:
            # Fallback to general chat logic (handled by main.py usually)
            response["action"] = "CHAT_QUERY"
        
        return response
