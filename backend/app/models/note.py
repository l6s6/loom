from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean

from app.db.database import Base



class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    note_type = Column(String)
    status = Column(String)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime,  default=datetime.now)
    modified_at = Column(DateTime,  default=datetime.now)