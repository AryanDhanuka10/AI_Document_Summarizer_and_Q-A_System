from app.services.retriever import HybridRetriever
from app.services.reranker import rerank
from app.services.citation import build_citations
from app.services.answer_generator import generate_answer
from app.services.memory import ChatMemory
from app.services.query_rewriter import rewrite_query


memory = ChatMemory()


def answer_question(
    session_id: str,
    question: str,
    all_chunks: list[dict]
) -> dict:
    """
    Full RAG pipeline with memory and citations.
    """

    history = memory.get_history(session_id)
    standalone_query = rewrite_query(history, question)

    retriever = HybridRetriever(all_chunks)
    candidates = retriever.hybrid_search(standalone_query)
    top_chunks = rerank(standalone_query, candidates)

    if not top_chunks:
        return {
            "answer": "The answer is not available in the provided documents.",
            "citations": []
        }

    answer = generate_answer(standalone_query, top_chunks)
    citations = build_citations(top_chunks)

    memory.add_message(session_id, "user", question)
    memory.add_message(session_id, "assistant", answer)

    return {
        "answer": answer,
        "citations": citations
    }
