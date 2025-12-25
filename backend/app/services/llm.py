"""
llm.py

Groq-only LLM factory.
"""

from langchain_groq import ChatGroq
from app.core.config import GROQ_API_KEY, GROQ_MODEL


def get_llm() -> ChatGroq:
    """
    Returns a Groq-backed chat model.
    """

    return ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        temperature=0.2,
    )
