"""
answer_generator.py

Why:
-----
LLMs can fail due to quota or network issues.
The system must degrade gracefully.

How:
-----
- Try LLM
- If it fails, return extractive fallback
"""

from loguru import logger
from app.services.llm_factory import get_llm
from app.utils.prompts import ANSWER_PROMPT


def generate_answer(question: str, evidence_chunks: list[dict]) -> str:
    """
    Generates a grounded answer using retrieved evidence.
    """

    context = "\n\n".join(
        c["metadata"]["text"] for c in evidence_chunks
    )

    prompt = ANSWER_PROMPT.format(
        context=context,
        question=question
    )

    try:
        llm = get_llm(temperature=0.0)
        response = llm.invoke(prompt)
        return response.content.strip()

    except Exception as e:
        logger.error(f"LLM generation failed: {e}")

        # ---- Fallback: Extractive Answer ----
        fallback = (
            "⚠️ LLM unavailable. Relevant document excerpts:\n\n"
            + "\n\n".join(
                f"- {c['metadata']['text'][:300]}..."
                for c in evidence_chunks
            )
        )

        return fallback
