# app/main.py
"""
FastAPI application entry point.
Compatible with Hugging Face Spaces.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.logger import setup_logging


def create_app() -> FastAPI:
    setup_logging()

    app = FastAPI(
        title="AI Document RAG System",
        description="Production-grade RAG pipeline for document intelligence",
        version="1.0.0"
    )

    # ✅ CORS is REQUIRED for browser uploads
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow HF frontend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    # Root endpoint
    @app.get("/")
    def root():
        return {
            "message": "AI Document RAG System",
            "status": "running",
            "version": "1.0.0"
        }

    return app


app = create_app()