from datetime import datetime

from pydantic import BaseModel
from typing import Optional
from enum import Enum

from app.schemas.note_tag import NoteTagResponse
from app.schemas.note_type import NoteTypeResponse


class NoteStatus(str, Enum):
    none = "none"
    open = "open"
    ongoing = "ongoing"
    closed = "closed"

class NoteCreate(BaseModel):
    title: str
    content: str
    note_type_name: str
    tag_names: list[str]
    status: NoteStatus = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_type_name: Optional[str] = None
    tag_names: Optional[list[str]] = None
    status: Optional[NoteStatus] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    status: NoteStatus
    note_type: NoteTypeResponse
    tags: list[NoteTagResponse]
    created_at: datetime
    modified_at: datetime

    class Config:
        from_attributes = True