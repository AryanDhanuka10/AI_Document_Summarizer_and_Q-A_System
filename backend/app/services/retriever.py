"""
retriever.py

Hybrid retrieval (BM25-only):

- Keyword-based retrieval using BM25
- Session-safe (in-memory chunks only)
- Schema-consistent output for downstream RAG
"""

from typing import List, Dict
import numpy as np
from loguru import logger
from rank_bm25 import BM25Okapi


class HybridRetriever:
    """
    Session-safe retriever.

    Each result contains:
    - score: float
    - metadata: FULL chunk dict
    """

    def __init__(self, chunks: List[Dict]):
        if not chunks:
            raise ValueError("HybridRetriever initialized with empty chunks")

        self.chunks = chunks
        self.texts = [c.get("text", "") for c in chunks]

        self.bm25 = BM25Okapi(
            [text.split() for text in self.texts]
        )

    def search(self, query: str, top_k: int = 8) -> List[Dict]:
        """
        Perform keyword-based retrieval using BM25.
        """

        if not query.strip():
            logger.warning("Empty query passed to retriever")
            return []

        scores = self.bm25.get_scores(query.split())
        top_indices = np.argsort(scores)[::-1][:top_k]

        results: List[Dict] = []

        for idx in top_indices:
            if scores[idx] <= 0:
                continue

            results.append(
                {
                    "score": float(scores[idx]),
                    "metadata": self.chunks[idx],
                }
            )

        logger.info(
            f"BM25 returned {len(results)} chunks "
            f"for query='{query[:50]}'"
        )

        return results
