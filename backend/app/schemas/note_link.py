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

class NoteLinkCreate(BaseModel):
    origin: str
    link_type_name: str
    source_id: int
    target_id: int
