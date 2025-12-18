"""
FastAPI application entry point.
"""

from fastapi import FastAPI
from app.api.router import api_router
from app.core.logger import setup_logging

def create_app() -> FastAPI:
    setup_logging()
    app = FastAPI(title="AI Document RAG System")
    app.include_router(api_router)
    return app

app = create_app()
