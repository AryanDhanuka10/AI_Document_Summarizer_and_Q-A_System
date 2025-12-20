"""
config.py

Centralized configuration management.
Fails fast if critical environment variables are missing.
"""

import os
from dotenv import load_dotenv

load_dotenv()


def _require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


# -------------------------------
# LLM Configuration
# -------------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "gpt-4o")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")

# -------------------------------
# Pinecone Configuration
# -------------------------------
PINECONE_API_KEY = _require_env("PINECONE_API_KEY")
PINECONE_ENV = _require_env("PINECONE_ENV")
