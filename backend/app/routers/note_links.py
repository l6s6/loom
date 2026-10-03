from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models.note_tag import NoteTag
from app.schemas.note_link import NoteLinkResponse
from app.models.note_link import NoteLink, LinkType

router = APIRouter(prefix="/links", tags=["links"])

@router.get("", response_model=list[NoteLinkResponse])
def get_links(db: Session = Depends(get_db), source_id: int | None = None, target_id: int | None = None, origin: str | None = None, type: str | None = None):
    filters = []

    if source_id is not None:
        filters.append(NoteLink.source_id == source_id)
    if target_id is not None:
        filters.append(NoteLink.target_id == target_id)
    if origin is not None:
        filters.append(NoteLink.origin == origin)
    if type is not None:
        filters.append(NoteLink.link_type.has(name=type))


    return db.query(NoteLink).options(joinedload(NoteLink.link_type)).filter(*filters).all()

@router.get("/types", response_model=list[NoteLinkResponse])
def get_link_types(db: Session = Depends(get_db)):
    return db.query(LinkType).all()