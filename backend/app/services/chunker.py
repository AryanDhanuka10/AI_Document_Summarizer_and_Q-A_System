"""
chunker.py

Why:
-----
Chunking is critical for retrieval accuracy.
This implementation is compatible with modern LangChain versions.

How:
-----
- Uses RecursiveCharacterTextSplitter
- Preserves page-level citation metadata
"""

from typing import List, Dict
from loguru import logger

from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_pages(
    pages: List[Dict],
    chunk_size: int = 800,
    chunk_overlap: int = 150
) -> List[Dict]:
    """
    Splits page-level text into overlapping semantic chunks.

    Parameters
    ----------
    pages : List[Dict]
        Output from pdf_loader.load_pdf()
    chunk_size : int
        Max characters per chunk
    chunk_overlap : int
        Overlap size to preserve context

    Returns
    -------
    List[Dict]
        Chunked documents with citation metadata
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
