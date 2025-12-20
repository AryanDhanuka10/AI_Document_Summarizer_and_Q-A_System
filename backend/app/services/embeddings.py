"""
embeddings.py

Why:
-----
Embeddings determine retrieval quality.
We use a deterministic, lightweight model.

How:
-----
SentenceTransformers (CPU-safe, fast).
"""

from sentence_transformers import SentenceTransformer
from loguru import logger

_MODEL_NAME = "all-MiniLM-L6-v2"
_model = SentenceTransformer(_MODEL_NAME)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Converts a list of texts into vector embeddings.
    """
    try:
        vectors = _model.encode(texts, show_progress_bar=False)
        return vectors.tolist()

    except Exception as e:
        logger.exception("Embedding generation failed")
        raise
