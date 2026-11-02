"""Domain model exports for application initialization.

This package-level module re-exports the ORM model classes used throughout the
backend so the SQLAlchemy metadata can be registered consistently during app
startup. Importing these classes here makes the domain models available to the
application without requiring each module to be imported individually.
"""

# Import note domain models so they are registered with the SQLAlchemy metadata.
from domains.notes.models import Note, NoteType, Tag

# Import link domain models so link-related tables and relationships are registered.
from domains.links.models import Link, LinkType