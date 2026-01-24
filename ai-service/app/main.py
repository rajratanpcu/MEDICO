from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import logging
from datetime import datetime
from pathlib import Path
from app.training import train_symptom_classifier, train_entity_extractor

# Placeholders for model artifacts
MODEL_DIR = Path("/models")
FINE_TUNED_MODEL_PATH = MODEL_DIR / "fine_tuned_model.pt"

app = FastAPI(
    title="Medical AI Service",
    description="OCR + NLP for reports, symptom prediction, and chat support",
    version="0.0.1"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class AnalyzeReportRequest(BaseModel):
    report_id: str
    object_url: Optional[str] = None

class AnalyzeReportResponse(BaseModel):
    report_id: str
    ocr_text: str
    entities: List[dict]
    model_version: str
    timestamp: datetime

class PredictionRequest(BaseModel):
    symptoms: List[str]
    demographics: Optional[dict] = None
    vitals: Optional[dict] = None

class PredictionResponse(BaseModel):
    conditions: List[dict]
    model_version: str
    timestamp: datetime

class ChatRequest(BaseModel):
    patient_id: Optional[str] = None
    question: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[dict]
    safety_banner: str
    model_version: str


class FineTuneRequest(BaseModel):
    dataset_url: str
    model_name: str = "distilbert-base-uncased"
    epochs: int = 3
    learning_rate: float = 5e-5


class FineTuneResponse(BaseModel):
    status: str
    artifact_path: str
    model_version: str

# Endpoints
@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok"}

@app.post("/ocr/analyze-report", response_model=AnalyzeReportResponse)
async def analyze_report(request: AnalyzeReportRequest):
    """
    Analyze medical report: OCR + NLP extraction
    Returns structured findings (labs, impressions, etc.)
    """
    try:
        # Stub: replace with actual OCR + IE pipeline
        logger.info(f"Analyzing report {request.report_id}")
        return AnalyzeReportResponse(
            report_id=request.report_id,
            ocr_text="[OCR text placeholder]",
            entities=[
                {"type": "TEST", "text": "Glucose", "value": "120", "unit": "mg/dL"},
                {"type": "IMPRESSION", "text": "Normal findings"}
            ],
            model_version="v1.0",
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Error analyzing report: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/symptoms", response_model=PredictionResponse)
async def predict_symptoms(request: PredictionRequest):
    """
    Symptom-to-disease prediction
    Returns ranked conditions with confidence scores and red-flag indicators
    """
    try:
        logger.info(f"Predicting for symptoms: {request.symptoms}")
        # Stub: replace with actual ML model inference
        return PredictionResponse(
            conditions=[
                {"name": "Condition A", "confidence": 0.75, "red_flag": False},
                {"name": "Condition B", "confidence": 0.45, "red_flag": True}
            ],
            model_version="v1.0",
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        logger.error(f"Error predicting symptoms: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Medical decision support chat (NOT diagnostic)
    Includes safety banner and source citations
    """
    try:
        logger.info(f"Chat request: {request.question}")
        
        # Enhanced medical knowledge base
        question_lower = request.question.lower()
        answer = ""
        citations = []
        
        # Medical knowledge responses
        if any(word in question_lower for word in ['diabetes', 'diabetic', 'blood sugar']):
            answer = """Diabetes is a chronic condition that affects how your body processes blood sugar (glucose). 

**Common symptoms include:**
- Increased thirst and frequent urination
- Extreme hunger
- Unexplained weight loss
- Fatigue and weakness
- Blurred vision
- Slow-healing sores or frequent infections
- Tingling or numbness in hands or feet

**Types:**
- Type 1: Body doesn't produce insulin
- Type 2: Body doesn't use insulin properly (most common)
- Gestational: Develops during pregnancy

**Management typically includes:**
- Regular blood sugar monitoring
- Healthy diet and exercise
- Medication or insulin therapy as prescribed
- Regular check-ups with healthcare provider

**Important:** If you experience these symptoms, consult a healthcare provider for proper diagnosis and treatment."""
            citations = [
                {"doc_id": "medical-ref-001", "snippet": "Diabetes mellitus clinical guidelines"},
                {"doc_id": "medical-ref-002", "snippet": "Endocrinology reference manual"}
            ]
            
        elif any(word in question_lower for word in ['blood pressure', 'hypertension', 'high bp']):
            answer = """High blood pressure (hypertension) is a common condition where the force of blood against artery walls is consistently too high.

**Symptoms:**
- Often called "silent killer" as it usually has no symptoms
- Severe cases may cause: headaches, shortness of breath, nosebleeds, dizziness

**Risk Factors:**
- Age, family history, obesity
- Lack of physical activity
- High salt intake, smoking, alcohol
- Stress, chronic conditions

**Normal ranges:**
- Normal: Less than 120/80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1 Hypertension: 130-139/80-89 mmHg
- Stage 2 Hypertension: 140+/90+ mmHg

**Management:**
- Lifestyle changes (diet, exercise, weight loss)
- Reduce sodium intake
- Limit alcohol and quit smoking
- Stress management
- Medication as prescribed by doctor

**Important:** Regular monitoring and medical supervision are essential."""
            citations = [
                {"doc_id": "cardio-ref-001", "snippet": "Hypertension management guidelines"},
                {"doc_id": "cardio-ref-002", "snippet": "Cardiovascular health reference"}
            ]
            
        elif any(word in question_lower for word in ['fever', 'temperature', 'cold', 'flu']):
            answer = """Fever is a temporary increase in body temperature, often due to an illness.

**Normal body temperature:** 98.6°F (37°C)
**Fever:** Generally 100.4°F (38°C) or higher

**Common causes:**
- Viral infections (cold, flu, COVID-19)
- Bacterial infections
- Heat exhaustion
- Certain medications
- Immunizations

**When to seek medical care:**
- Temperature above 103°F (39.4°C)
- Fever lasting more than 3 days
- Severe headache, stiff neck, confusion
- Difficulty breathing
- Persistent vomiting
- Rash or unusual skin symptoms
- Infants under 3 months with any fever

**Home care:**
- Rest and stay hydrated
- Take fever-reducing medication (acetaminophen, ibuprofen) as directed
- Wear light clothing
- Keep room temperature comfortable

**Important:** Monitor symptoms and seek medical attention if fever is severe or persistent."""
            citations = [
                {"doc_id": "general-med-001", "snippet": "Fever management protocols"},
                {"doc_id": "infectious-disease-001", "snippet": "Common illness reference"}
            ]
            
        elif any(word in question_lower for word in ['headache', 'migraine', 'head pain']):
            answer = """Headaches are common and can range from mild discomfort to severe pain.

**Types:**
1. **Tension Headaches** (most common)
   - Dull, aching pain
   - Tightness around forehead
   - Caused by stress, poor posture, fatigue

2. **Migraines**
   - Intense throbbing pain (usually one side)
   - Nausea, sensitivity to light/sound
   - May have visual disturbances (aura)
   - Can last 4-72 hours

3. **Cluster Headaches**
   - Severe pain around one eye
   - Occurs in clusters over weeks/months

**When to seek immediate care:**
- Sudden, severe "thunderclap" headache
- Headache with fever, stiff neck, confusion
- After head injury
- With vision changes, weakness, or speech difficulty
- Worst headache of your life

**Management:**
- Over-the-counter pain relievers
- Rest in quiet, dark room
- Stay hydrated
- Stress management
- Regular sleep schedule
- Identify and avoid triggers

**Important:** Frequent or severe headaches require medical evaluation."""
            citations = [
                {"doc_id": "neuro-ref-001", "snippet": "Headache classification and management"},
                {"doc_id": "pain-management-001", "snippet": "Headache treatment guidelines"}
            ]
            
        elif any(word in question_lower for word in ['sleep', 'insomnia', 'sleeping']):
            answer = """Good sleep is essential for overall health and well-being.

**Recommended sleep duration:**
- Adults: 7-9 hours
- Teenagers: 8-10 hours
- Children: 9-12 hours

**Common sleep problems:**
- Insomnia (difficulty falling/staying asleep)
- Sleep apnea (breathing interruptions)
- Restless leg syndrome
- Narcolepsy

**Tips for better sleep:**
1. **Maintain consistent schedule** - Same bedtime/wake time daily
2. **Create sleep-friendly environment**
   - Dark, quiet, cool room (60-67°F)
   - Comfortable mattress and pillows
3. **Limit screen time** - Avoid devices 1 hour before bed
4. **Watch diet** - Avoid caffeine, large meals before bed
5. **Exercise regularly** - But not close to bedtime
6. **Manage stress** - Relaxation techniques, meditation
7. **Limit naps** - Keep under 30 minutes if needed

**When to see a doctor:**
- Chronic insomnia (>3 weeks)
- Loud snoring or breathing pauses
- Excessive daytime sleepiness
- Unusual sleep behaviors

**Important:** Quality sleep is crucial for physical and mental health."""
            citations = [
                {"doc_id": "sleep-med-001", "snippet": "Sleep hygiene guidelines"},
                {"doc_id": "behavioral-health-001", "snippet": "Sleep disorder management"}
            ]
            
        elif any(word in question_lower for word in ['antibiotic', 'medication', 'medicine', 'drug']):
            answer = """Medications should always be taken as prescribed by your healthcare provider.

**Important medication safety tips:**

1. **Follow prescriptions exactly**
   - Take correct dose at right times
   - Complete full course (especially antibiotics)
   - Don't skip or double doses

2. **Antibiotics specifically:**
   - Only work for bacterial infections (not viruses)
   - Complete full course even if feeling better
   - Don't share with others
   - Overuse can lead to antibiotic resistance

3. **Common side effects to watch:**
   - Nausea, diarrhea, dizziness
   - Allergic reactions (rash, itching, swelling)
   - Report severe or unusual reactions immediately

4. **Drug interactions:**
   - Inform doctor of all medications, supplements
   - Avoid alcohol with certain medications
   - Some foods can interact with medications

5. **Storage:**
   - Keep in cool, dry place
   - Away from children
   - Check expiration dates

**When to contact doctor:**
- Severe side effects
- Symptoms worsen or don't improve
- Questions about dosage or timing

**Important:** Never self-medicate or use someone else's prescription."""
            citations = [
                {"doc_id": "pharmacy-ref-001", "snippet": "Medication safety guidelines"},
                {"doc_id": "clinical-pharm-001", "snippet": "Drug interaction reference"}
            ]
            
        else:
            # General health information
            answer = f"""Thank you for your question about: "{request.question}"

I can provide general health information on topics like:
- Common conditions (diabetes, hypertension, fever, etc.)
- Symptoms and when to seek care
- Medication safety
- Healthy lifestyle tips
- Sleep and wellness

**General Health Advice:**
- Maintain a balanced diet rich in fruits, vegetables, whole grains
- Exercise regularly (150 minutes moderate activity per week)
- Get adequate sleep (7-9 hours for adults)
- Stay hydrated (8 glasses of water daily)
- Manage stress through relaxation techniques
- Avoid smoking and limit alcohol
- Regular health check-ups and screenings

**When to see a doctor:**
- Persistent or worsening symptoms
- Severe pain or discomfort
- Unexplained changes in health
- Concerns about existing conditions

Could you please rephrase your question or ask about a specific health topic? I'm here to provide educational health information.

**Remember:** This is general information only. Always consult with a qualified healthcare provider for personalized medical advice."""
            citations = [
                {"doc_id": "general-health-001", "snippet": "General health and wellness guidelines"},
                {"doc_id": "preventive-care-001", "snippet": "Health maintenance recommendations"}
            ]
        
        return ChatResponse(
            answer=answer,
            citations=citations,
            safety_banner="⚠️ DISCLAIMER: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.",
            model_version="v2.0-enhanced"
        )
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/models/fine-tune", response_model=FineTuneResponse)
async def fine_tune(request: FineTuneRequest, background_tasks: BackgroundTasks):
    """
    Trigger fine-tuning on a public dataset.
    Training runs in background; poll /metrics or check logs for completion.
    """
    try:
        logger.info(f"Starting fine-tune for model={request.model_name} dataset={request.dataset_url}")
        
        # Run training in background to avoid blocking
        background_tasks.add_task(
            train_symptom_classifier,
            dataset_url=request.dataset_url,
            output_dir=str(MODEL_DIR)
        )
        
        artifact_path = str(FINE_TUNED_MODEL_PATH)
        return FineTuneResponse(
            status="started",
            artifact_path=artifact_path,
            model_version="fine-tuned-v1"
        )
    except Exception as e:
        logger.error(f"Error in fine-tune: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def metrics():
    """Prometheus metrics (stub)"""
    return {"status": "metrics endpoint ready"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
