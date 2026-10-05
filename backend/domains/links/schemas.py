from pydantic import BaseModel, ConfigDict

from domains.notes.schemas import NoteSummary


class LinkTypeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class NoteLinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
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
