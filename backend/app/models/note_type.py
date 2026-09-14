from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base



class NoteType(Base):
    __tablename__ = "note_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    notes = relationship("Note", back_populates="note_type")
