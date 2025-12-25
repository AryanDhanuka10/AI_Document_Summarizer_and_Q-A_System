from fastapi import APIRouter
from app.api.routes import health, upload, chat, summarize_upload

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(summarize_upload.router, prefix="/summarize", tags=["Summarize"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
