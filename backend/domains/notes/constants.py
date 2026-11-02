"""Default values for note records.

This module centralizes the fallback values used when creating notes without
explicitly setting their title, type, or status. Keeping them in one place
ensures consistency across the application and avoids repeated string literals.
"""

# Default title for a newly created note when the caller does not provide one.
# This keeps note entries readable even before a user has named them.
DEFAULT_NOTE_TITLE: str = "Untitled"

# Default note type name used when a note has no assigned category.
# The value is intentionally lowercase-like "None" to match the app's existing
# default type naming conventions.
DEFAULT_NOTE_TYPE_NAME: str = "None"

# Default workflow status for unspecific or uninitialized notes.
# This is used as a neutral fallback value before the note is classified.
DEFAULT_NOTE_STATUS: str = "none"