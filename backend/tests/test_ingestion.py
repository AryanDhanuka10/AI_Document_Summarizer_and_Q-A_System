"""
test_ingestion.py

Why:
-----
Manual verification of PDF ingestion and chunking
before embeddings and indexing.

This test MUST pass before moving forward.
"""

import os
import sys

# Ensure app module is discoverable
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)

from app.services.pdf_loader import load_pdf
from app.services.chunker import chunk_pages


# -------- CONFIG --------
PDF_PATH = os.path.join(PROJECT_ROOT, "tests", "sample.pdf")
# ------------------------


def run_test():
    print("\n[TEST] Starting PDF ingestion test...\n")

    pages = load_pdf(PDF_PATH)
    chunks = chunk_pages(pages)

    print(f"Total Pages Extracted : {len(pages)}")
    print(f"Total Chunks Created  : {len(chunks)}\n")

    print("[TEST] Printing first 5 chunks for manual verification:\n")

    for i, chunk in enumerate(chunks[:5], start=1):
        print("=" * 90)
        print(f"Chunk #{i}")
        print(f"Source File : {chunk['source_file']}")
        print(f"Page Number : {chunk['page_number']}")
        print(f"Chunk ID    : {chunk['chunk_id']}")
        print("\nText Preview:")
        print(chunk["text"][:400])
        print("=" * 90)

    print("\n[TEST] Ingestion test completed successfully.\n")


if __name__ == "__main__":
    run_test()
