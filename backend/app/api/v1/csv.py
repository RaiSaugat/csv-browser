from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.database.models import User
from app.api.deps import require_user, require_admin
from app.schemas.csv_file import CSVFileListResponse, CSVContentResponse
from app.services.csv_service import (
    upload_csv_file,
    get_all_csv_files,
    get_csv_content,
    delete_csv_file
)
from app.core.websocket_manager import websocket_manager

router = APIRouter()


@router.get("", response_model=List[CSVFileListResponse])
def list_csv_files(
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """List all CSV files (user/admin)"""
    csv_files = get_all_csv_files(db)
    return csv_files


@router.get("/{file_id}", response_model=CSVContentResponse)
def get_csv_file(
    file_id: int,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get CSV file content (user/admin)"""
    content = get_csv_content(db, file_id)
    return content


@router.post("/upload", response_model=CSVFileListResponse, status_code=status.HTTP_201_CREATED)
async def upload_csv(
    file: UploadFile = File(...),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Upload a CSV file (admin only)"""
    csv_file = upload_csv_file(db, file, current_user.id)

    # Broadcast update to all connected clients
    await websocket_manager.broadcast({
        "event": "csv_list_updated",
        "message": "CSV file uploaded"
    })

    return csv_file


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_csv(
    file_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete a CSV file (admin only)"""
    delete_csv_file(db, file_id)

    # Broadcast update to all connected clients
    await websocket_manager.broadcast({
        "event": "csv_list_updated",
        "message": "CSV file deleted"
    })

    return None
