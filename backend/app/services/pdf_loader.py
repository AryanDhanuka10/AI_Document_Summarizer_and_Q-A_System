"""
pdf_loader.py

Why:
-----
RAG systems fail when page-level metadata is lost or
when extracted text is noisy and fragmented.
This module ensures:
- Page-level traceability
- Cleaner text for better embeddings and retrieval

How:
-----
- Uses pdfplumber for page-wise extraction
- Applies lightweight text normalization
- Returns structured, citation-ready data
"""

import pdfplumber
from loguru import logger
from typing import List, Dict
import os
import re


def _normalize_text(text: str) -> str:
    """
    Cleans common PDF extraction artifacts.

    Why:
    ----
    Academic PDFs often contain:
    - Excessive newlines
    - Broken words
    - Irregular spacing

    This function improves downstream chunking
    and embedding quality without heavy OCR.

    How:
    ----
    - Removes extra whitespace
    - Collapses newlines
    - Strips non-informative artifacts
    """
    if not text:
        return ""

    # Replace newlines and multiple spaces
    text = re.sub(r"\s+", " ", text)

    # Remove repeated headers/footers noise (light touch)
    text = text.replace("ScienceDirect", "").strip()

    return text


def load_pdf(file_path: str) -> List[Dict]:
    """
    Extracts and normalizes text from a PDF file page by page.

    Parameters
    ----------
    file_path : str
        Absolute path to the PDF file.

    Returns
    -------
    List[Dict]
        Each dict contains:
        - text (normalized)
        - page_number
        - source_file
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF not found: {file_path}")

    pages: List[Dict] = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for idx, page in enumerate(pdf.pages):
                raw_text = page.extract_text() or ""
                clean_text = _normalize_text(raw_text)

                pages.append({
                    "text": clean_text,
                    "page_number": idx + 1,
                    "source_file": os.path.basename(file_path)
                })

        logger.info(f"Loaded and normalized {len(pages)} pages from {file_path}")

    except Exception as e:
        logger.exception("PDF loading failed")
        raise RuntimeError("Failed to load and process PDF") from e

    return pages
