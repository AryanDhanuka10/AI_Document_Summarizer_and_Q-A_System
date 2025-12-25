import os
import sys

print("✅ Step 1: Imports starting...")

try:
    from app.main import app
    print("✅ Step 2: FastAPI app imported successfully")
except Exception as e:
    print(f"❌ Error importing app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn
    
    print("✅ Step 3: Starting Uvicorn...")
    port = int(os.getenv("PORT", 7860))
    host = "0.0.0.0"
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
    )
