# backend/app/services/rag_pipeline.py

from app.services.retriever import HybridRetriever
from app.services.citation import build_citations
from app.services.answer_generator import generate_answer
from app.services.memory import ChatMemory
from app.services.query_rewriter import rewrite_query

memory = ChatMemory()


def answer_question(
    session_id: str,
    question: str,
    all_chunks: list[dict],
) -> dict:
    """
    Full RAG pipeline with memory, retrieval, QA, and citations.
    """

    history = memory.get_history(session_id)
    standalone_query = rewrite_query(history, question)

    retriever = HybridRetriever(all_chunks)
    candidate_chunks = retriever.search(
        query=standalone_query,
        top_k=12,
    )

    if not candidate_chunks:
        return {
            "answer": "I could not find this information in the uploaded documents.",
            "citations": [],
        }

    answer = generate_answer(
        prompt=standalone_query,
        evidence_chunks=candidate_chunks,
        mode="qa",
    )

    citations = build_citations(candidate_chunks)

    memory.add_message(session_id, "user", question)
    memory.add_message(session_id, "assistant", answer)

    return {
        "answer": answer,
        "citations": citations,
    }
