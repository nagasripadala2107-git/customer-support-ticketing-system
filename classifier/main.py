"""
Customer Support Ticketing System - Python AI Classifier Service
FastAPI REST API
Port: 8000
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from classifier.predictor import classifier_instance, CATEGORIES, CATEGORY_ROUTING_MAP

app = FastAPI(
    title="Support Ticket NLP Classifier API",
    description="Machine Learning service utilizing TF-IDF and Logistic Regression for automated support ticket classification & routing.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    subject: str = Field(..., example="Payment deducted twice")
    description: str = Field(..., example="I purchased a product but my account was charged two times on my credit card.")

class PredictResponse(BaseModel):
    category: str
    confidence: float
    target_team: str
    probabilities: Dict[str, float]
    top_tokens: Optional[List[Dict[str, Any]]] = None
    status: str

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Ticket Classifier Microservice",
        "model_status": "TRAINED" if classifier_instance.is_trained else "INITIALIZING",
        "supported_categories": CATEGORIES
    }

@app.post("/predict", response_model=PredictResponse)
def predict_category(request: PredictRequest):
    """
    Classifies incoming ticket text and predicts category + confidence.
    Used by Java Spring Boot backend for automated classification.
    """
    if not request.subject and not request.description:
        raise HTTPException(status_code=400, detail="Subject and description cannot both be empty")

    result = classifier_instance.predict(request.subject, request.description)
    return result

@app.get("/categories")
def get_categories():
    return {
        "categories": CATEGORIES,
        "routing_map": CATEGORY_ROUTING_MAP
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
