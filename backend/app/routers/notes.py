from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.sql.operators import or_

from app.db.database import get_db
from app.schemas.note import NoteResponse, NoteStatus, NoteUpdate
from app.models import Note, NoteType, NoteTag

router = APIRouter(prefix="/notes", tags=["notes"])

def _get_note_or_404(db: Session, note_id: int) -> Note:
    note = db.query(Note).filter(Note.id == note_id).first()
    if note is None:
        raise HTTPException(status_code=404, detail=f"Note with id {note_id} not found")
    return note

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
        filters.append(Note.tags.any(NoteTag.name == tag))
    if search is not None:
        filters.append(or_(Note.title.ilike(f"%{search}%"), Note.content.ilike(f"%{search}%")))

    # Using selectinload for tags instead of joinedLoad for better performance on N:M relationships
    return db.query(Note).options(joinedload(Note.note_type), selectinload(Note.tags)).filter(*filters).all()


@router.post("", response_model=NoteResponse)
def create_note(db: Session = Depends(get_db)):
    note_type = _get_or_create_note_type(db, "None")

    new_note = Note(note_type=note_type)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    return _get_note_or_404(db, note_id)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    note =  _get_note_or_404(db, note_id)

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

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note =  _get_note_or_404(db, note_id)

    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}