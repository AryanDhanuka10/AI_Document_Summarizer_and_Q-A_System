# backend/app/api/routes/chat.py
"""
chat.py

Session-scoped RAG-based Q&A.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.rag_pipeline import answer_question
from app.state.document_store import document_store

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    question: str
    documents: Optional[List[str]] = None


@router.post("/")
def chat(request: ChatRequest):
    """
    Answers questions using only session documents.
    """

    if request.documents:
        chunks = document_store.get_documents(
            request.session_id, request.documents
        )
    else:
        chunks = document_store.get_all_chunks(request.session_id)

    if not chunks:
        raise HTTPException(
            400, "No documents available for this session"
        )

    return answer_question(
        session_id=request.session_id,
        question=request.question,
        all_chunks=chunks,
    )
