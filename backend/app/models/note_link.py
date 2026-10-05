from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.note import Note
    from app.models.link_type import LinkType


class NoteLink(Base):
    __tablename__ = "note_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("notes.id"), index=True)
    target_id: Mapped[int] = mapped_column(ForeignKey("notes.id"), index=True)
    link_type_id: Mapped[int] = mapped_column(ForeignKey("link_types.id"), default="relates to")
    origin: Mapped[str] = mapped_column(default="manual")  # "manual" / "tag" / "ai"

    __table_args__ = (
        UniqueConstraint("source_id", "target_id", "origin", name="uq_note_link"),
    )

    link_type: Mapped["LinkType"] = relationship(back_populates="links")
    source: Mapped["Note"] = relationship(
        back_populates="outgoing_links", foreign_keys=[source_id]
    )
    target: Mapped["Note"] = relationship(
        back_populates="incoming_links", foreign_keys=[target_id]
    )