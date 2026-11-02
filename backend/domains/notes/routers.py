"""FastAPI router for note-related API endpoints.

This module exposes the CRUD and query operations for notes, tags, and note
types. It acts as the application layer between the HTTP API and the SQLAlchemy
database models, validating access patterns and managing relationships such as
note tags and note categories.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.sql.operators import or_, and_

from core.database import get_db
from domains.links.models import Link
from domains.notes.constants import DEFAULT_NOTE_TYPE_NAME
from domains.notes.models import Note, NoteType, Tag, note_has_tags
from domains.notes.schemas import (
    NoteResponse,
    NoteStatus,
    NoteUpdate,
    NoteTypeResponse,
    TagResponse,
    TagCreate,
    TagUpdate,
    TagWithCount,
    NoteTypeWithCount,
    NoteTypeCreate,
    NoteTypeUpdate,
)

# Router for all note endpoints, prefixed under "/notes".
router = APIRouter(prefix="/notes", tags=["notes"])


def get_note_or_404(db: Session, note_id: str) -> Note:
    """Fetch a note by ID or raise a 404 if it does not exist.

    Args:
        db: Database session used for the lookup.
        note_id: Unique identifier of the note.

    Returns:
        The matching Note record.

    Raises:
        HTTPException: If no note with the given ID exists.
    """
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")
    return note


def get_tag_or_404(db: Session, tag_id: str) -> Note:
    """Fetch a tag by ID or raise a 404 if it does not exist.

    Args:
        db: Database session used for the lookup.
        tag_id: Unique identifier of the tag.

    Returns:
        The matching Tag record.

    Raises:
        HTTPException: If no tag with the given ID exists.
    """
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail=f"Tag with id {tag_id} not found")
    return tag


def get_note_type_or_404(db: Session, type_id: str) -> Note:
    """Fetch a note type by ID or raise a 404 if it does not exist.

    Args:
        db: Database session used for the lookup.
        type_id: Unique identifier of the note type.

    Returns:
        The matching NoteType record.

    Raises:
        HTTPException: If no note type with the given ID exists.
    """
    type = db.query(NoteType).filter(NoteType.id == type_id).first()
    if type is None:
        raise HTTPException(status_code=404, detail=f"Note type with id {type_id} not found")
    return type


def _get_or_create_note_type(db: Session, note_type_name: str) -> NoteType:
    """Return an existing note type by name or create it if absent.

    Args:
        db: Database session used for lookup and creation.
        note_type_name: Name of the note type.

    Returns:
        The existing or newly created NoteType instance.
    """
    note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
    if note_type is None:
        note_type = NoteType(name=note_type_name)
        db.add(note_type)
    return note_type


def _get_or_create_tag(db: Session, tag_name: str) -> Tag:
    """Return an existing tag by name or create it if absent.

    Args:
        db: Database session used for lookup and creation.
        tag_name: Name of the tag.

    Returns:
        The existing or newly created Tag instance.
    """
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if tag is None:
        tag = Tag(name=tag_name)
        db.add(tag)
    return tag


def _apply_tags(db: Session, note: Note, tag_names: list[str]) -> None:
    """Replace a note's tag collection with normalized tag records.

    Empty or whitespace-only tag names are ignored. Existing tags are created if
    they do not already exist, then assigned to the note.

    Args:
        db: Database session used for tag creation.
        note: The note whose tags will be updated.
        tag_names: List of tag names to assign to the note.
    """
    new_tags = []
    for tag_name in tag_names:
        if tag_name.strip():
            new_tags.append(_get_or_create_tag(db, tag_name.strip()))
    note.tags = new_tags


@router.get("", response_model=list[NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    type: str | None = None,
    tag: str | None = None,
    status: NoteStatus | None = None,
    is_archived: bool | None = None,
    is_pinned: bool | None = None,
    is_private: bool | None = None,
    is_loose_end: bool | None = None,
    search: str | None = None,
):
    """Return notes matching optional filters such as type, tag, status, and text search.

    Args:
        db: Database session provided via FastAPI dependency injection.
        type: Filter by note type name.
        tag: Filter by tag name.
        status: Filter by note status.
        is_archived: Filter archived notes.
        is_pinned: Filter pinned notes.
        is_private: Filter private notes.
        is_loose_end: Filter notes that are either connected or disconnected from links.
        search: Case-insensitive text search across note title and content.

    Returns:
        List of matching Note records with their related type and tags loaded.
    """
    filters = []

    if type is not None:
        filters.append(Note.note_type.has(name=type))
    if status is not None:
        filters.append(Note.status == status)
    if is_archived is not None:
        filters.append(Note.is_archived == is_archived)
    if is_pinned is not None:
        filters.append(Note.is_pinned == is_pinned)
    if is_private is not None:
        filters.append(Note.is_private == is_private)
    if is_loose_end is not None:
        has_outgoing = db.query(Link.source_id)
        has_incoming = db.query(Link.target_id)

        if is_loose_end:
            filters.append(Note.id.notin_(has_outgoing))
            filters.append(Note.id.notin_(has_incoming))
        else:
            filters.append(
                or_(
                    Note.id.in_(has_outgoing),
                    Note.id.in_(has_incoming),
                )
            )
    if tag is not None:
        filters.append(Note.tags.any(Tag.name == tag))
    if search is not None:
        filters.append(or_(Note.title.ilike(f"%{search}%"), Note.content.ilike(f"%{search}%")))

    # Use selectinload for tags to minimize N:M query overhead.
    return (
        db.query(Note)
        .options(joinedload(Note.note_type), selectinload(Note.tags))
        .filter(*filters)
        .all()
    )


@router.get("/types", response_model=list[NoteTypeWithCount])
def get_note_types(db: Session = Depends(get_db)) -> list[NoteTypeWithCount]:
    """Return note types with the number of active (non-archived) notes in each.

    Args:
        db: Database session provided via dependency injection.

    Returns:
        List of NoteTypeWithCount entries containing type metadata and counts.
    """
    results = (
        db.query(NoteType, func.count(Note.id).label("note_count"))
        .outerjoin(Note, and_(Note.note_type_id == NoteType.id, Note.is_archived == False))
        .group_by(NoteType.id)
        .all()
    )
    formatted_types = []
    for note_type, count in results:
        formatted_types.append(
            NoteTypeWithCount(
                id=note_type.id,
                name=note_type.name,
                note_count=count,
            )
        )

    return formatted_types


@router.get("/tags", response_model=list[TagWithCount])
def get_tags(db: Session = Depends(get_db)) -> list[TagWithCount]:
    """Return tags with the number of active (non-archived) notes assigned to each.

    Args:
        db: Database session provided via dependency injection.

    Returns:
        List of TagWithCount entries containing tag metadata and counts.
    """
    results = (
        db.query(Tag, func.count(note_has_tags.c.note_id).label("note_count"))
        .outerjoin(note_has_tags, note_has_tags.c.tag_id == Tag.id)
        .outerjoin(Note, and_(Note.id == note_has_tags.c.note_id, Note.is_archived == False))
        .group_by(Tag.id)
        .all()
    )
    formatted_tags = []
    for tag, count in results:
        formatted_tags.append(
            TagWithCount(
                id=tag.id,
                name=tag.name,
                note_count=count,
            )
        )

    return formatted_tags


@router.post("/tags", response_model=TagResponse)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag if it does not already exist.

    Args:
        tag: Request payload containing the tag name.
        db: Database session provided via dependency injection.

    Returns:
        The newly created Tag object.

    Raises:
        HTTPException: If a tag with the same name already exists.
    """
    if db.query(Tag).filter(Tag.name == tag.name).first():
        raise HTTPException(status_code=409, detail=f"Tag with name {tag.name} already exists")

    new_tag = Tag(name=tag.name)
    db.add(new_tag)

    db.commit()
    db.refresh(new_tag)
    return new_tag


