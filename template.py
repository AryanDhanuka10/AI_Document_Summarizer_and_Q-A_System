"""
template.py

Purpose:
---------
This script bootstraps a production-grade AI Document Summarizer & Q&A System
by creating a clean, modular folder and file structure.

Why this exists:
----------------
- Enforces professional architecture from day one
- Prevents spaghetti-code projects
- Matches real-world backend engineering standards

Usage:
------
python template.py
"""

import os
from pathlib import Path

# -----------------------------
# Root project directory name
# -----------------------------
PROJECT_NAME = "ai-doc-rag"

# -----------------------------
# Directory structure
# -----------------------------
DIRECTORIES = [
    "backend/app/core",
    "backend/app/api/routes",
    "backend/app/services",
    "backend/app/db",
    "backend/app/models",
    "backend/app/utils",
    "backend/tests",
    "frontend",
]

# -----------------------------
# Files to create
# -----------------------------
FILES = {
    "backend/app/main.py": """\"\"\"
FastAPI application entry point.
\"\"\"

from fastapi import FastAPI
from app.api.router import api_router
from app.core.logger import setup_logging

def create_app() -> FastAPI:
    setup_logging()
    app = FastAPI(title="AI Document RAG System")
    app.include_router(api_router)
    return app

app = create_app()
""",

    "backend/app/core/config.py": """\"\"\"
Centralized configuration management.
\"\"\"
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
""",

    "backend/app/core/logger.py": """\"\"\"
Application-wide logging configuration.
\"\"\"
import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
    )
""",

    "backend/app/core/exceptions.py": """\"\"\"
Custom exception definitions.
\"\"\"
class DocumentProcessingError(Exception):
    pass
""",

    "backend/app/api/router.py": """\"\"\"
Central API router.
\"\"\"
from fastapi import APIRouter
from app.api.routes import health, upload, chat

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
""",

    "backend/app/api/routes/health.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "ok"}
""",

    "backend/app/api/routes/upload.py": """from fastapi import APIRouter, UploadFile

router = APIRouter()

@router.post("/")
async def upload_document(file: UploadFile):
    return {"message": "Upload endpoint placeholder"}
""",

    "backend/app/api/routes/chat.py": """from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def chat():
    return {"message": "Chat endpoint placeholder"}
""",

    "backend/app/services/pdf_loader.py": """\"\"\"
Handles PDF loading and page-level extraction.
\"\"\"
""",

    "backend/app/services/chunker.py": """\"\"\"
Responsible for intelligent text chunking.
\"\"\"
""",

    "backend/app/services/embeddings.py": """\"\"\"
Embedding generation logic.
\"\"\"
""",

    "backend/app/services/retriever.py": """\"\"\"
Hybrid retrieval (semantic + keyword).
\"\"\"
""",

    "backend/app/services/reranker.py": """\"\"\"
Re-ranking logic for retrieved chunks.
\"\"\"
""",

    "backend/app/services/rag_pipeline.py": """\"\"\"
End-to-end RAG orchestration.
\"\"\"
""",

    "backend/app/services/memory.py": """\"\"\"
Chat memory management.
\"\"\"
""",

    "backend/app/db/pinecone_client.py": """\"\"\"
Pinecone client initialization.
\"\"\"
""",

    "backend/app/db/schemas.py": """\"\"\"
Vector metadata schemas.
\"\"\"
""",

    "backend/app/models/chat.py": """\"\"\"
Pydantic models for chat requests/responses.
\"\"\"
""",

    "backend/app/utils/prompts.py": """\"\"\"
Prompt templates used by the RAG pipeline.
\"\"\"
""",

    "backend/app/utils/helpers.py": """\"\"\"
Utility helper functions.
\"\"\"
""",

    "backend/tests/test_rag.py": """\"\"\"
Basic RAG pipeline tests.
\"\"\"
""",

    "backend/requirements.txt": """fastapi
uvicorn
langchain
llama-index
pinecone-client
python-dotenv
pydantic
tiktoken
PyPDF2
rank-bm25
""",

    ".env.example": """OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENV=
""",

    ".gitignore": """__pycache__/
.env
venv/
node_modules/
""",

    "README.md": """# AI Document Summarizer & Q&A System

Production-grade RAG system using LangChain/LlamaIndex, Pinecone, and Next.js.
""",

    "frontend/README.md": """# Frontend (Next.js)

UI for document upload and chat.
"""
}

# -----------------------------
# Script execution
# -----------------------------
def main():
    base_path = Path(PROJECT_NAME)
    base_path.mkdir(exist_ok=True)

    for directory in DIRECTORIES:
        path = base_path / directory
        path.mkdir(parents=True, exist_ok=True)

    for file_path, content in FILES.items():
        full_path = base_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content)

    print("✅ Project scaffold created successfully.")

if __name__ == "__main__":
    main()
