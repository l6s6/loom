from pydantic import BaseModel, ConfigDict
from app.schemas.note import NoteSummary
from app.schemas.link_type import LinkTypeResponse


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
