from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from app.database.models import CSVFile, User
from typing import List
import os
import uuid
from datetime import datetime
from app.config import settings
from app.utils.csv_parser import parse_csv_file


def upload_csv_file(db: Session, file: UploadFile, user_id: int) -> CSVFile:
    """Upload and save a CSV file"""
    # Validate file extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV file"
        )

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.upload_dir, unique_filename)

    # Save file to disk
    try:
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)

        file_size = len(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Create database record
    csv_file = CSVFile(
        filename=file.filename,
        path=file_path,
        size=file_size,
        uploaded_by=user_id
    )

    db.add(csv_file)
    db.commit()
    db.refresh(csv_file)

    return csv_file


def get_all_csv_files(db: Session) -> List[CSVFile]:
    """Get all CSV files"""
    return db.query(CSVFile).order_by(CSVFile.uploaded_at.desc()).all()


def get_csv_file_by_id(db: Session, file_id: int) -> CSVFile:
    """Get a CSV file by ID"""
    csv_file = db.query(CSVFile).filter(CSVFile.id == file_id).first()
    if not csv_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CSV file not found"
        )
    return csv_file


def get_csv_content(db: Session, file_id: int) -> dict:
    """Get the content of a CSV file"""
    csv_file = get_csv_file_by_id(db, file_id)

    try:
        parsed_data = parse_csv_file(csv_file.path)
        return {
            "filename": csv_file.filename,
            "headers": parsed_data["headers"],
            "rows": parsed_data["rows"],
            "total_rows": parsed_data["total_rows"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read CSV file: {str(e)}"
        )


def delete_csv_file(db: Session, file_id: int) -> bool:
    """Delete a CSV file and its database record"""
    csv_file = get_csv_file_by_id(db, file_id)

    # Delete file from filesystem
    try:
        if os.path.exists(csv_file.path):
            os.remove(csv_file.path)
    except Exception as e:
        # Log error but continue with database deletion
        pass

    # Delete database record
    db.delete(csv_file)
    db.commit()

    return True
