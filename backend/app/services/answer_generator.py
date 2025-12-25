# backend/app/services/answer_generator.py

"""
Groq-based answer & summary generation.
STRICTLY document-grounded with forced citations.
"""

from typing import List, Dict
from loguru import logger

from langchain_core.messages import SystemMessage, HumanMessage
from app.services.llm import get_llm


def generate_answer(
    prompt: str,
    evidence_chunks: List[Dict],
    mode: str = "qa",
) -> str:
    """
    Generate an answer or summary strictly from document evidence.
    """

    if not evidence_chunks:
        return "No relevant content found in the uploaded documents."

    # -----------------------------
    # Source-labeled context
    # -----------------------------
    context_blocks: List[str] = []

    for idx, chunk in enumerate(evidence_chunks):
        text = (
            chunk.get("metadata", {}).get("text")
            or chunk.get("text", "")
        )

        if text and text.strip():
            context_blocks.append(
                f"[Source {idx + 1}]\n{text.strip()}"
            )

    if not context_blocks:
        return "No relevant content found in the uploaded documents."

    max_blocks = 15 if mode == "qa" else 60
    context = "\n\n".join(context_blocks[:max_blocks])

    llm = get_llm()

    # =============================
    # SUMMARY MODE
    # =============================
    if mode == "summary":
        system_prompt = f"""
You are an expert technical analyst.

Use ONLY the provided context.

Every factual sentence MUST end with a citation [Source X].

If information is missing, explicitly state:
"Information not available in provided documents."

CONTEXT:
{context}
"""
        user_prompt = prompt

    # =============================
    # Q&A MODE
    # =============================
    else:
        system_prompt = f"""
You are a Document Q&A Engine.

RULES:
- Use ONLY the provided context.
- EVERY sentence MUST end with [Source X].
- If the answer is missing, say:
  "I'm sorry, the documents do not contain information regarding this."

FORMAT:
Direct Answer:
Explanation:
Sources Used:

CONTEXT:
{context}
"""
        user_prompt = prompt

    try:
        response = llm.invoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ]
        )

        return response.content.strip()

    except Exception:
        logger.exception("Groq LLM failed")
        return "LLM failed while processing the document."
