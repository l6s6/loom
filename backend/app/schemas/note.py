from datetime import datetime

from pydantic import BaseModel
from typing import Optional
from enum import Enum

class NoteStatus(str, Enum):
    open = "open"
    ongoing = "ongoing"
    closed = "closed"



class NoteTypeCreate(BaseModel):
    name: str

class NoteTypeResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class NoteTypeUpdate(BaseModel):
    name: str




class NoteCreate(BaseModel):
    title: str
    content: str
    note_type_name: str
    status: Optional[NoteStatus] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_type_name: Optional[str] = None
    status: Optional[NoteStatus] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    status: Optional[NoteStatus] = None
    note_type: NoteTypeResponse
    created_at: datetime
    modified_at: datetime

    class Config:
        from_attributes = True