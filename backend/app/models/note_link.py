from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class NoteLink(Base):
    __tablename__ = "note_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("notes.id"))
    target_id: Mapped[int] = mapped_column(ForeignKey("notes.id"))
    link_type_id: Mapped[int | None] = mapped_column(ForeignKey("link_types.id"))
    origin: Mapped[str]  # "manual" / "tag" / "ai"

    link_type: Mapped["LinkType | None"] = relationship(back_populates="links")
    source: Mapped["Note"] = relationship(
        back_populates="outgoing_links", foreign_keys=[source_id]
    )
    target: Mapped["Note"] = relationship(
        back_populates="incoming_links", foreign_keys=[target_id]
    )


class LinkType(Base):
    __tablename__ = "link_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    links: Mapped[list["NoteLink"]] = relationship(back_populates="link_type")