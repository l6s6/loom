"""Factory helpers for quickly creating test data in the backend test suite.

These functions centralize the creation of note, note-type, tag, and link
records so tests remain readable and consistent. They also avoid duplicate
records by checking for existing entries before creating new ones.
"""

import itertools
from typing import Sequence
from sqlalchemy.orm import Session

from domains.notes.models import Note, NoteType, Tag
from domains.links.models import Link, LinkType

# Global counter for deterministic, collision-free defaults
_counter = itertools.count(1)


def make_note_type(db: Session, name: str | None = None) -> NoteType:
    """Create a note type or return an existing one with the same name.

    Args:
        db: Database session to use for lookup and creation.
        name: Optional explicit name. If omitted, a generated name is used.

    Returns:
        NoteType: The existing or newly created note type instance.
    """
    idx = next(_counter)
    type_name = name or f"Type_{idx}"

    existing = db.query(NoteType).filter(NoteType.name == type_name).first()
    if existing:
        return existing

    note_type = NoteType(name=type_name)
    db.add(note_type)
    db.commit()
    db.refresh(note_type)
    return note_type


def make_tag(db: Session, name: str | None = None) -> Tag:
    """Create a tag or return an existing one with the same name.

    Args:
        db: Database session to use for lookup and creation.
        name: Optional explicit name. If omitted, a generated name is used.

    Returns:
        Tag: The existing or newly created tag instance.
    """
    idx = next(_counter)
    tag_name = name or f"tag_{idx}"

    existing = db.query(Tag).filter(Tag.name == tag_name).first()
    if existing:
        return existing

    tag = Tag(name=tag_name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def make_link_type(db: Session, name: str | None = None) -> LinkType:
    """Create a link type or return an existing one with the same name.

    Args:
        db: Database session to use for lookup and creation.
        name: Optional explicit name. If omitted, a generated name is used.

    Returns:
        LinkType: The existing or newly created link type instance.
    """
    idx = next(_counter)
    type_name = name or f"LinkType_{idx}"

    existing = db.query(LinkType).filter(LinkType.name == type_name).first()
    if existing:
        return existing

    link_type = LinkType(name=type_name)
    db.add(link_type)
    db.commit()
    db.refresh(link_type)
    return link_type


def make_note(
    db: Session,
    *,
    title: str | None = None,
    content: str = "",
    status: str = "none",
    is_archived: bool = False,
    is_pinned: bool = False,
    is_private: bool = False,
    note_type: NoteType | None = None,
    tags: Sequence[Tag] | None = None,
    **kwargs,
) -> Note:
    """Create a note with sensible defaults for use in tests.

    Args:
        db: Database session used for persistence.
        title: Optional custom title. If omitted, a generated title is used.
        content: Body text for the note.
        status: Note status value.
        is_archived: Whether the note is archived.
        is_pinned: Whether the note is pinned.
        is_private: Whether the note is private.
        note_type: Optional custom NoteType instance.
        tags: Optional sequence of Tag objects to attach.
        **kwargs: Extra fields passed through to the Note constructor.

    Returns:
        Note: The created note instance.
    """
    idx = next(_counter)

    resolved_type = note_type or make_note_type(db, name="None")

    note = Note(
        title=title if title is not None else f"Note {idx}",
        content=content,
        status=status,
        is_archived=is_archived,
        is_pinned=is_pinned,
        is_private=is_private,
        note_type=resolved_type,
        tags=list(tags) if tags is not None else [],
        **kwargs,
    )

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def make_link(
    db: Session,
    *,
    source: Note | None = None,
    target: Note | None = None,
    link_type: LinkType | None = None,
    origin: str = "manual",
    **kwargs,
) -> Link:
    """Create a link between two notes with default values if not provided.

    Args:
        db: Database session used for persistence.
        source: Optional source Note instance. A new note is created if omitted.
        target: Optional target Note instance. A new note is created if omitted.
        link_type: Optional LinkType instance. A default type is created if omitted.
        origin: String describing how the link originated.
        **kwargs: Extra fields passed through to the Link constructor.

    Returns:
        Link: The created link instance.
    """
    source_note = source or make_note(db)
    target_note = target or make_note(db)
    resolved_link_type = link_type or make_link_type(db, name="relates to")

    link = Link(
        source_id=source_note.id,
        target_id=target_note.id,
        link_type_id=resolved_link_type.id,
        origin=origin,
        **kwargs,
    )

    db.add(link)
    db.commit()
    db.refresh(link)
    return link