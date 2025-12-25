# app/core/config.py
"""
Configuration with HF Spaces secrets support.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# Groq LLM
# =========================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not set. "
        "Add it to HF Spaces Secrets or .env file"
    )

# =========================
# Pinecone
# =========================
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1-aws")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "document-rag")

if not PINECONE_API_KEY:
    raise RuntimeError(
        "PINECONE_API_KEY is not set. "
        "Add it to HF Spaces Secrets or .env file"
    )

# =========================
# Backend URL (for CORS)
# =========================
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:7860")

APP_NAME = "AI Document RAG System"