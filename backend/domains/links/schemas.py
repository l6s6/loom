from pydantic import BaseModel, ConfigDict
from enum import Enum

from domains.notes.schemas import NoteSummary

class LinkOrigin(str, Enum):
    manual = "manual"
    tag = "tag"
    ai = "ai"

class LinkTypeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class LinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    origin: LinkOrigin
    link_type: LinkTypeResponse
    source: NoteSummary
    target: NoteSummary

class LinkCreate(BaseModel):
    origin: LinkOrigin
    link_type_name: str
    source_id: int
    target_id: int


class LinkUpdate(BaseModel):
    link_type_name: str