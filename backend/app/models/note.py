from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base



class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    status = Column(String)
    note_type = relationship("NoteType", back_populates="notes")
    note_type_id = Column(Integer, ForeignKey('note_type.id'))
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime,  default=datetime.now)
    modified_at = Column(DateTime,  default=datetime.now)


class NoteType(Base):
    __tablename__ = "note_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    notes = relationship("Note", back_populates="note_type")
