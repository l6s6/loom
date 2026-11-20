"""Utility functions for shared backend helpers."""

import uuid

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def generate_uuid() -> str:
    """Return a new UUID4 as a standard string.

    This helper is used to generate unique identifiers for domain objects
    that rely on string-based primary keys.

    Returns:
        str: A randomly generated UUID version 4 in canonical string format.
    """
    return str(uuid.uuid4())


def commit_or_409(db: Session, detail: str) -> None:
    """Commit the current transaction or raise an HTTP 409 conflict.

    Attempts to commit the active SQLAlchemy session. If a database integrity
    constraint is violated (for example, duplicate unique values or broken
    foreign key relationships), the transaction is rolled back and translated
    into a FastAPI `HTTPException` with status code 409.

    Args:
        db: Active SQLAlchemy session to commit.
        detail: Human-readable conflict message to include in the HTTP error.

    Raises:
        HTTPException: With 409 status code when an `IntegrityError` occurs.
    """
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)

