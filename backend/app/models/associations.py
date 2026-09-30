from sqlalchemy import Table, Column, ForeignKey

from app.db.database import Base

note_has_tags = Table(
    "note_has_tags",
    Base.metadata,
    Column("note_id", ForeignKey("notes.id"), primary_key=True),
    Column("tag_id", ForeignKey("note_tags.id"), primary_key=True),
)