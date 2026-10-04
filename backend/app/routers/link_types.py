from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models import LinkType
from app.schemas.note_link import LinkTypeResponse

router = APIRouter(prefix="/links/types", tags=["link_types"])

@router.get("", response_model=list[LinkTypeResponse])
def get_link_types(db: Session = Depends(get_db)):
    return db.query(LinkType).all()