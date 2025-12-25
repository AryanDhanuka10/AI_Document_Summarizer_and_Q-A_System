# backend/app/services/query_rewriter.py

from typing import List, Dict
from app.services.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage


def rewrite_query(
    history: List[Dict],
    question: str,
) -> str:
    """
    Rewrites a follow-up question into a standalone query.
    """

    if not history:
        return question

    llm = get_llm()

    history_text = "\n".join(
        f"{m['role']}: {m['content']}" for m in history[-6:]
    )

    system_prompt = """
Given the conversation history and a follow-up question,
rewrite the question to be fully standalone.

RULES:
- Do NOT answer the question
- Do NOT add new information
- Output ONLY the rewritten question
"""

    response = llm.invoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=f"""
CHAT HISTORY:
{history_text}

FOLLOW-UP QUESTION:
{question}

REWRITTEN QUESTION:
"""
            ),
        ]
    )

    return response.content.strip()
