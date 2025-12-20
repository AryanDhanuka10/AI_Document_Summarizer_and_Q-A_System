"""
citation.py

Why:
-----
Answers without traceable citations are useless
in serious document systems.

How:
-----
- Every sentence maps to source chunks
"""

from typing import List, Dict


def build_citations(chunks: List[Dict]) -> List[Dict]:
    citations = []

    for c in chunks:
        meta = c["metadata"]
        citations.append({
            "source_file": meta["source_file"],
            "page_number": meta["page_number"]
        })

    return citations
