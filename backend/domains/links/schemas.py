"""Pydantic schemas for link-related API payloads and responses.

These models define the request and response contracts used by the link API.
They validate data coming from clients and shape the data returned to clients
while keeping the ORM models decoupled from the API layer.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict

from domains.notes.schemas import NoteSummary


class LinkOrigin(str, Enum):
    """Allowed values for how a link was created.

    These values distinguish human-created relationships from those created by
    automated systems such as tagging or AI-generated associations.
    """

    manual = "manual"
    tag = "tag"
    ai = "ai"


class LinkTypeResponse(BaseModel):
    """Schema returned for a link type object.

    This model is used in API responses to expose link category metadata without
    leaking internal ORM details.
    """

    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str


class LinkResponse(BaseModel):
    """Schema returned for a complete link record.

    It includes the relationship metadata and both endpoint notes so clients can
    render the link graph or details without making additional requests.
    """

    model_config = ConfigDict(from_attributes=True)

    id: str
    origin: LinkOrigin
    link_type: LinkTypeResponse
    source: NoteSummary
    target: NoteSummary


class LinkCreate(BaseModel):
    """Payload used to create a new link between two notes.

    The payload requires the relationship type as a string and the identifiers of
    the source and target notes. The origin indicates how the link was created.
    """

    origin: LinkOrigin
    link_type_name: str
    source_id: str
    target_id: str


class LinkUpdate(BaseModel):
    """Payload used to update a link's type.

    Only the relationship type is currently mutable through the update endpoint.
    Other properties such as source, target, or origin are not exposed here.
    """

    link_type_name: Optional[str] = None