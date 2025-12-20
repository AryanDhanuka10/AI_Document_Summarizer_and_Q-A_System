"""
indexer.py

Why:
-----
Indexes chunk embeddings into Pinecone
with citation-ready metadata.

How:
-----
- Batch upserts
- Explicit metadata storage
"""

from loguru import logger
from app.db.pinecone_client import get_pinecone_index
from app.services.embeddings import embed_texts


def index_chunks(chunks: list[dict], batch_size: int = 50):
    """
    Indexes document chunks into Pinecone.

    Parameters
    ----------
    chunks : list[dict]
        Output from chunker
    """

    index = get_pinecone_index()
    logger.info(f"Indexing {len(chunks)} chunks")

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]

        texts = [c["text"] for c in batch]
        vectors = embed_texts(texts)

        pinecone_vectors = []

        for chunk, vector in zip(batch, vectors):
            pinecone_vectors.append((
                chunk["chunk_id"],
                vector,
                {
                    "source_file": chunk["source_file"],
                    "page_number": chunk["page_number"],
                    "text": chunk["text"]
                }
            ))

        try:
            index.upsert(vectors=pinecone_vectors)
        except Exception:
            logger.exception("Pinecone upsert failed")
            raise

    logger.info("Indexing completed successfully")
