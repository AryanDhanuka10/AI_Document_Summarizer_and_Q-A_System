from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import os
import uuid
import shutil
from loguru import logger

from app.services.pdf_loader import load_pdf
from app.services.chunker import chunk_pages
from app.services.indexer import index_chunks
from app.state.document_store import document_store

router = APIRouter()

UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_documents(
    session_id: str,
    files: list[UploadFile] = File(...)
):

    """
    Uploads multiple PDFs, processes them, and indexes them.
    Session-safe.
    """

    if not files:
        raise HTTPException(400, "No files provided")

    # 🔴 CRITICAL FIX: clear old session data
    document_store.clear_session(session_id)

    processed_files = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                400, f"Invalid file type: {file.filename}"
            )

        safe_name = f"{uuid.uuid4()}-{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_name)

        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        pages = load_pdf(file_path)
        chunks = chunk_pages(pages)

        index_chunks(chunks)
        document_store.add_chunks(session_id, chunks)

        processed_files.append(safe_name)
        logger.info(f"[{session_id}] Processed {safe_name}")

    return {
        "message": "Documents uploaded and indexed successfully",
        "files": processed_files,
        "document_count": len(processed_files),
        "session_id": session_id,
    }
