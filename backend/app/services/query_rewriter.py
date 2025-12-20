"""
query_rewriter.py

Why:
-----
Query rewriting improves follow-up questions,
but must NEVER be a single point of failure.

How:
-----
- Attempt rewrite
- If LLM fails, fall back to original question
"""

from loguru import logger
from app.services.llm_factory import get_llm


def rewrite_query(history: list[dict], question: str) -> str:
    """
    Rewrites a follow-up question into a standalone question.
    Falls back safely if LLM is unavailable.
    """

    if not history:
        return question

    prompt = f"""
Given the conversation history and the latest question,
rewrite the question to be fully self-contained.

History:
{history}

Question:
{question}

Rewritten question:
"""

    try:
        llm = get_llm(temperature=0.0)
        response = llm.invoke(prompt)
        return response.content.strip()

    except Exception as e:
        logger.warning(
            f"Query rewriting failed, using original question: {e}"
        )
        return question
