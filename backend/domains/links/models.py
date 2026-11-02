"""Database models for note-to-note links and link types.

This module defines the SQLAlchemy models used to store relationships between notes.
Each Link represents a directional connection from one note to another, and each
LinkType categorizes the relationship (for example, "relates to" or "depends on").
"""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base
from domains.links.constants import DEFAULT_LINK_ORIGIN
from domains.utils import generate_uuid

if TYPE_CHECKING:
    from domains.notes.models import Note


class Link(Base):
    """Represents a directed relationship between two notes.

    A link connects a source note to a target note and records the relationship
    origin and category. The combination of source, target, origin, and link type
    is constrained to be unique to prevent duplicate entries for the same
    relationship.
    """

    __tablename__ = "links"

    # Unique identifier for the link record. Generated automatically using the
    # application's UUID helper.
    id: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)

    # The source note of the relationship. Deleting a note cascades to remove its links.
    source_id: Mapped[str] = mapped_column(ForeignKey("notes.id", ondelete="CASCADE"), index=True)

    # The target note of the relationship. Deleting a note cascades to remove its links.
    target_id: Mapped[str] = mapped_column(ForeignKey("notes.id", ondelete="CASCADE"), index=True)

    # Origin of the relationship, such as "manual" from a user action.
    origin: Mapped[str] = mapped_column(default=DEFAULT_LINK_ORIGIN)

    __table_args__ = (
        # Prevent duplicate link definitions for the same relationship attributes.
        UniqueConstraint("source_id", "target_id", "origin", "link_type_id", name="uq_note_link"),
    )

    # N:1 relationship with LinkType
    link_type_id: Mapped[str] = mapped_column(ForeignKey("link_types.id"))

    # Link category for this connection, e.g. "relates to".
    link_type: Mapped["LinkType"] = relationship(back_populates="links")

    # Relationship from the source note to outgoing links.
    source: Mapped["Note"] = relationship(
        back_populates="outgoing_links", foreign_keys=[source_id]
    )

    # Relationship from the target note to incoming links.
    target: Mapped["Note"] = relationship(
        back_populates="incoming_links", foreign_keys=[target_id]
    )


class LinkType(Base):
    """Defines a reusable category for note relationships.

    Examples include "relates to", "references", or "depends on". Each link type
    is globally unique by name and can be shared by many Link records.
    """

    __tablename__ = "link_types"

    # Unique identifier for the link type.
    id: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)

    # Human-readable name of the relationship type. Must be unique across all types.
    name: Mapped[str] = mapped_column(unique=True)

    # All links that use this type.
    links: Mapped[list["Link"]] = relationship(back_populates="link_type")