@router.post("/types", response_model=TagResponse)
def create_tag(type: NoteTypeCreate, db: Session = Depends(get_db)):
    """Create a new note type if it does not already exist.

    Args:
        type: Request payload containing the note type name.
        db: Database session provided via dependency injection.

    Returns:
        The newly created NoteType object.

    Raises:
        HTTPException: If a note type with the same name already exists.
    """
    if db.query(NoteType).filter(NoteType.name == type.name).first():
        raise HTTPException(status_code=409, detail=f"Note type with name {type.name} already exists")

    new_type = NoteType(name=type.name)
    db.add(new_type)

    db.commit()
    db.refresh(new_type)
    return new_type


@router.put("/tags/{tag_id}", response_model=TagResponse)
def update_note(tag_id: str, tag_update: TagUpdate, db: Session = Depends(get_db)):
    """Update an existing tag.

    Args:
        tag_id: Unique identifier of the tag to update.
        tag_update: Partial payload containing the new tag name.
        db: Database session provided via dependency injection.

    Returns:
        The updated Tag object.

    Raises:
        HTTPException: If no tag is found or if the new name conflicts.
    """
    if db.query(Tag).filter(Tag.name == tag_update.name).first():
        raise HTTPException(status_code=409, detail=f"Tag with name {tag_update.name} already exists")

    tag = get_tag_or_404(db, tag_id)

    update_data = tag_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(tag, key, value)

    db.commit()
    db.refresh(tag)
    return tag


