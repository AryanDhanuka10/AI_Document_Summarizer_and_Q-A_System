from app.services.pdf_loader import load_pdf
from app.services.chunker import chunk_pages
from app.services.rag_pipeline import answer_question

PDF_PATH = "tests/sample.pdf"

pages = load_pdf(PDF_PATH)
chunks = chunk_pages(pages)

session_id = "test-session"

q1 = "What is sentiment analysis?"
res1 = answer_question(session_id, q1, chunks)

print("\nQ1 Answer:\n", res1["answer"])
print("Citations:", res1["citations"])

q2 = "Where is it used?"
res2 = answer_question(session_id, q2, chunks)

print("\nQ2 Answer:\n", res2["answer"])
print("Citations:", res2["citations"])
