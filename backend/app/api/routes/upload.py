from fastapi import APIRouter, UploadFile

router = APIRouter()

@router.post("/")
async def upload_document(file: UploadFile):
    return {"message": "Upload endpoint placeholder"}
