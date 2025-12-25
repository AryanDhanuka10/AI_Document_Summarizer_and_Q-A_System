from pinecone import Pinecone, ServerlessSpec
from loguru import logger

from app.core.config import (
    PINECONE_API_KEY,
    PINECONE_ENV,
    PINECONE_INDEX_NAME,
)

pc = Pinecone(api_key=PINECONE_API_KEY)


def get_pinecone_index():
    """
    Initializes and returns a Pinecone index.
    """

    try:
        if PINECONE_INDEX_NAME not in pc.list_indexes().names():
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=PINECONE_ENV,
                ),
            )

        logger.info("Pinecone index ready")
        return pc.Index(PINECONE_INDEX_NAME)

    except Exception as e:
        logger.error("Failed to initialize Pinecone", exc_info=e)
        raise
