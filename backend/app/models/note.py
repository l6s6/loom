from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.note_tag import has_tag
from app.models.link_type import NoteLink


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    status = Column(String)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime,  default=datetime.now)
    modified_at = Column(DateTime,  default=datetime.now)

    note_type = relationship("NoteType", back_populates="notes")
    note_type_id = Column(Integer, ForeignKey('note_types.id'), nullable=False)

    tags = relationship(
        "NoteTag",
        secondary=has_tag, back_populates="notes"
    )

    outgoing_links = relationship(
        "NoteLink",
        foreign_keys=[NoteLink.source_id],
        back_populates="source"
    )

    incoming_links = relationship(
        "NoteLink",
        foreign_keys=[NoteLink.target_id],
        back_populates="target"
    )


