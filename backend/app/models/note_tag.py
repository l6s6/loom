from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base

association_table = Table(
    "association_table",
    Base.metadata,
    Column("note_id", ForeignKey("notes.id"), primary_key=True),
    Column("tags_id", ForeignKey("note_tags.id"), primary_key=True),
)

class NoteTag(Base):
    __tablename__ = "note_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    notes = relationship(
        "Note",
        secondary=association_table, back_populates="tags"
    )


