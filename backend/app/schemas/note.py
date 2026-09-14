from datetime import datetime

from pydantic import BaseModel
from typing import Optional
from enum import Enum

class NoteType(str, Enum):
    question = "question"
    observation = "observation"
    idea = "idea"
    thought = "thought"
    quote = "quote"

class NoteStatus(str, Enum):
    open = "open"
    ongoing = "ongoing"
    completed = "closed"

class NoteCreate(BaseModel):
    title: str
    content: str
    note_type: NoteType
    status: Optional[NoteStatus] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_type: Optional[NoteType] = None
    status: Optional[NoteStatus] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    note_type: NoteType
    status: Optional[NoteStatus] = None
    created_at: datetime
    modified_at: datetime

    class Config:
        from_attributes = True