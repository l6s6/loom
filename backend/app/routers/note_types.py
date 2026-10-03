from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.note_type import NoteTypeResponse
from app.models.note_type import NoteType

router = APIRouter(prefix="/notes/types", tags=["note_types"])

@router.get("", response_model=list[NoteTypeResponse])
def get_note_types(db: Session = Depends(get_db)):
    return db.query(NoteType).all()