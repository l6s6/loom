"""Utility functions for shared backend helpers."""

import uuid


def generate_uuid():
    """Generate a new universally unique identifier (UUID) string.

    Returns:
        str: A random UUID4 value rendered as a standard string.
    """
    return str(uuid.uuid4())