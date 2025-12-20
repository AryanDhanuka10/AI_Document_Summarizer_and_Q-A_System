"""
pinecone_client.py

Why:
-----
Handles Pinecone initialization using the modern
Pinecone SDK (v3+). Avoids deprecated APIs.

How:
-----
- Uses Pinecone client object
- Idempotent index creation
- ServerlessSpec-based configuration
"""

from loguru import logger
from pinecone import Pinecone, ServerlessSpec
from app.core.config import PINECONE_API_KEY, PINECONE_ENV

INDEX_NAME = "rag-documents"
EMBEDDING_DIM = 384  # all-MiniLM-L6-v2


def get_pinecone_index():
    """
    Initializes Pinecone client and returns an index instance.
    """

    try:
        pc = Pinecone(api_key=PINECONE_API_KEY)

        existing_indexes = pc.list_indexes().names()

        if INDEX_NAME not in existing_indexes:
            logger.info("Creating Pinecone index (serverless)...")

            pc.create_index(
                name=INDEX_NAME,
                dimension=EMBEDDING_DIM,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=PINECONE_ENV
                )
            )

        logger.info("Pinecone index ready")
        return pc.Index(INDEX_NAME)

    except Exception as e:
        logger.exception("Failed to initialize Pinecone")
        raise
