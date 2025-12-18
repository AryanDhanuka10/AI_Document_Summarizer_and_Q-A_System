"""
chunker.py

Why:
-----
LLMs perform best with semantically coherent chunks.
Overlapping chunks reduce context fragmentation.

How:
-----
- Token-aware chunking
- Metadata preserved per chunk
"""

from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from loguru import logger


def chunk_pages(
    pages: List[Dict],
    chunk_size: int = 800,
    chunk_overlap: int = 150
) -> List[Dict]:
    """
    Splits page-level text into overlapping chunks.

    Parameters
    ----------
    pages : List[Dict]
        Output of pdf_loader.load_pdf()
    chunk_size : int
        Max tokens per chunk
    chunk_overlap : int
        Overlap between chunks

    Returns
    -------
    List[Dict]
        Chunked text with citation metadata
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    chunks = []

    for page in pages:
        try:
            split_texts = splitter.split_text(page["text"])

            for idx, chunk in enumerate(split_texts):
                chunks.append({
                    "text": chunk,
                    "page_number": page["page_number"],
                    "source_file": page["source_file"],
                    "chunk_id": f"{page['source_file']}_p{page['page_number']}_c{idx}"
                })

        except Exception as e:
            logger.warning(
                f"Chunking failed for page {page['page_number']}: {e}"
            )

    logger.info(f"Generated {len(chunks)} chunks")

    return chunks

