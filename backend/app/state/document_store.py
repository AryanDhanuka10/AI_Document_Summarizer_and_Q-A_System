"""
document_store.py

Session-aware in-memory document store.
Prevents cross-document and cross-session leakage.
"""

from typing import Dict, List


class DocumentStore:
    def __init__(self) -> None:
        # session_id -> list of document chunks
        self._store: Dict[str, List[dict]] = {}

    def add_chunks(self, session_id: str, chunks: List[dict]) -> None:
        """
        Add chunks for a session.
        """
        if session_id not in self._store:
            self._store[session_id] = []

        self._store[session_id].extend(chunks)

    def get_all_chunks(self, session_id: str) -> List[dict]:
        """
        Get all chunks for a session.
        """
        return self._store.get(session_id, [])

    def get_documents(
        self,
        session_id: str,
        filenames: List[str],
    ) -> List[dict]:
        """
        Get chunks belonging to specific documents.
        """
        chunks = self._store.get(session_id, [])

        return [
            c for c in chunks
            if c.get("source_file") in filenames
        ]

    def clear_session(self, session_id: str) -> None:
        """
        Clear all documents for a session.
        """
        self._store.pop(session_id, None)


# Singleton instance
document_store = DocumentStore()
