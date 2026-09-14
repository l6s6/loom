from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models.note import *
from app.schemas.note import *
from app.models.note_type import NoteType
from app.schemas.note_type import NoteTypeResponse
from app.models.note_tag import NoteTag

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)


@router.get("/", response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).options(joinedload(Note.note_type)).all()


@router.post("/", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    note_type_name = note.note_type_name
    if note_type_name == "":
        raise HTTPException(status_code=400, detail=f"Note type must not be empty")

    note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
    if note_type is None:
        note_type = NoteType(name=note_type_name)
        db.add(note_type)


    new_note = Note(title=note.title, content=note.content, note_type=note_type,
                    status=note.status.value if note.status else None)

    for tag_name in note.tag_names:
        if tag_name == "":
            continue
        tag = db.query(NoteTag).filter(NoteTag.name == tag_name).first()
        if tag is None:
            tag = NoteTag(name=tag_name)
            db.add(tag)
        if tag not in new_note.tags:
            new_note.tags.append(tag)

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.get("/types", response_model=list[NoteTypeResponse])
def get_note_types(db: Session = Depends(get_db)):
    return db.query(NoteType).all()

@router.get("/tags", response_model=list[NoteTagResponse])
def get_note_types(db: Session = Depends(get_db)):
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
            raise HTTPException(status_code=400, detail=f"Note type must not be empty")

        note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
        if note_type is None:
            note_type = NoteType(name=note_type_name)
            db.add(note_type)
        setattr(note, "note_type", note_type)
        del update_data["note_type_name"]

    if "tag_names" in update_data:
        note.tags = []
        tag_names = update_data["tag_names"]
        for tag_name in tag_names:
            if tag_name == "":
                continue
            tag = db.query(NoteTag).filter(NoteTag.name == tag_name).first()
            if tag is None:
                tag = NoteTag(name=tag_name)
                db.add(tag)
            if tag not in note.tags:
                note.tags.append(tag)
        del update_data["tag_names"]

    for key, value in update_data.items():
        setattr(note, key, value)

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
