from pydantic import BaseModel
from app.schemas.note import NoteSummary
from schemas.link_type import LinkTypeResponse


class NoteLinkResponse(BaseModel):
    id: int
    origin: str
    link_type: LinkTypeResponse
    source: NoteSummary
    target: NoteSummary

class NoteLinkCreate(BaseModel):
    origin: str
    link_type_name: str
    source_id: int
    target_id: int
