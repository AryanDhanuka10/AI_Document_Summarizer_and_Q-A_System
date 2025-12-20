"""
prompts.py

Why:
-----
A strict prompt is the only thing preventing hallucinations.

How:
-----
- Evidence-only answering
- Explicit refusal rules
"""

ANSWER_PROMPT = """
You are a document-grounded assistant.

Rules:
- Answer ONLY using the provided context.
- If the answer is not present, say:
  "The answer is not available in the provided documents."
- Do NOT use external knowledge.
- Be concise and factual.

Context:
{context}

Question:
{question}

Answer:
"""

