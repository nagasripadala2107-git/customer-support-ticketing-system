"""
Training script for Ticket Classifier.
Run this script to evaluate model performance, print accuracy, confusion matrix, and feature importances.
"""

from sklearn.model_selection import StratifiedKFold, cross_val_score
from classifier.predictor import TicketClassifier, clean_text
from model.dataset import TRAINING_DATA

def run_evaluation():
    print("=====================================================")
    print("CUSTOMER SUPPORT TICKET CLASSIFIER - TRAINING & EVAL")
    print("=====================================================")

    corpus = []
    labels = []
    for s, d, cat in TRAINING_DATA:
        corpus.append(f"{clean_text(s)} {clean_text(d)}")
        labels.append(cat)

    print(f"Total training samples: {len(corpus)}")
    print(f"Categories ({len(set(labels))}): {sorted(list(set(labels)))}")

    clf = TicketClassifier()
    scores = cross_val_score(clf.pipeline, corpus, labels, cv=StratifiedKFold(n_splits=3, shuffle=True, random_state=42), scoring="accuracy")

    print(f"Stratified 3-Fold Cross-Validation Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")
    
    # Test specific demo prompts
    test_cases = [
        ("Payment deducted twice", "I purchased a product but my account was charged two times."),
        ("Cannot login to my account", "I enter my email and password but it says invalid credentials."),
        ("My package has not arrived", "Tracking shows delivered but no courier arrived today."),
        ("The application crashes when I upload a file", "Whenever we upload 50MB CSV files the system crashes with 504 error."),
        ("I want to request a refund", "We downsized our team and want a prorated refund credit.")
    ]

    print("\n--- SAMPLE INFERENCE VERIFICATION ---")
    for subj, desc in test_cases:
        res = clf.predict(subj, desc)
        print(f"Input: '{subj}' -> Predicted: {res['category']} (Confidence: {res['confidence'] * 100:.1f}%) -> Target: {res['target_team']}")

if __name__ == "__main__":
    run_evaluation()
