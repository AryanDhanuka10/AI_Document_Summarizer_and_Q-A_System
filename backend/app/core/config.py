"""
config.py

Centralized application configuration.
Groq + Pinecone only.
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
    raise RuntimeError("GROQ_API_KEY is not set")

# =========================
# Pinecone
# =========================

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV", "us-east-1")
PINECONE_INDEX_NAME = os.getenv(
    "PINECONE_INDEX_NAME",
    "document-rag",
)

if not PINECONE_API_KEY:
    raise RuntimeError("PINECONE_API_KEY is not set")

APP_NAME = "AI Document RAG System"
