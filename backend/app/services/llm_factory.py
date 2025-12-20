"""
llm_factory.py

Why:
-----
LLM providers fail (quota, latency, outages).
This factory provides automatic fallback.

How:
-----
- Primary: OpenAI
- Fallback: Groq
- Fail-safe behavior
"""

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from loguru import logger

from app.core.config import (
    OPENAI_API_KEY,
    OPENAI_MODEL,
    GROQ_API_KEY,
    GROQ_MODEL,
    LLM_PROVIDER
)


def get_llm(temperature: float = 0.0):
    """
    Returns an LLM instance with fallback handling.
    """

    try:
        if LLM_PROVIDER == "openai":
            return ChatOpenAI(
                api_key=OPENAI_API_KEY,
                model=OPENAI_MODEL,
                temperature=temperature,
                timeout=30
            )

        if LLM_PROVIDER == "groq":
            return ChatGroq(
                api_key=GROQ_API_KEY,
                model=GROQ_MODEL,
                temperature=temperature
            )

    except Exception as e:
        logger.warning(f"Primary LLM init failed: {e}")

    # ---- Fallback ----
    logger.warning("Falling back to Groq LLM")
    return ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        temperature=temperature
    )
