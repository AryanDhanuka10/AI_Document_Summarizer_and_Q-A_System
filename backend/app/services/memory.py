"""
memory.py

Why:
-----
Conversation without memory is useless.

How:
-----
- In-memory session store (can be swapped for Redis later)
"""

from collections import defaultdict
from typing import List


class ChatMemory:
    def __init__(self):
        self.store = defaultdict(list)

    def add_message(self, session_id: str, role: str, content: str):
        self.store[session_id].append({
            "role": role,
            "content": content
        })

    def get_history(self, session_id: str) -> List[dict]:
        return self.store.get(session_id, [])

