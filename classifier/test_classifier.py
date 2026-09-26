"""
Unit tests for Ticket Classifier.
Run with: pytest test_classifier.py
"""

from classifier.predictor import TicketClassifier, clean_text

def test_clean_text():
    raw = "Hello World! @#$ 123"
    cleaned = clean_text(raw)
    assert cleaned == "hello world 123"

def test_billing_classification():
    clf = TicketClassifier()
    result = clf.predict("Payment deducted twice", "I purchased a product but my account was charged two times.")
    assert result["category"] == "BILLING"
    assert result["confidence"] > 0.70
    assert "Billing" in result["target_team"]

def test_tech_support_classification():
    clf = TicketClassifier()
    result = clf.predict("The application crashes when I upload a file", "Whenever we upload a CSV file the system throws 500 error.")
    assert result["category"] == "TECHNICAL_SUPPORT"
    assert result["confidence"] > 0.65

def test_fallback_empty():
    clf = TicketClassifier()
    result = clf.predict("", "")
    assert result["category"] == "GENERAL_INQUIRY"
