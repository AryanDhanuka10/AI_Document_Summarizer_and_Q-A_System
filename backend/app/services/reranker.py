"""
reranker.py

Why:
-----
Initial retrieval is noisy.
Re-ranking improves answer faithfulness.

How:
-----
- Lightweight heuristic scoring
- (LLM-based reranking can be added later)
"""

from typing import List, Dict


def rerank(query: str, candidates: List[Dict], top_k: int = 3) -> List[Dict]:
    """
    Ranks candidates based on query overlap.
    """

    query_terms = set(query.lower().split())

    scored = []
    for c in candidates:
        text_terms = set(c["metadata"]["text"].lower().split())
        overlap = len(query_terms & text_terms)
        scored.append((overlap, c))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for _, c in scored[:top_k]]
