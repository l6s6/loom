from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from domains.notes.models import Note


class NoteLink(Base):
    __tablename__ = "note_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("notes.id", ondelete="CASCADE"), index=True)
    target_id: Mapped[int] = mapped_column(ForeignKey("notes.id", ondelete="CASCADE"), index=True)
    link_type_id: Mapped[int] = mapped_column(ForeignKey("link_types.id"))
    origin: Mapped[str] = mapped_column(default="manual")  # "manual" / "tag" / "ai"

    __table_args__ = (
        UniqueConstraint("source_id", "target_id", "origin", "link_type_id", name="uq_note_link"),
    )

    link_type: Mapped["LinkType"] = relationship(back_populates="links")
    source: Mapped["Note"] = relationship(
        back_populates="outgoing_links", foreign_keys=[source_id]
    )
    target: Mapped["Note"] = relationship(
        back_populates="incoming_links", foreign_keys=[target_id]
    )


class LinkType(Base):
    __tablename__ = "link_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    links: Mapped[list["NoteLink"]] = relationship(back_populates="link_type")