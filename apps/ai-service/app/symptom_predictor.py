"""
Medical Symptom Prediction System
Uses medical knowledge base and ML-based similarity matching
"""
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

# Medical Knowledge Base - Comprehensive collection of conditions
MEDICAL_KNOWLEDGE = {
    # Respiratory Conditions
    "Common Cold": {
        "symptoms": ["Runny Nose", "Sneezing", "Sore Throat", "Mild Fever", "Cough", "Fatigue", "Nasal Congestion"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "A viral infection of the upper respiratory tract.",
        "recommendations": [
            "Get plenty of rest",
            "Stay hydrated with water and warm fluids",
            "Use over-the-counter decongestants if needed",
            "Gargle with salt water for sore throat"
        ]
    },
    "Influenza (Flu)": {
        "symptoms": ["High Fever", "Chills", "Body Aches", "Fatigue", "Headache", "Cough", "Sore Throat"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "A viral infection that attacks the respiratory system.",
        "recommendations": [
            "Rest and drink plenty of fluids",
            "Take antiviral medication if prescribed within 48 hours",
            "Use acetaminophen or ibuprofen for fever and aches",
            "Stay home to avoid spreading infection"
        ]
    },
    "COVID-19": {
        "symptoms": ["Fever", "Dry Cough", "Fatigue", "Loss of Taste", "Loss of Smell", "Shortness of Breath", "Body Aches"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Viral respiratory illness caused by SARS-CoV-2.",
        "recommendations": [
            "Get tested for COVID-19",
            "Isolate from others",
            "Monitor oxygen levels if available",
            "Seek immediate care if breathing becomes difficult"
        ]
    },
    "Pneumonia": {
        "symptoms": ["High Fever", "Cough", "Chest Pain", "Shortness of Breath", "Chills", "Fatigue"],
        "severity": "severe",
        "urgency": "emergency",
        "description": "Infection that inflames air sacs in one or both lungs.",
        "recommendations": [
            "Seek immediate medical attention",
            "Get chest X-ray and medical evaluation",
            "May require antibiotics or hospitalization",
            "Monitor breathing and oxygen levels"
        ]
    },
    "Bronchitis": {
        "symptoms": ["Persistent Cough", "Mucus Production", "Chest Discomfort", "Fatigue", "Mild Fever", "Shortness of Breath"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Inflammation of the bronchial tubes.",
        "recommendations": [
            "Rest and drink plenty of fluids",
            "Use a humidifier",
            "Take cough suppressants if recommended",
            "See doctor if symptoms persist beyond 3 weeks"
        ]
    },
    "Asthma Attack": {
        "symptoms": ["Wheezing", "Shortness of Breath", "Chest Tightness", "Cough", "Difficulty Speaking"],
        "severity": "severe",
        "urgency": "emergency",
        "description": "Sudden worsening of asthma symptoms.",
        "recommendations": [
            "Use rescue inhaler immediately",
            "Sit upright and stay calm",
            "Seek emergency care if no improvement",
            "Call 911 if severe breathing difficulty"
        ]
    },
    
    # Neurological Conditions
    "Migraine": {
        "symptoms": ["Severe Headache", "Nausea", "Vomiting", "Light Sensitivity", "Sound Sensitivity"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "A neurological condition characterized by intense, debilitating headaches.",
        "recommendations": [
            "Rest in a quiet, dark room",
            "Apply cold or warm compress to head or neck",
            "Take prescribed migraine medication early",
            "Stay hydrated and avoid triggers"
        ]
    },
    "Tension Headache": {
        "symptoms": ["Mild to Moderate Headache", "Pressure Around Forehead", "Neck Stiffness", "Fatigue"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "Most common type of headache caused by muscle tension.",
        "recommendations": [
            "Take over-the-counter pain relievers",
            "Apply heat or cold to head/neck",
            "Practice relaxation techniques",
            "Improve posture and take breaks"
        ]
    },
    "Vertigo": {
        "symptoms": ["Dizziness", "Spinning Sensation", "Nausea", "Balance Problems", "Vomiting"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Sensation that you or your surroundings are spinning.",
        "recommendations": [
            "Sit or lie down immediately",
            "Avoid sudden movements",
            "See doctor for proper diagnosis",
            "May need vestibular rehabilitation"
        ]
    },
    
    # Gastrointestinal Conditions
    "Gastroenteritis": {
        "symptoms": ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Fever", "Fatigue"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Inflammation of the digestive tract, often called stomach flu.",
        "recommendations": [
            "Stay hydrated with clear fluids",
            "Eat bland foods (BRAT diet: bananas, rice, applesauce, toast)",
            "Rest and avoid solid foods initially",
            "Seek care if symptoms persist beyond 48 hours"
        ]
    },
    "Appendicitis": {
        "symptoms": ["Severe Abdominal Pain", "Nausea", "Vomiting", "Fever", "Loss of Appetite"],
        "severity": "severe",
        "urgency": "emergency",
        "description": "Inflammation of the appendix requiring surgical intervention.",
        "recommendations": [
            "Seek emergency medical care immediately",
            "Do not eat or drink",
            "Avoid pain medication before medical evaluation",
            "Prepare for possible emergency surgery"
        ]
    },
    "Food Poisoning": {
        "symptoms": ["Nausea", "Vomiting", "Diarrhea", "Abdominal Cramps", "Fever", "Weakness"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Illness caused by consuming contaminated food or water.",
        "recommendations": [
            "Stay hydrated with electrolyte solutions",
            "Rest and avoid solid foods",
            "Let illness run its course (usually 24-48 hours)",
            "Seek care if severe dehydration or bloody stool"
        ]
    },
    "GERD": {
        "symptoms": ["Heartburn", "Chest Pain", "Difficulty Swallowing", "Regurgitation", "Chronic Cough"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "Chronic acid reflux affecting the esophagus.",
        "recommendations": [
            "Avoid trigger foods (spicy, fatty, acidic)",
            "Eat smaller meals",
            "Don't lie down immediately after eating",
            "Take antacids or prescribed medications"
        ]
    },
    
    # Infectious Diseases
    "Strep Throat": {
        "symptoms": ["Severe Sore Throat", "Fever", "Swollen Lymph Nodes", "Headache", "Rash"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Bacterial infection of the throat requiring antibiotic treatment.",
        "recommendations": [
            "See a doctor for throat culture and antibiotics",
            "Gargle with warm salt water",
            "Take pain relievers for discomfort",
            "Complete full course of antibiotics if prescribed"
        ]
    },
    "Urinary Tract Infection": {
        "symptoms": ["Painful Urination", "Frequent Urination", "Cloudy Urine", "Lower Abdominal Pain", "Fever"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Bacterial infection of the urinary system.",
        "recommendations": [
            "See doctor for urine test and antibiotics",
            "Drink plenty of water",
            "Avoid caffeine and alcohol",
            "Complete full course of antibiotics"
        ]
    },
    "Mononucleosis": {
        "symptoms": ["Extreme Fatigue", "Sore Throat", "Fever", "Swollen Lymph Nodes", "Rash"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Viral infection commonly known as 'mono' or 'kissing disease'.",
        "recommendations": [
            "Get plenty of rest (may take weeks to recover)",
            "Stay hydrated",
            "Avoid contact sports (risk of spleen rupture)",
            "Take pain relievers for discomfort"
        ]
    },
    
    # Allergic/Immunological
    "Allergic Rhinitis": {
        "symptoms": ["Sneezing", "Runny Nose", "Itchy Eyes", "Nasal Congestion", "Fatigue"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "Allergic reaction causing inflammation of the nasal passages.",
        "recommendations": [
            "Avoid known allergens",
            "Use antihistamine medications",
            "Consider nasal corticosteroid sprays",
            "Keep windows closed during high pollen days"
        ]
    },
    "Anaphylaxis": {
        "symptoms": ["Difficulty Breathing", "Swelling", "Rapid Pulse", "Dizziness", "Nausea", "Skin Rash"],
        "severity": "severe",
        "urgency": "emergency",
        "description": "Severe, life-threatening allergic reaction.",
        "recommendations": [
            "Use EpiPen immediately if available",
            "Call 911 immediately",
            "Lie down with legs elevated",
            "Do not stand up suddenly"
        ]
    },
    
    # Dermatological
    "Contact Dermatitis": {
        "symptoms": ["Skin Rash", "Itching", "Redness", "Swelling", "Blisters"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "Skin inflammation caused by contact with an irritant or allergen.",
        "recommendations": [
            "Identify and avoid the trigger",
            "Apply cool compresses",
            "Use hydrocortisone cream",
            "Take antihistamines for itching"
        ]
    },
    "Shingles": {
        "symptoms": ["Painful Rash", "Burning Sensation", "Blisters", "Fever", "Headache", "Sensitivity to Touch"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Viral infection causing a painful rash, caused by varicella-zoster virus.",
        "recommendations": [
            "See doctor within 72 hours for antiviral treatment",
            "Keep rash clean and covered",
            "Use pain medication as needed",
            "Avoid contact with pregnant women and immunocompromised"
        ]
    },
    
    # Musculoskeletal
    "Muscle Strain": {
        "symptoms": ["Muscle Pain", "Swelling", "Limited Range of Motion", "Bruising", "Muscle Weakness"],
        "severity": "mild",
        "urgency": "non-urgent",
        "description": "Injury to muscle or tendon from overexertion or improper use.",
        "recommendations": [
            "Rest and avoid activities that cause pain",
            "Apply ice for first 48 hours",
            "Use compression bandage",
            "Elevate affected area"
        ]
    },
    "Arthritis Flare": {
        "symptoms": ["Joint Pain", "Stiffness", "Swelling", "Reduced Range of Motion", "Fatigue"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Inflammation of joints causing pain and stiffness.",
        "recommendations": [
            "Rest affected joints",
            "Apply heat or cold therapy",
            "Take anti-inflammatory medication",
            "Gentle exercises to maintain mobility"
        ]
    },
    
    # Cardiovascular (Warning Conditions)
    "Heart Attack": {
        "symptoms": ["Chest Pain", "Shortness of Breath", "Nausea", "Cold Sweat", "Pain in Arm/Jaw", "Dizziness"],
        "severity": "severe",
        "urgency": "emergency",
        "description": "Blockage of blood flow to the heart muscle.",
        "recommendations": [
            "Call 911 immediately",
            "Chew aspirin if not allergic",
            "Stay calm and sit down",
            "Do not drive yourself to hospital"
        ]
    },
    
    # Metabolic/Endocrine
    "Hypoglycemia": {
        "symptoms": ["Shakiness", "Sweating", "Confusion", "Rapid Heartbeat", "Dizziness", "Hunger"],
        "severity": "moderate",
        "urgency": "urgent",
        "description": "Low blood sugar, common in diabetics.",
        "recommendations": [
            "Consume 15g fast-acting carbohydrates immediately",
            "Check blood sugar after 15 minutes",
            "Repeat if still low",
            "Seek emergency care if unconscious"
        ]
    },
    "Dehydration": {
        "symptoms": ["Thirst", "Dry Mouth", "Fatigue", "Dizziness", "Dark Urine", "Decreased Urination"],
        "severity": "moderate",
        "urgency": "non-urgent",
        "description": "Excessive loss of body fluids.",
        "recommendations": [
            "Drink water or electrolyte solutions",
            "Rest in cool environment",
            "Avoid alcohol and caffeine",
            "Seek care if severe or not improving"
        ]
    }
}

# Symptom normalization mapping
SYMPTOM_ALIASES = {
    "runny nose": "Runny Nose",
    "stuffy nose": "Nasal Congestion",
    "blocked nose": "Nasal Congestion",
    "temperature": "Fever",
    "high temperature": "High Fever",
    "aches": "Body Aches",
    "muscle pain": "Body Aches",
    "tired": "Fatigue",
    "exhausted": "Fatigue",
    "throwing up": "Vomiting",
    "stomach pain": "Abdominal Pain",
    "belly pain": "Abdominal Pain",
    "difficulty breathing": "Shortness of Breath",
    "breathless": "Shortness of Breath",
}

class SymptomPredictor:
    """Predicts medical conditions based on symptoms"""
    
    def __init__(self):
        self.knowledge_base = MEDICAL_KNOWLEDGE
        logger.info(f"Initialized with {len(self.knowledge_base)} conditions")
    
    def normalize_symptom(self, symptom: str) -> str:
        """Normalize symptom text"""
        symptom_lower = symptom.lower().strip()
        return SYMPTOM_ALIASES.get(symptom_lower, symptom.title())
    
    def calculate_match_score(self, user_symptoms: List[str], condition_symptoms: List[str]) -> float:
        """Calculate how well user symptoms match a condition"""
        user_set = set(self.normalize_symptom(s) for s in user_symptoms)
        condition_set = set(condition_symptoms)
        
        # Jaccard similarity
        intersection = len(user_set & condition_set)
        union = len(user_set | condition_set)
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def predict(self, symptoms: List[str], demographics: dict = None) -> Dict:
        """
        Predict medical conditions based on symptoms
        
        Args:
            symptoms: List of symptom strings
            demographics: Optional demographic info (duration, severity, etc.)
            
        Returns:
            Dictionary with predictions and recommendations
        """
        if not symptoms:
            return {
                "conditions": [],
                "recommendations": ["Please provide your symptoms for analysis"],
                "urgency": "non-urgent",
                "urgencyDescription": "No symptoms provided"
            }
        
        # Calculate match scores for all conditions
        scored_conditions = []
        for condition_name, condition_data in self.knowledge_base.items():
            score = self.calculate_match_score(symptoms, condition_data["symptoms"])
            
            if score > 0:  # Only include if there's some match
                scored_conditions.append({
                    "name": condition_name,
                    "confidence": round(score, 3),
                    "description": condition_data["description"],
                    "severity": condition_data["severity"],
                    "urgency": condition_data["urgency"],
                    "recommendations": condition_data["recommendations"]
                })
        
        # Sort by confidence score
        scored_conditions.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Get top matches
        top_conditions = scored_conditions[:3]
        
        # Determine overall urgency (use most urgent from top matches)
        urgency_levels = {"non-urgent": 0, "urgent": 1, "emergency": 2}
        max_urgency = "non-urgent"
        urgency_descriptions = {
            "non-urgent": "Symptoms appear manageable. Monitor and seek care if they worsen or persist.",
            "urgent": "You should see a healthcare provider within 24 hours for evaluation.",
            "emergency": "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION. Go to emergency room or call emergency services."
        }
        
        for condition in top_conditions:
            if urgency_levels.get(condition["urgency"], 0) > urgency_levels.get(max_urgency, 0):
                max_urgency = condition["urgency"]
        
        # Aggregate recommendations from top conditions
        all_recommendations = []
        seen_recommendations = set()
        for condition in top_conditions[:2]:  # Top 2 conditions
            for rec in condition["recommendations"]:
                if rec not in seen_recommendations:
                    all_recommendations.append(rec)
                    seen_recommendations.add(rec)
        
        # Add general advice
        if max_urgency == "non-urgent":
            all_recommendations.append("Monitor your symptoms over the next 24-48 hours")
            all_recommendations.append("Stay hydrated and get adequate rest")
        
        return {
            "conditions": [
                {
                    "name": c["name"],
                    "confidence": c["confidence"],
                    "description": c["description"]
                }
                for c in top_conditions
            ],
            "recommendations": all_recommendations[:5],  # Limit to 5
            "urgency": max_urgency,
            "urgencyDescription": urgency_descriptions[max_urgency]
        }

# Global predictors
_rule_based_predictor = None
_ml_predictor = None
_hybrid_predictor = None

def get_predictor():
    """Get or create the hybrid symptom predictor instance"""
    global _rule_based_predictor, _ml_predictor, _hybrid_predictor
    
    if _hybrid_predictor is None:
        logger.info("Initializing Hybrid Symptom Predictor (Rule-Based + ML)...")
        
        # Create rule-based predictor
        _rule_based_predictor = SymptomPredictor()
        
        # Try to create ML predictor
        try:
            from app.ml_predictor import MLSymptomPredictor, HybridPredictor
            _ml_predictor = MLSymptomPredictor(MEDICAL_KNOWLEDGE)
            _ml_predictor.train()
            
            # Create hybrid predictor
            _hybrid_predictor = HybridPredictor(
                _rule_based_predictor,
                _ml_predictor
            )
            logger.info("✅ Hybrid Predictor initialized successfully (Rule-Based + Random Forest)")
        except Exception as e:
            logger.warning(f"ML predictor initialization failed: {e}, using rule-based only")
            _hybrid_predictor = _rule_based_predictor
    
    return _hybrid_predictor
