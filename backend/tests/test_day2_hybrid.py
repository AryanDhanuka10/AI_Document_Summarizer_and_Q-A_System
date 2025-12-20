from app.services.pdf_loader import load_pdf
from app.services.chunker import chunk_pages
from app.services.rag_pipeline import retrieve_evidence

PDF_PATH = "tests/sample.pdf"

pages = load_pdf(PDF_PATH)
chunks = chunk_pages(pages)

query = "What is sentiment analysis?"

result = retrieve_evidence(query, chunks)

print("\nEvidence:\n")
for e in result["evidence"]:
    print("-" * 80)
    print(e["metadata"]["text"][:300])

print("\nCitations:\n", result["citations"])
