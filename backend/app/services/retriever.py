"""
retriever.py

Why:
-----
Vector search alone misses exact terms.
Keyword search alone misses semantics.
Hybrid retrieval gives the best of both.

How:
-----
- Semantic search via Pinecone
- Keyword search via BM25
- Score normalization + merge
"""

from typing import List, Dict
from loguru import logger
from rank_bm25 import BM25Okapi
import numpy as np

from app.services.embeddings import embed_texts
from app.db.pinecone_client import get_pinecone_index


class HybridRetriever:
    def __init__(self, chunks: List[Dict]):
        """
        chunks: all indexed chunks (for BM25)
        """
        self.chunks = chunks
        self.texts = [c["text"] for c in chunks]
        self.bm25 = BM25Okapi([t.split() for t in self.texts])

    def semantic_search(self, query: str, top_k: int = 10) -> List[Dict]:
        index = get_pinecone_index()
        vector = embed_texts([query])[0]

        results = index.query(
            vector=vector,
            top_k=top_k,
            include_metadata=True
        )

        hits = []
        for match in results["matches"]:
            hits.append({
                "score": match["score"],
                "metadata": match["metadata"]
            })

        return hits

    def keyword_search(self, query: str, top_k: int = 10) -> List[Dict]:
        scores = self.bm25.get_scores(query.split())
        top_indices = np.argsort(scores)[::-1][:top_k]

        hits = []
        for idx in top_indices:
            hits.append({
                "score": scores[idx],
                "metadata": self.chunks[idx]
            })

        return hits

    def hybrid_search(self, query: str, top_k: int = 5) -> List[Dict]:
        semantic_hits = self.semantic_search(query, top_k=top_k * 2)
        keyword_hits = self.keyword_search(query, top_k=top_k * 2)

        combined = {}

        for hit in semantic_hits + keyword_hits:
            key = (
                hit["metadata"]["source_file"],
                hit["metadata"]["page_number"],
                hit["metadata"]["text"][:50]
            )
            combined[key] = combined.get(key, 0) + hit["score"]

        sorted_hits = sorted(
            combined.items(),
            key=lambda x: x[1],
            reverse=True
        )

        final_hits = []
        for key, score in sorted_hits[:top_k]:
            final_hits.append({
                "score": score,
                "metadata": {
                    "source_file": key[0],
                    "page_number": key[1],
                    "text": key[2]
                }
            })

        logger.info(f"Hybrid search returned {len(final_hits)} chunks")
        return final_hits
