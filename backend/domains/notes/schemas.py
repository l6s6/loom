from datetime import datetime

from pydantic import BaseModel, ConfigDict
from typing import Optional
from enum import Enum


class TagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class NoteTypeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class NoteStatus(str, Enum):
    none = "none"
    open = "open"
    ongoing = "ongoing"
    closed = "closed"


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    note_type_name: Optional[str] = None
    tag_names: Optional[list[str]] = None
    status: Optional[NoteStatus] = None


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    content: str
    status: NoteStatus
    is_archived: bool
    is_pinned: bool
    is_private: bool
    note_type: NoteTypeResponse
    tags: list[TagResponse]
    created_at: datetime
    modified_at: datetime


class NoteSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    note_type: NoteTypeResponse



