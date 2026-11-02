"""Default constants for link records.

This module defines the shared default values used when creating new links
without an explicit type or origin. Centralizing these defaults keeps the
application consistent and reduces the risk of hard-coded strings being
duplicated across different modules.
"""

# Default label used for a link when the caller does not specify a
# relationship type. This value represents a generic semantic association.
DEFAULT_LINK_TYPE_NAME: str = "relates to"

# Default origin value indicating that the link was created manually by
# a user or application workflow rather than generated automatically.
DEFAULT_LINK_ORIGIN: str = "manual"