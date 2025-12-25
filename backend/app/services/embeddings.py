"""
embeddings.py

Local embedding layer (OpenAI-free).
"""

from typing import List
from sentence_transformers import SentenceTransformer

_model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_texts(texts: List[str]) -> List[list[float]]:
    """
    Generates normalized embeddings for a list of texts.
    """

    return _model.encode(
        texts,
        normalize_embeddings=True,
    ).tolist()
