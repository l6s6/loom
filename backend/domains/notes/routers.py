from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.sql.operators import or_, and_

from core.database import get_db
from domains.notes.constants import DEFAULT_NOTE_TYPE_NAME
from domains.notes.schemas import NoteResponse, NoteStatus, NoteUpdate, NoteTypeResponse, TagResponse, TagCreate, \
    TagUpdate, TagWithCount, NoteTypeWithCount, NoteTypeCreate, NoteTypeUpdate
from domains.notes.models import Note, NoteType, Tag, note_has_tags

router = APIRouter(prefix="/notes", tags=["notes"])


def get_note_or_404(db: Session, note_id: str) -> Note:
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")
    return note


def get_tag_or_404(db: Session, tag_id: str) -> Note:
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if tag is None:
        raise HTTPException(status_code=404, detail=f"Tag with id {tag_id} not found")
    return tag


def get_note_type_or_404(db: Session, type_id: str) -> Note:
    type = db.query(NoteType).filter(NoteType.id == type_id).first()
    if type is None:
        raise HTTPException(status_code=404, detail=f"Note type with id {type_id} not found")
    return type


def _get_or_create_note_type(db: Session, note_type_name: str) -> NoteType:
    note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
    if note_type is None:
        note_type = NoteType(name=note_type_name)
        db.add(note_type)
    return note_type


def _get_or_create_tag(db: Session, tag_name: str) -> Tag:
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if tag is None:
        tag = Tag(name=tag_name)
        db.add(tag)
    return tag


def _apply_tags(db: Session, note: Note, tag_names: list[str]) -> None:
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
    search: str | None = None,
):
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
    if tag is not None:
        filters.append(Note.tags.any(Tag.name == tag))
    if search is not None:
        filters.append(or_(Note.title.ilike(f"%{search}%"), Note.content.ilike(f"%{search}%")))

    # Using selectinload for tags instead of joinedLoad for better performance on N:M relationships
    return db.query(Note).options(joinedload(Note.note_type), selectinload(Note.tags)).filter(*filters).all()


@router.get("/types", response_model=list[NoteTypeWithCount])
def get_note_types(db: Session = Depends(get_db)):
    results = (
        db.query(NoteType, func.count(Note.id).label("note_count"))
        .outerjoin(Note, and_(
            Note.note_type_id == NoteType.id,
            Note.is_archived == False
        ))
        .group_by(NoteType.id)
        .all()
    )
    formatted_types = []
    for note_type, count in results:
        formatted_types.append({
            "id": note_type.id,
            "name": note_type.name,
            "note_count": count
        })

    return formatted_types


@router.get("/tags", response_model=list[TagWithCount])
def get_tags(db: Session = Depends(get_db)):
    results = (
        db.query(Tag, func.count(note_has_tags.c.note_id).label("note_count"))
        .outerjoin(note_has_tags, note_has_tags.c.tag_id == Tag.id)
        .outerjoin(Note, and_(
            Note.id == note_has_tags.c.note_id,
            Note.is_archived == False
        ))
        .group_by(Tag.id)
        .all()
    )
    formatted_tags = []
    for tag, count in results:
        formatted_tags.append({
            "id": tag.id,
            "name": tag.name,
            "note_count": count
        })

    return formatted_tags


@router.post("/tags", response_model=TagResponse)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    if db.query(Tag).filter(Tag.name == tag.name).first():
        raise HTTPException(status_code=409, detail=f"Tag with name {tag.name} already exists")

    new_tag = Tag(name=tag.name)
    db.add(new_tag)

    db.commit()
    db.refresh(new_tag)
    return new_tag

@router.post("/types", response_model=TagResponse)
def create_tag(type: NoteTypeCreate, db: Session = Depends(get_db)):
    if db.query(NoteType).filter(NoteType.name == type.name).first():
        raise HTTPException(status_code=409, detail=f"Note type with name {type.name} already exists")

    new_type = NoteType(name=type.name)
    db.add(new_type)

    db.commit()
    db.refresh(new_type)
    return new_type


@router.put("/tags/{tag_id}", response_model=TagResponse)
def update_note(tag_id: str, tag_update: TagUpdate, db: Session = Depends(get_db)):
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
    tag = get_tag_or_404(db, tag_id)

    db.delete(tag)
    db.commit()
    return {"message": "Tag deleted"}


@router.delete("/types/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note_type(type_id: str, db: Session = Depends(get_db)):
    type = get_note_type_or_404(db, type_id)

    db.delete(type)
    db.commit()
    return {"message": "Note type deleted"}


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(db: Session = Depends(get_db)):
    note_type = _get_or_create_note_type(db, DEFAULT_NOTE_TYPE_NAME)

    new_note = Note(note_type=note_type)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note







@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: str, db: Session = Depends(get_db)):
    return get_note_or_404(db, note_id)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: str, note_update: NoteUpdate, db: Session = Depends(get_db)):
    note =  get_note_or_404(db, note_id)

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
    note =  get_note_or_404(db, note_id)

    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}
