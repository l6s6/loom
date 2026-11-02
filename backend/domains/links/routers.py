from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql.operators import or_

from core.database import get_db
from domains.links.constants import DEFAULT_LINK_TYPE_NAME
from domains.links.models import Link, LinkType
from domains.links.schemas import LinkTypeResponse, LinkResponse, LinkCreate, LinkUpdate
from domains.notes.models import Note
from domains.notes.routers import get_note_or_404

# API router for all link-related endpoints.
# All routes under this router are prefixed with "/links" and tagged as "links".
router = APIRouter(prefix="/links", tags=["links"])


def _get_link_or_404(db: Session, link_id: str) -> Link:
    """Return a Link by ID or raise a 404 error if it does not exist.

    Args:
        db: Database session used for lookup.
        link_id: Unique identifier of the link to fetch.

    Returns:
        The matching Link ORM instance.

    Raises:
        HTTPException: If no link exists with the supplied ID.
    """
    note = db.query(Link).filter(Link.id == link_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Link with id {link_id} not found")
    return note


def _get_or_create_link_type(db: Session, link_type_name: str) -> LinkType:
    """Fetch an existing link type by name or create it if absent.

    This helper centralizes the pattern used to ensure a given relationship type
    exists before attaching it to a new link.

    Args:
        db: Database session used for lookup and persistence.
        link_type_name: Human-readable label for the relationship type.

    Returns:
        An existing or newly created LinkType instance.
    """
    link_type = db.query(LinkType).filter(LinkType.name == link_type_name).first()
    if link_type is None:
        link_type = LinkType(name=link_type_name)
        db.add(link_type)
    return link_type


@router.get("", response_model=list[LinkResponse])
def get_links(
    db: Session = Depends(get_db),
    note_id: str | None = None,
    source_id: str | None = None,
    target_id: str | None = None,
    origin: str | None = None,
    type: str | None = None,
):
    """Retrieve links with optional filtering by note, source, target, origin, or type.

    Args:
        db: Database session provided by dependency injection.
        note_id: If provided, returns links where the note is either the source or target.
        source_id: Filter for links whose source note matches this ID.
        target_id: Filter for links whose target note matches this ID.
        origin: Filter for links created with the specified origin.
        type: Filter for links whose associated LinkType name matches this value.

    Returns:
        A list of Link records with related link type and note data eagerly loaded.
    """
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

    return (
        db.query(Link)
        .options(
            joinedload(Link.link_type),
            joinedload(Link.source).joinedload(Note.note_type),
            joinedload(Link.target).joinedload(Note.note_type),
        )
        .filter(*filters)
        .all()
    )


@router.get("/types", response_model=list[LinkTypeResponse])
def get_link_types(db: Session = Depends(get_db)):
    """Return all available link type definitions.

    Args:
        db: Database session provided by dependency injection.

    Returns:
        A list of all LinkType rows.
    """
    return db.query(LinkType).all()


@router.post("", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(link: LinkCreate, db: Session = Depends(get_db)):
    """Create a new note-to-note link.

    Validation ensures both referenced notes exist. If no link_type_name is supplied,
    the default relationship type is used. The associated LinkType is created when needed.

    Args:
        link: Payload describing the source note, target note, origin, and link type.
        db: Database session provided by dependency injection.

    Returns:
        The newly created Link record.

    Raises:
        HTTPException: If either note does not exist.
    """
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
def update_note(link_id: str, link_update: LinkUpdate, db: Session = Depends(get_db)):
    """Update an existing link record, including its relationship type when provided.

    Args:
        link_id: Unique identifier of the link to update.
        link_update: Partial update payload containing fields to modify.
        db: Database session provided by dependency injection.

    Returns:
        The updated Link record.

    Raises:
        HTTPException: If the target link does not exist.
    """
    link = _get_link_or_404(db, link_id)

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
def delete_note(link_id: str, db: Session = Depends(get_db)):
    """Delete a link by ID.

    Args:
        link_id: Unique identifier of the link to remove.
        db: Database session provided by dependency injection.

    Raises:
        HTTPException: If the target link does not exist.

    Returns:
        A success message payload.
    """
    link = _get_link_or_404(db, link_id)

    db.delete(link)
    db.commit()
    return {"message": "Link deleted"}