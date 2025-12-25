# backend/app/api/routes/summarize_upload.py

from fastapi import APIRouter, HTTPException
from loguru import logger

from app.state.document_store import document_store
from app.services.answer_generator import generate_answer
from app.services.citation import build_citations
from app.services.retriever import HybridRetriever

router = APIRouter()


@router.post("/upload")
async def summarize_uploaded_documents(session_id: str):
    """
    Multi-level, citation-grounded document summarization.
    """

    all_chunks = document_store.get_all_chunks(session_id)

    if not all_chunks:
        raise HTTPException(
            status_code=400,
            detail="No documents uploaded for this session",
        )

    # 🔥 Multi-level summarization prompt
    summary_prompt = """
You are an expert technical analyst. Your task is to provide a multi-level
summary of the provided document chunks.

Structure your response as follows:

Executive Summary:
- A high-level 3-sentence overview for stakeholders.

Key Technical Pillars:
- Identify the 3–5 main themes or arguments.

Deep-Dive Analysis:
- One detailed paragraph per pillar.

Data & Evidence:
- Specific metrics, dates, certifications, IDs, clauses.

STRICT RULES:
- Use ONLY the provided context.
- Every factual sentence MUST end with a citation like [Source X].
- If data is missing, say "Information not available in provided documents."
- Maintain a professional, objective tone.
"""

    try:
        # 🔍 Retrieve representative chunks (critical)
        retriever = HybridRetriever(all_chunks)
        representative_chunks = retriever.search(
            query="document summary main topics technical details evidence",
            top_k=15,
        )

        logger.info(
            f"[{session_id}] Summarizing {len(representative_chunks)} chunks"
        )

        summary = generate_answer(
            prompt=summary_prompt,
            evidence_chunks=representative_chunks,
            mode="summary",
        )

        citations = build_citations(representative_chunks)

        return {
            "summary": summary,
            "citations": citations,
            "document_count": len(
                {c["source_file"] for c in all_chunks}
            ),
        }

    except Exception:
        logger.exception("Summarization failed")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate summary",
        )