@router.put("/types/{type_id}", response_model=NoteTypeResponse)
def update_note(type_id: str, type_update: NoteTypeUpdate, db: Session = Depends(get_db)):
    """Update an existing note type.

    Args:
        type_id: Unique identifier of the note type to update.
        type_update: Partial payload containing the new type name.
        db: Database session provided via dependency injection.

    Returns:
        The updated NoteType object.

    Raises:
        HTTPException: If no note type is found or if the new name conflicts.
    """
    if db.query(NoteType).filter(NoteType.name == type_update.name).first():
        raise HTTPException(status_code=409, detail=f"Note type with name {type_update.name} already exists")

    type = get_note_type_or_404(db, type_id)

    update_data = type_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(type, key, value)

    db.commit()
    db.refresh(type)
    return type


@router.delete("/tags/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: str, db: Session = Depends(get_db)):
    """Delete a tag by ID.

    Args:
        tag_id: Unique identifier of the tag to delete.
        db: Database session provided via dependency injection.

    Raises:
        HTTPException: If the tag does not exist.
    """
    tag = get_tag_or_404(db, tag_id)

    db.delete(tag)
    db.commit()
    return {"message": "Tag deleted"}


@router.delete("/types/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note_type(type_id: str, db: Session = Depends(get_db)):
    """Delete a note type by ID.

    Args:
        type_id: Unique identifier of the note type to delete.
        db: Database session provided via dependency injection.

    Raises:
        HTTPException: If the note type does not exist.
    """
    type = get_note_type_or_404(db, type_id)

    db.delete(type)
    db.commit()
    return {"message": "Note type deleted"}


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(db: Session = Depends(get_db)):
    """Create a new note with the default note type.

    The note is automatically assigned the default note type configured in the
    application, then saved and returned to the caller.

    Args:
        db: Database session provided via dependency injection.

    Returns:
        The newly created Note object.
    """
    note_type = _get_or_create_note_type(db, DEFAULT_NOTE_TYPE_NAME)

    new_note = Note(note_type=note_type)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: str, db: Session = Depends(get_db)):
    """Fetch a single note by its ID.

    Args:
        note_id: Unique identifier of the note.
        db: Database session provided via dependency injection.

    Returns:
        The matching Note object.

    Raises:
        HTTPException: If the note does not exist.
    """
    return get_note_or_404(db, note_id)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: str, note_update: NoteUpdate, db: Session = Depends(get_db)):
    """Update an existing note, including optional note type and tag changes.

    Args:
        note_id: Unique identifier of the note to update.
        note_update: Payload containing the fields to update.
        db: Database session provided via dependency injection.

    Returns:
        The updated Note object.

    Raises:
        HTTPException: If the note does not exist.
    """
    note = get_note_or_404(db, note_id)

    update_data = note_update.model_dump(exclude_unset=True)

    if "note_type_name" in update_data:
        note_type_name = update_data["note_type_name"]
        if note_type_name == "":
            note_type_name = DEFAULT_NOTE_TYPE_NAME

        note.note_type = _get_or_create_note_type(db, note_type_name)
        del update_data["note_type_name"]

    if "tag_names" in update_data:
        _apply_tags(db, note, update_data["tag_names"])
        del update_data["tag_names"]

    for key, value in update_data.items():
        setattr(note, key, value)

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: str, db: Session = Depends(get_db)):
    """Delete a note by ID.

    Args:
        note_id: Unique identifier of the note to delete.
        db: Database session provided via dependency injection.

    Raises:
        HTTPException: If the note does not exist.
    """
    note = get_note_or_404(db, note_id)

    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}