"""
pdf_loader.py

Page-wise PDF text extraction with normalization.
"""

import os
import re
import pdfplumber
from loguru import logger
from typing import List, Dict


def _normalize_text(text: str) -> str:
    if not text:
        return ""

    text = re.sub(r"\s+", " ", text)
    text = text.replace("ScienceDirect", "").strip()
    return text


def load_pdf(file_path: str) -> List[Dict]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF not found: {file_path}")

    pages: List[Dict] = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for idx, page in enumerate(pdf.pages):
                raw_text = page.extract_text() or ""
                clean_text = _normalize_text(raw_text)

                pages.append(
                    {
                        "text": clean_text,
                        "page_number": idx + 1,
                        "source_file": os.path.basename(file_path),
                    }
                )

        logger.info(
            f"Loaded and normalized {len(pages)} pages from {file_path}"
        )

    except Exception as e:
        logger.exception("PDF loading failed")
        raise RuntimeError("Failed to load PDF") from e

    return pages
