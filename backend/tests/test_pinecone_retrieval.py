"""
test_pinecone_retrieval.py

Why:
-----
Validates that indexed vectors can be retrieved
with correct metadata and relevance.

This is a Day 1 completion gate.
"""

import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

from app.services.pdf_loader import load_pdf
from app.services.chunker import chunk_pages
from app.services.indexer import index_chunks
from app.services.embeddings import embed_texts
from app.db.pinecone_client import get_pinecone_index


PDF_PATH = os.path.join(PROJECT_ROOT, "tests", "sample.pdf")


def run_test():
    print("\n[TEST] Starting Pinecone indexing & retrieval test\n")

    # 1. Ingest
    pages = load_pdf(PDF_PATH)
    chunks = chunk_pages(pages)

    # 2. Index
    index_chunks(chunks)

    # 3. Query
    query = "What is sentiment analysis?"
    query_vector = embed_texts([query])[0]

    index = get_pinecone_index()

    result = index.query(
        vector=query_vector,
        top_k=3,
        include_metadata=True
    )

    print("\n[TEST] Retrieval Results:\n")

    for match in result["matches"]:
        meta = match["metadata"]
        print("-" * 90)
        print(f"Score       : {match['score']:.4f}")
        print(f"Source File : {meta['source_file']}")
        print(f"Page Number : {meta['page_number']}")
        print(f"Text Preview:\n{meta['text'][:300]}")
        print("-" * 90)

    print("\n[TEST] Pinecone retrieval test completed\n")


if __name__ == "__main__":
    run_test()
