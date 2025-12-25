"""
FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.logger import setup_logging


def create_app() -> FastAPI:
    setup_logging()

    app = FastAPI(title="AI Document RAG System")

    # CORS is REQUIRED for browser uploads
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # tighten in prod
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()
