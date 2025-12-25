# app.py
"""
Hugging Face Spaces entry point.
Runs FastAPI on port 7860 (HF default).
"""

import os
import sys
from app.main import app

if __name__ == "__main__":
    import uvicorn
    
    # HF Spaces uses port 7860
    port = int(os.getenv("PORT", 7860))
    host = "0.0.0.0"
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
    )