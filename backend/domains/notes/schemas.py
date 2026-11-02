"""Pydantic schemas for note-related API payloads and responses.

These models define the validated request/response contract used by the notes
API. They convert ORM objects into JSON-serializable payloads and enforce
business constraints such as allowed note statuses and optional update fields.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TagResponse(BaseModel):
    """Schema returned for a tag object."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str


class TagWithCount(TagResponse):
    """Tag response including the number of notes assigned to it."""

    note_count: int


class TagCreate(BaseModel):
    """Payload used to create a new tag."""

    name: str


class TagUpdate(BaseModel):
    """Payload used to update an existing tag."""

    name: Optional[str] = None


class NoteTypeResponse(BaseModel):
    """Schema returned for a note type object."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str


class NoteTypeWithCount(NoteTypeResponse):
    """Note type response including the number of notes in that category."""

    note_count: int


class NoteTypeCreate(BaseModel):
    """Payload used to create a new note type."""

    name: str


class NoteTypeUpdate(BaseModel):
    """Payload used to update an existing note type."""

    name: Optional[str] = None


class NoteStatus(str, Enum):
    """Allowed lifecycle states for a note."""

    none = "none"
    open = "open"
    ongoing = "ongoing"
    closed = "closed"


class NoteUpdate(BaseModel):
    """Payload used to update an existing note.

    Fields not supplied remain unchanged.
    """

    title: Optional[str] = None
    content: Optional[str] = None
    note_type_name: Optional[str] = None
    tag_names: Optional[list[str]] = None
    status: Optional[NoteStatus] = None


class NoteResponse(BaseModel):
    """Full note schema returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: str
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
    """Compact note representation used in link or relationship contexts."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    note_type: NoteTypeResponse