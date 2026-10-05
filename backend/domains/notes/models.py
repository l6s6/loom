import datetime
from typing import TYPE_CHECKING

from sqlalchemy import func, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base

if TYPE_CHECKING:
    from domains.links.models  import NoteLink


note_has_tags = Table(
    "note_has_tags",
    Base.metadata,
    Column("note_id", ForeignKey("notes.id"), primary_key=True),
    Column("tag_id", ForeignKey("note_tags.id"), primary_key=True),
)


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(default="Untitled")
    content: Mapped[str] = mapped_column(default="")
    status: Mapped[str] = mapped_column(default="none")
    is_archived: Mapped[bool] = mapped_column(default=False)
    is_pinned: Mapped[bool] = mapped_column(default=False)
    is_private: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=func.now())
    modified_at: Mapped[datetime.datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    # N:1 relationship with NoteType
    note_type_id: Mapped[int] = mapped_column(ForeignKey("note_types.id"))
    note_type: Mapped["NoteType"] = relationship(back_populates="notes")

    # N:M relationship with NoteTag
    tags: Mapped[list["NoteTag"]] = relationship(
        secondary=note_has_tags, back_populates="notes"
    )

    # N:M relationship with self, via the NoteLink association object
    outgoing_links: Mapped[list["NoteLink"]] = relationship(
        back_populates="source",
        foreign_keys="NoteLink.source_id",
        cascade="all, delete-orphan"
    )
    incoming_links: Mapped[list["NoteLink"]] = relationship(
        back_populates="target",
        foreign_keys="NoteLink.target_id",
        cascade="all, delete-orphan"
    )


class NoteType(Base):
    __tablename__ = "note_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    notes: Mapped[list["Note"]] = relationship(back_populates="note_type")


class NoteTag(Base):
    __tablename__ = "note_tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    notes: Mapped[list["Note"]] = relationship(
        secondary=note_has_tags, back_populates="tags"
    )


