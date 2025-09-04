import re, os
from transformers import pipeline
from sentence_transformers import SentenceTransformer

PHONE_RE = re.compile(r'(\+?\d[\d\-\s]{7,}\d)')
EMAIL_RE = re.compile(r'[\w\.-]+@[\w\.-]+')

PRIORITY_KEYWORDS = {
    'immediately': 5, 'urgent': 5, 'asap': 4,
    'cannot access': 4, 'down': 4, 'critical': 5,
    'payment failed': 4, 'unable to login': 4
}

_sent_pipeline = None
_embed_model = None

def get_sentiment_pipeline():
    global _sent_pipeline
    if _sent_pipeline is None:
        model = os.getenv("HF_SENTIMENT_MODEL","distilbert-base-uncased-finetuned-sst-2-english")
        _sent_pipeline = pipeline("sentiment-analysis", model=model)
    return _sent_pipeline

def extract_info(text: str):
    phones = PHONE_RE.findall(text or "")
    emails = list(set(EMAIL_RE.findall(text or "")))
    products = list({w for w in re.findall(r'\b([A-Z][A-Za-z0-9\-]{2,})\b', text or "")})
    return {"phones": phones, "emails": emails, "products": products}

def analyze_sentiment_priority(text: str):
    sent_pipe = get_sentiment_pipeline()
    preview = text[:1000] if text else ""
    try:
        r = sent_pipe(preview)
        label = r[0]['label']
        score = float(r[0]['score'])
    except:
        label, score = "NEUTRAL", 0.0
    s = 0
    t = (text or "").lower()
    for k,v in PRIORITY_KEYWORDS.items():
        if k in t: s += v
    if label.upper().startswith("NEG"): s += 2
    return {"label": label, "score": score}, int(s)
