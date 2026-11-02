"""Application runtime configuration for the backend.

This module defines the project-wide settings used across the application.
Values are loaded from environment variables and an optional `.env` file,
and are validated as typed fields for reliable configuration access.
"""

from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed configuration container for the backend service.

    The settings are populated automatically from environment variables and/or
    the `.env` file. Each field is strongly typed to reduce configuration errors
    and to make runtime assumptions explicit.
    """

    database_url: str
    """Primary database connection string for the application."""

    test_database_url: Optional[str] = None
    """Optional database connection string used specifically for tests."""

    render_deploy_hook: Optional[str] = None
    """Optional deploy webhook URL for external deployment automation."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    """Pydantic settings configuration.

    - Loads configuration values from a `.env` file.
    - Ignores unrecognized environment variables instead of raising errors.
    """

settings = Settings()
"""Singleton application settings instance.

This object is created at import time and exposes the configured values to the
rest of the application.
"""