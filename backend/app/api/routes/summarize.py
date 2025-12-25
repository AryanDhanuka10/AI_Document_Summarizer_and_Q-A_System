"""
summarize.py

Generates summaries for one or more documents.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.state.document_store import document_store
from app.services.answer_generator import generate_answer
from app.services.citation import build_citations

router = APIRouter()


class SummarizeRequest(BaseModel):
    documents: list[str]


@router.post("/")
def summarize(request: SummarizeRequest):
    """
    Summarizes selected documents with citations.
    """

    chunks = document_store.get_documents(request.documents)

    if not chunks:
        return {
            "summary": "No documents selected.",
            "citations": []
        }

    summary_prompt = "Provide a concise summary of the documents."

    summary = generate_answer(summary_prompt, chunks)
    citations = build_citations(chunks[:5])  # sample citations

    return {
        "summary": summary,
        "citations": citations
    }
