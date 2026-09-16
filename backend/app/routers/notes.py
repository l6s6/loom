from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql.operators import or_

from app.db.database import get_db
from app.models.note import Note
from app.models.note_tag import NoteTag
from app.models.note_type import NoteType
from app.schemas.note import NoteCreate, NoteResponse, NoteStatus, NoteUpdate
from app.schemas.note_tag import NoteTagResponse
from app.schemas.note_type import NoteTypeResponse

router = APIRouter(prefix="/notes", tags=["notes"])


def _get_or_create_note_type(db: Session, note_type_name: str) -> NoteType:
    note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
    if note_type is None:
        note_type = NoteType(name=note_type_name)
        db.add(note_type)
    return note_type


def _get_or_create_tag(db: Session, tag_name: str) -> NoteTag:
    tag = db.query(NoteTag).filter(NoteTag.name == tag_name).first()
    if tag is None:
        tag = NoteTag(name=tag_name)
        db.add(tag)
    return tag


def _apply_tags(db: Session, note: Note, tag_names: list[str]) -> None:
    note.tags = []
    for tag_name in tag_names:
        if tag_name == "":
            continue
        tag = _get_or_create_tag(db, tag_name)
        if tag not in note.tags:
            note.tags.append(tag)


@router.get("", response_model=list[NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    note_type_name: str | None = None,
    tag: str | None = None,
    status: NoteStatus | None = None,
    is_archived: bool | None = None,
    search: str | None = None,
):
    filters = []

    if note_type_name is not None:
        filters.append(Note.note_type.has(name=note_type_name))
    if status is not None:
        filters.append(Note.status == status)
    if is_archived is not None:
        filters.append(Note.is_archived == is_archived)
    if tag is not None:
        filters.append(Note.tags.any(NoteTag.name == tag))
    if search is not None:
        filters.append(or_(Note.title.ilike(f"%{search}%"), Note.content.ilike(f"%{search}%")))

    return db.query(Note).options(joinedload(Note.note_type)).filter(*filters).all()


@router.post("", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    if note.note_type_name == "":
        raise HTTPException(status_code=400, detail="Note type must not be empty")

    note_type = _get_or_create_note_type(db, note.note_type_name)

    new_note = Note(
        title=note.title,
        content=note.content,
        note_type=note_type,
        status=note.status,
    )

    _apply_tags(db, new_note, note.tag_names)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.get("/types", response_model=list[NoteTypeResponse])
def get_note_types(db: Session = Depends(get_db)):
    return db.query(NoteType).all()


@router.get("/tags", response_model=list[NoteTagResponse])
def get_tag_types(db: Session = Depends(get_db)):
    return db.query(NoteTag).all()


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")
    return note


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")

    update_data = note_update.model_dump(exclude_unset=True)

    if "note_type_name" in update_data:
        note_type_name = update_data["note_type_name"]
        if note_type_name == "":
            raise HTTPException(status_code=400, detail="Note type must not be empty")

        note.note_type = _get_or_create_note_type(db, note_type_name)
        del update_data["note_type_name"]

    if "tag_names" in update_data:
        _apply_tags(db, note, update_data["tag_names"])
        del update_data["tag_names"]

    for key, value in update_data.items():
        setattr(note, key, value)

    note.modified_at = datetime.now()

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")

    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}