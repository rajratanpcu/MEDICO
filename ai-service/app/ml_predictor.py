"""
Advanced ML-based Symptom Predictor
Uses TF-IDF vectorization and ensemble methods for improved accuracy
"""
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import logging
from typing import List, Dict, Tuple
import pickle
from pathlib import Path

logger = logging.getLogger(__name__)

class MLSymptomPredictor:
    """
    Machine Learning based symptom predictor using TF-IDF and Random Forest
    """
    
    def __init__(self, knowledge_base: Dict):
        self.knowledge_base = knowledge_base
        self.vectorizer = TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),  # Unigrams and bigrams
            max_features=200
        )
        self.classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.label_encoder = LabelEncoder()
        self.is_trained = False
        
    def prepare_training_data(self) -> Tuple[List[str], List[str]]:
        """
        Prepare training data from knowledge base
        Returns: (symptom_combinations, condition_labels)
        """
        X_text = []
        y_labels = []
        
        for condition_name, condition_data in self.knowledge_base.items():
            symptoms = condition_data["symptoms"]
            
            # Generate multiple training examples per condition
            # Full symptom set
            X_text.append(" ".join(symptoms).lower())
            y_labels.append(condition_name)
            
            # Subset combinations (for partial matching)
            if len(symptoms) >= 3:
                # Take 70% of symptoms
                subset_size = max(3, int(len(symptoms) * 0.7))
                symptom_subset = symptoms[:subset_size]
                X_text.append(" ".join(symptom_subset).lower())
                y_labels.append(condition_name)
                
                # Take different 70% subset
                symptom_subset2 = symptoms[-subset_size:]
                X_text.append(" ".join(symptom_subset2).lower())
                y_labels.append(condition_name)
        
        return X_text, y_labels
    
    def train(self):
        """Train the ML model on the knowledge base"""
        logger.info("Training ML symptom predictor...")
        
        X_text, y_labels = self.prepare_training_data()
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y_labels)
        
        # Vectorize text
        X_vectorized = self.vectorizer.fit_transform(X_text)
        
        # Train classifier
        self.classifier.fit(X_vectorized, y_encoded)
        
        self.is_trained = True
        logger.info(f"Model trained on {len(X_text)} examples covering {len(self.knowledge_base)} conditions")
    
    def predict_with_ml(self, symptoms: List[str], top_k: int = 3) -> List[Dict]:
        """
        Predict conditions using ML model
        
        Returns:
            List of predictions with probabilities
        """
        if not self.is_trained:
            self.train()
        
        # Prepare input
        symptom_text = " ".join(symptoms).lower()
        X_input = self.vectorizer.transform([symptom_text])
        
        # Get predictions with probabilities
        probabilities = self.classifier.predict_proba(X_input)[0]
        
        # Get top K predictions
        top_indices = np.argsort(probabilities)[-top_k:][::-1]
        
        predictions = []
        for idx in top_indices:
            if probabilities[idx] > 0.05:  # Minimum confidence threshold
                condition_name = self.label_encoder.inverse_transform([idx])[0]
                condition_data = self.knowledge_base[condition_name]
                
                predictions.append({
                    "name": condition_name,
                    "confidence": float(probabilities[idx]),
                    "description": condition_data["description"],
                    "severity": condition_data["severity"],
                    "urgency": condition_data["urgency"],
                    "recommendations": condition_data["recommendations"]
                })
        
        return predictions if predictions else []
    
    def save_model(self, path: str):
        """Save trained model to disk"""
        if not self.is_trained:
            logger.warning("Model not trained, cannot save")
            return
        
        model_data = {
            "vectorizer": self.vectorizer,
            "classifier": self.classifier,
            "label_encoder": self.label_encoder,
            "knowledge_base": self.knowledge_base
        }
        
        with open(path, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Model saved to {path}")
    
    @classmethod
    def load_model(cls, path: str):
        """Load trained model from disk"""
        with open(path, 'rb') as f:
            model_data = pickle.load(f)
        
        predictor = cls(model_data["knowledge_base"])
        predictor.vectorizer = model_data["vectorizer"]
        predictor.classifier = model_data["classifier"]
        predictor.label_encoder = model_data["label_encoder"]
        predictor.is_trained = True
        
        logger.info(f"Model loaded from {path}")
        return predictor


class HybridPredictor:
    """
    Hybrid predictor combining rule-based and ML approaches
    """
    
    def __init__(self, rule_based_predictor, ml_predictor):
        self.rule_based = rule_based_predictor
        self.ml_predictor = ml_predictor
    
    def predict(self, symptoms: List[str], demographics: dict = None) -> Dict:
        """
        Combine predictions from both approaches
        
        Args:
            symptoms: List of symptom strings
            demographics: Optional demographic info
            
        Returns:
            Combined prediction results
        """
        # Get ML predictions
        try:
            ml_predictions = self.ml_predictor.predict_with_ml(symptoms, top_k=5)
        except Exception as e:
            logger.warning(f"ML prediction failed: {e}, falling back to rule-based")
            ml_predictions = []
        
        # Get rule-based predictions
        rule_predictions = self.rule_based.predict(symptoms, demographics)
        
        # Combine and re-rank predictions
        combined_conditions = {}
        
        # Add ML predictions (weighted higher)
        for pred in ml_predictions:
            name = pred["name"]
            combined_conditions[name] = {
                **pred,
                "confidence": pred["confidence"] * 0.7,  # 70% weight for ML
                "source": "ml"
            }
        
        # Add/merge rule-based predictions
        for pred in rule_predictions.get("conditions", []):
            name = pred["name"]
            if name in combined_conditions:
                # Average the scores
                combined_conditions[name]["confidence"] = (
                    combined_conditions[name]["confidence"] + pred["confidence"] * 0.3
                )
                combined_conditions[name]["source"] = "hybrid"
            else:
                combined_conditions[name] = {
                    **pred,
                    "confidence": pred["confidence"] * 0.3,  # 30% weight for rules
                    "source": "rules"
                }
        
        # Sort by confidence
        sorted_conditions = sorted(
            combined_conditions.values(),
            key=lambda x: x["confidence"],
            reverse=True
        )[:3]
        
        # Normalize confidences to sum to 1
        total_conf = sum(c["confidence"] for c in sorted_conditions)
        if total_conf > 0:
            for condition in sorted_conditions:
                condition["confidence"] = round(condition["confidence"] / total_conf, 3)
        
        # Determine urgency from top condition
        urgency = sorted_conditions[0]["urgency"] if sorted_conditions else "non-urgent"
        
        # Aggregate recommendations
        all_recs = []
        seen = set()
        for condition in sorted_conditions[:2]:
            for rec in condition["recommendations"]:
                if rec not in seen:
                    all_recs.append(rec)
                    seen.add(rec)
        
        urgency_descriptions = {
            "non-urgent": "Symptoms appear manageable. Monitor and seek care if they worsen.",
            "urgent": "You should see a healthcare provider within 24 hours.",
            "emergency": "⚠️ SEEK IMMEDIATE MEDICAL ATTENTION. This may be a medical emergency."
        }
        
        return {
            "conditions": [
                {
                    "name": c["name"],
                    "confidence": c["confidence"],
                    "description": c["description"]
                }
                for c in sorted_conditions
            ],
            "recommendations": all_recs[:5],
            "urgency": urgency,
            "urgencyDescription": urgency_descriptions.get(urgency, "")
        }
