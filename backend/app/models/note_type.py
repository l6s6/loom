from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.note import Note


class NoteType(Base):
    __tablename__ = "note_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    notes: Mapped[list["Note"]] = relationship(back_populates="note_type")