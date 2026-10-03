from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.note_tag import NoteTag
from app.schemas.note_tag import NoteTagResponse

router = APIRouter(prefix="/notes/tags", tags=["note_tags"])

@router.get("/", response_model=list[NoteTagResponse])
def get_tag_types(db: Session = Depends(get_db)):
    return db.query(NoteTag).all()
