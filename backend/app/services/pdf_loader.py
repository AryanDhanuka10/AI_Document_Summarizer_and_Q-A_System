"""
pdf_loader.py

Why:
-----
RAG systems fail when page-level metadata is lost.
This module ensures every chunk can be traced back
to its original PDF and page number.

How:
-----
- Uses pdfplumber for reliable page extraction
- Returns structured data instead of raw text
"""

import pdfplumber
from loguru import logger
from typing import List, Dict


def load_pdf(file_path: str) -> List[Dict]:
    """
    Extracts text from a PDF file page by page.

    Parameters
    ----------
    file_path : str
        Absolute path to the PDF file.

    Returns
    -------
    List[Dict]
        Each dict contains:
        - text
        - page_number
        - source_file
    """
    pages = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for idx, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                pages.append({
                    "text": text.strip(),
                    "page_number": idx + 1,
                    "source_file": file_path.split("/")[-1]
                })

        logger.info(f"Loaded {len(pages)} pages from {file_path}")

    except Exception as e:
        logger.error(f"PDF loading failed: {e}")
        raise RuntimeError("Failed to load PDF") from e

    return pages

