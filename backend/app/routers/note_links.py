from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.schemas.note_link import NoteLinkResponse
from app.models.note_link import NoteLink, LinkType
from app.schemas.note_link import NoteLinkCreate

router = APIRouter(prefix="/links", tags=["links"])

def _get_or_create_link_type(db: Session, link_type_name: str) -> LinkType:
    link_type = db.query(LinkType).filter(LinkType.name == link_type_name).first()
    if link_type is None:
        link_type = LinkType(name=link_type_name)
        db.add(link_type)
    return link_type

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


@router.post("", response_model=NoteLinkResponse)
def create_link(link: NoteLinkCreate, db: Session = Depends(get_db)):
    if link.link_type_name == "":
        raise HTTPException(status_code=400, detail="Note type must not be empty")

    link_type = _get_or_create_link_type(db, link.link_type_name)

    new_link = NoteLink(
        origin=link.origin,
        link_type=link_type,
        source_id=link.source_id,
        target_id=link.target_id,
    )

    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link