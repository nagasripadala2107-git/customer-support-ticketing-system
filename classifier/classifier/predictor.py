"""
NLP Ticket Classifier Engine
Uses TF-IDF (Term Frequency - Inverse Document Frequency) + Logistic Regression.
Provides probabilistic classification across 7 defined support categories.
"""

import re
from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from model.dataset import TRAINING_DATA

CATEGORIES = [
    "BILLING",
    "TECHNICAL_SUPPORT",
    "ACCOUNT_ACCESS",
    "SHIPPING",
    "REFUND",
    "PRODUCT_ISSUE",
    "GENERAL_INQUIRY"
]

CATEGORY_ROUTING_MAP = {
    "BILLING": "Billing & Finance Team",
    "TECHNICAL_SUPPORT": "Technical Support Team",
    "ACCOUNT_ACCESS": "Account & Security Team",
    "SHIPPING": "Shipping & Logistics Team",
    "REFUND": "Billing & Finance Team",
    "PRODUCT_ISSUE": "Product Engineering Team",
    "GENERAL_INQUIRY": "Technical Support Team"
}

def clean_text(text: str) -> str:
    """Preprocess text: lowercase, remove non-alphanumeric noise, collapse whitespace."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

class TicketClassifier:
    def __init__(self):
        self.pipeline: Pipeline = None
        self.is_trained: bool = False
        self._train_model()

    def _train_model(self):
        """Train the TF-IDF + Logistic Regression pipeline on the curated dataset."""
        corpus = []
        labels = []
        for subject, description, category in TRAINING_DATA:
            full_text = f"{clean_text(subject)} {clean_text(description)}"
            corpus.append(full_text)
            labels.append(category)

        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=2500,
                sublinear_tf=True,
                stop_words="english"
            )),
            ("clf", LogisticRegression(
                C=2.5,
                max_iter=500,
                multi_class="multinomial",
                random_state=42
            ))
        ])

        self.pipeline.fit(corpus, labels)
        self.is_trained = True

    def predict(self, subject: str, description: str) -> Dict[str, Any]:
        """
        Classifies incoming ticket text into one of 7 categories.
        Returns category, confidence, target_team, and full probability breakdown.
        """
        if not self.is_trained:
            self._train_model()

        combined_text = f"{clean_text(subject)} {clean_text(description)}"
        if not combined_text.strip():
            return {
                "category": "GENERAL_INQUIRY",
                "confidence": 0.50,
                "target_team": CATEGORY_ROUTING_MAP["GENERAL_INQUIRY"],
                "probabilities": {cat: 1.0 / len(CATEGORIES) for cat in CATEGORIES},
                "status": "FALLBACK_EMPTY_INPUT"
            }

        try:
            probas = self.pipeline.predict_proba([combined_text])[0]
            classes = self.pipeline.classes_
            
            prob_dict = {str(cls_name): float(np.round(prob, 4)) for cls_name, prob in zip(classes, probas)}
            
            # Find best class
            best_idx = int(np.argmax(probas))
            best_category = str(classes[best_idx])
            best_confidence = float(np.round(probas[best_idx], 4))

            # Explain top contributing tokens
            top_tokens = self._extract_top_tokens(combined_text, best_category)

            return {
                "category": best_category,
                "confidence": best_confidence,
                "target_team": CATEGORY_ROUTING_MAP.get(best_category, "General Support Team"),
                "probabilities": prob_dict,
                "top_tokens": top_tokens,
                "status": "CLASSIFIED"
            }
        except Exception as e:
            return {
                "category": "GENERAL_INQUIRY",
                "confidence": 0.40,
                "target_team": CATEGORY_ROUTING_MAP["GENERAL_INQUIRY"],
                "probabilities": {cat: 0.14 for cat in CATEGORIES},
                "status": f"CLASSIFIER_EXCEPTION: {str(e)}"
            }

    def _extract_top_tokens(self, text: str, category: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Identify which words in the input text had the highest TF-IDF weights."""
        try:
            tfidf: TfidfVectorizer = self.pipeline.named_steps["tfidf"]
            clf: LogisticRegression = self.pipeline.named_steps["clf"]

            feature_names = tfidf.get_feature_names_out()
            feature_idx = {word: idx for idx, word in enumerate(feature_names)}
            
            words = text.split()
            cat_idx = list(clf.classes_).index(category)
            coefficients = clf.coef_[cat_idx]

            scores = []
            for w in set(words):
                if w in feature_idx:
                    idx = feature_idx[w]
                    score = float(coefficients[idx])
                    scores.append({"token": w, "weight": round(score, 3)})

            scores.sort(key=lambda x: x["weight"], reverse=True)
            return scores[:top_k]
        except Exception:
            return []

# Singleton instance
classifier_instance = TicketClassifier()
