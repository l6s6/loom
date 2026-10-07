from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql.operators import or_

from core.database import get_db
from domains.links.constants import DEFAULT_LINK_TYPE_NAME
from domains.links.models import Link, LinkType
from domains.notes.models import Note
from domains.notes.routers import get_note_or_404

from domains.links.schemas import LinkTypeResponse, LinkResponse, LinkCreate, LinkUpdate

router = APIRouter(prefix="/links", tags=["links"])


def _get_link_or_404(db: Session, link_id: int) -> Link:
    note = db.query(Link).filter(Link.id == link_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Link with id {link_id} not found")
    return note


def _get_or_create_link_type(db: Session, link_type_name: str) -> LinkType:
    link_type = db.query(LinkType).filter(LinkType.name == link_type_name).first()
    if link_type is None:
        link_type = LinkType(name=link_type_name)
        db.add(link_type)
    return link_type




@router.get("", response_model=list[LinkResponse])
def get_links(db: Session = Depends(get_db),
              note_id: int | None = None,
              source_id: int | None = None,
              target_id: int | None = None,
              origin: str | None = None,
              type: str | None = None):
    filters = []
    if note_id is not None:
        filters.append(or_(Link.source_id == note_id, Link.target_id == note_id))
    if source_id is not None:
        filters.append(Link.source_id == source_id)
    if target_id is not None:
        filters.append(Link.target_id == target_id)
    if origin is not None:
        filters.append(Link.origin == origin)
    if type is not None:
        filters.append(Link.link_type.has(name=type))

    return db.query(Link).options(joinedload(Link.link_type),
                                  joinedload(Link.source).joinedload(Note.note_type),
                                  joinedload(Link.target).joinedload(Note.note_type),
                                  ).filter(*filters).all()


@router.get("/types", response_model=list[LinkTypeResponse])
def get_link_types(db: Session = Depends(get_db)):
    return db.query(LinkType).all()


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(link: LinkCreate, db: Session = Depends(get_db)):
    # Validating foreign keys
    get_note_or_404(db, link.source_id)
    get_note_or_404(db, link.target_id)

    link_type_name = link.link_type_name
    if link_type_name == "":
        link_type_name = DEFAULT_LINK_TYPE_NAME

    link_type = _get_or_create_link_type(db, link_type_name)

    new_link = Link(
        origin=link.origin,
        link_type=link_type,
        source_id=link.source_id,
        target_id=link.target_id,
    )

    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link


@router.put("/{link_id}", response_model=LinkResponse)
def update_note(link_id: int, link_update: LinkUpdate, db: Session = Depends(get_db)):
    link =  _get_link_or_404(db, link_id)

    update_data = link_update.model_dump(exclude_unset=True)

    if "link_type_name" in update_data:
        link_type_name = update_data["link_type_name"]
        if link_type_name == "":
            link_type_name = DEFAULT_LINK_TYPE_NAME

        link.link_type = _get_or_create_link_type(db, link_type_name)
        del update_data["link_type_name"]

    db.commit()
    db.refresh(link)
    return link



@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(link_id: int, db: Session = Depends(get_db)):
    link =  _get_link_or_404(db, link_id)

    db.delete(link)
    db.commit()
    return {"message": "Link deleted"}