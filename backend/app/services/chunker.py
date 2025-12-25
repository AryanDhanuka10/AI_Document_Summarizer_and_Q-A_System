"""
chunker.py

Page-aware semantic chunking.
"""

from typing import List, Dict
from loguru import logger
from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_pages(
    pages: List[Dict],
    chunk_size: int = 800,
    chunk_overlap: int = 150,
) -> List[Dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    chunks: List[Dict] = []

    for page in pages:
        try:
            split_texts = splitter.split_text(page["text"])

            for idx, text in enumerate(split_texts):
                chunks.append(
                    {
                        "text": text,
                        "page_number": page["page_number"],
                        "source_file": page["source_file"],
                        "chunk_id": (
                            f"{page['source_file']}"
                            f"_p{page['page_number']}_c{idx}"
                        ),
                    }
                )

        except Exception as e:
            logger.warning(
                f"Chunking failed for page {page['page_number']}: {e}"
            )

    logger.info(f"Generated {len(chunks)} chunks")
    return chunks
