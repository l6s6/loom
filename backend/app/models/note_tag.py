from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.associations import note_has_tags


class NoteTag(Base):
    __tablename__ = "note_tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    notes: Mapped[list["Note"]] = relationship(
        secondary=note_has_tags, back_populates="tags"
    )