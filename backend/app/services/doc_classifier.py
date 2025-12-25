# backend/app/services/doc_classifier.py

from app.services.llm import get_llm
from langchain_core.messages import SystemMessage, HumanMessage


def classify_document(text_sample: str) -> str:
    """
    Classify document type and tone.
    """

    llm = get_llm()

    system_prompt = """
Analyze the following text sample and classify it into:

[RESEARCH_PAPER, LEGAL_CONTRACT, FINANCIAL_REPORT, GENERAL_TEXT]

Output format:
Category: <CATEGORY>
Tone: <TONE>
Key_Focus: <PRIMARY_SUBJECT>
"""

    response = llm.invoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(content=text_sample[:2000]),
        ]
    )

    return response.content.strip()
