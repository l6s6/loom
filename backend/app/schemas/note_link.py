from pydantic import BaseModel
from app.schemas.note import NoteResponse


class LinkTypeResponse(BaseModel):
    id: int
    name: str

class NoteLinkResponse(BaseModel):
    id: int
    origin: str
    link_type: LinkTypeResponse
    source: NoteResponse
    target: NoteResponse