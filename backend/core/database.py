"""Database configuration and session management for the application.

This module initializes the SQLAlchemy engine, configures naming conventions for
generated constraints, and provides a reusable database session dependency for
FastAPI endpoints and service code.
"""

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from core.config import settings

# Declaring Naming Conventions
# ix = Index, uq = Unique, ck = Check, fk = ForeignKey, pk = PrimaryKey
convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}
"""SQLAlchemy naming convention mapping for generated database objects.

These patterns make constraint and index names consistent and predictable
across models and migrations.
"""

metadata = MetaData(naming_convention=convention)
"""Shared SQLAlchemy metadata registry for all declarative models."""

engine_kwargs = {}
"""Additional keyword arguments passed when creating the database engine."""

if settings.database_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    """SQLite-specific connection option required for thread safety in some app contexts."""

engine = create_engine(settings.database_url, **engine_kwargs)
"""SQLAlchemy database engine bound to the configured application database URL."""

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
"""Thread-local database session factory for per-request database access."""

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models.

    All application models should inherit from this class so they share the
    same metadata registry and naming conventions.
    """

    metadata = metadata
    """Metadata container shared across all mapped tables."""


def get_db():
    """Provide a database session for the current request lifecycle.

    Yields:
        Session: A SQLAlchemy session bound to the configured engine.

    Notes:
        The session is closed automatically after the request or operation
        completes, ensuring resources are released properly.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()