from fastapi import APIRouter

router = APIRouter()

@router.post("/")
def chat():
    return {"message": "Chat endpoint placeholder"}
