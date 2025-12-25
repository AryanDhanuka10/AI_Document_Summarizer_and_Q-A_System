# backend/app/services/citation.py
"""
citation.py

Reliable, schema-safe citation builder.
"""

from typing import List, Dict


def build_citations(chunks: List[Dict]) -> List[Dict]:
    seen = set()
    citations = []

    for c in chunks:
        meta = c.get("metadata", c)

        source = meta.get("source_file")
        page = meta.get("page_number")

        if not source or not page:
            continue

        key = (source, page)
        if key in seen:
            continue

        seen.add(key)
        citations.append({
            "source_file": source,
            "page_number": page,
            "snippet": (
                c.get("metadata", {}).get("text")
                or c.get("text", "")
            )[:200]
        })


    return citations
