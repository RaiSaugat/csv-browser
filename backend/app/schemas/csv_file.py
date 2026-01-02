from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any


class CSVFileBase(BaseModel):
    filename: str
    size: int


class CSVFileCreate(CSVFileBase):
    path: str
    uploaded_by: int


class CSVFileResponse(CSVFileBase):
    id: int
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


class CSVFileListResponse(BaseModel):
    id: int
    filename: str
    size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


class CSVContentResponse(BaseModel):
    filename: str
    headers: List[str]
    rows: List[Dict[str, Any]]
    total_rows: int
