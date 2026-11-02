"""Database models for notes, note types, and tags.

This module defines the main SQLAlchemy persistence layer for the note system.
It includes the core Note entity, the categorization model NoteType, and the
Tag model for assigning labels to notes. It also defines the many-to-many join
table for note-tag associations and the relationships for note-to-note links.
"""

import datetime
from typing import TYPE_CHECKING

from sqlalchemy import func, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from domains.notes.constants import DEFAULT_NOTE_STATUS, DEFAULT_NOTE_TITLE
from domains.utils import generate_uuid

if TYPE_CHECKING:
    from domains.links.models import Link


# Association table linking notes to tags.
# A note can have many tags, and each tag can be assigned to many notes.
note_has_tags = Table(
    "note_has_tags",
    Base.metadata,
    Column("note_id", ForeignKey("notes.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


class Note(Base):
    """Represents a user note or concept entry in the knowledge graph.

    Notes are the core unit of content in the application. They can belong to a
    type, carry tags, and have relationships to other notes as both outbound and
    inbound links.
    """

    __tablename__ = "notes"

    # Primary identifier generated automatically with a UUID helper.
    id: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)

    # Display title, defaulting to the app's fallback value for untitled notes.
    title: Mapped[str] = mapped_column(default=DEFAULT_NOTE_TITLE)

    # Main content of the note. Empty by default.
    content: Mapped[str] = mapped_column(default="")

    # Current workflow/status value of the note.
    status: Mapped[str] = mapped_column(default=DEFAULT_NOTE_STATUS)

    # Boolean flags for note organization or visibility behavior.
    is_archived: Mapped[bool] = mapped_column(default=False)
    is_pinned: Mapped[bool] = mapped_column(default=False)
    is_private: Mapped[bool] = mapped_column(default=False)

    # Creation and modification timestamps.
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=func.now())
    modified_at: Mapped[datetime.datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    # N:1 relationship with NoteType.
    note_type_id: Mapped[str] = mapped_column(ForeignKey("note_types.id"))
    note_type: Mapped["NoteType"] = relationship(back_populates="notes")

    # N:M relationship with Tag through the note_has_tags association table.
    tags: Mapped[list["Tag"]] = relationship(
        secondary=note_has_tags, back_populates="notes"
    )

    # N:M relationship with self, representing outbound links from this note.
    outgoing_links: Mapped[list["Link"]] = relationship(
        back_populates="source",
        foreign_keys="Link.source_id",
        cascade="all, delete-orphan",
    )

    # N:M relationship with self, representing inbound links to this note.
    incoming_links: Mapped[list["Link"]] = relationship(
        back_populates="target",
        foreign_keys="Link.target_id",
        cascade="all, delete-orphan",
    )


class NoteType(Base):
    """Category used to classify notes.

    Examples might include "idea", "task", "reference", or any custom grouping
    created by the application. Each note type can be shared by many notes.
    """

    __tablename__ = "note_types"

    # Unique identifier for the note type.
    id: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)

    # Unique human-readable name for the category.
    name: Mapped[str] = mapped_column(unique=True)

    # All notes assigned to this type.
    notes: Mapped[list["Note"]] = relationship(back_populates="note_type")


class Tag(Base):
    """Label used to categorize or organize notes.

    Tags are lightweight metadata that allow cross-cutting classification across
    notes without requiring a rigid hierarchy.
    """

    __tablename__ = "tags"

    # Unique identifier for the tag.
    id: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)

    # Unique tag name shared across notes.
    name: Mapped[str] = mapped_column(unique=True)

    # Notes associated with this tag.
    notes: Mapped[list["Note"]] = relationship(
        secondary=note_has_tags, back_populates="tags"
    )