"""Pytest fixtures and test database setup for the backend test suite.

This module configures a temporary SQLite/Postgres-like test database and
provides reusable fixtures for API integration tests. It ensures all domain
models are imported so SQLAlchemy metadata is aware of the schema, creates
database tables before each test, and tears them down afterward.
"""

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tests.factories import make_note, make_note_type, make_tag, make_link_type, make_link

from fastapi.testclient import TestClient

from core.main import app
from core.database import Base, get_db
from core.config import settings

# Important: All models must be imported so that Base.metadata can recognize them
from domains import *

# Test database connection string. Loaded from environment or application settings.
TEST_DB_URL = settings.test_database_url or os.getenv("TEST_DATABASE_URL")
if not TEST_DB_URL:
    raise ValueError("Failed to load TEST_DATABASE_URL!")

engine = create_engine(TEST_DB_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh test database for each test function.

    Yields:
        Session: A SQLAlchemy session bound to the test database.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Provide a FastAPI test client wired to the test database session.

    Args:
        db_session: The per-test database session fixture.

    Yields:
        TestClient: A client configured to use the shared test DB.
    """
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def seeded_notes(db_session):
    """Create a reusable set of notes, tags, and a sample link for API tests.

    Returns:
        dict: A dictionary containing the seeded note objects keyed by label.
    """
    type_idea = make_note_type(db_session, name="Idea")
    type_task = make_note_type(db_session, name="Task")
    db_session.add_all([type_idea, type_task])

    tag_work = make_tag(db_session, name="work")
    tag_home = make_tag(db_session, name="home")
    tag_urgent = make_tag(db_session, name="urgent")
    db_session.add_all([tag_work, tag_home, tag_urgent])
    db_session.flush()

    note_a = Note(
        title="Meeting Notes",
        content="Discuss backend architecture",
        note_type=type_idea,
        tags=[tag_work],
        status="open",
        is_pinned=True,
        is_archived=False,
        is_private=False,
    )
    note_b = Note(
        title="Buy eggs",
        content="Groceries for home",
        note_type=type_task,
        tags=[tag_home],
        status="closed",
        is_pinned=False,
        is_archived=True,
        is_private=False,
    )
    note_c = Note(
        title="Random Thought",
        content="Nothing important",
        note_type=type_idea,
        tags=[],
        status="none",
        is_pinned=False,
        is_archived=False,
        is_private=True,
    )
    note_d = Note(
        title="Urgent Flow Task",
        content="Critical project delivery",
        note_type=type_task,
        tags=[tag_work, tag_urgent],
        status="open",
        is_pinned=True,
        is_archived=False,
        is_private=True,
    )
    db_session.add_all([note_a, note_b, note_c, note_d])
    db_session.flush()

    link_type = LinkType(name="Relates To")
    db_session.add(link_type)
    db_session.flush()

    link_ab = Link(
        source_id=note_a.id,
        target_id=note_b.id,
        link_type_id=link_type.id,
    )
    db_session.add(link_ab)
    db_session.commit()

    return {
        "a": note_a,
        "b": note_b,
        "c": note_c,
        "d": note_d,
    }


@pytest.fixture
def seeded_links(db_session):
    """Create a small graph of linked notes for testing graph and link APIs.

    The fixture creates:
      - l1: n1 -> n2 | type='relates to' | origin='manual'
      - l2: n2 -> n3 | type='references' | origin='ai'
      - l3: n1 -> n3 | type='relates to' | origin='ai'

    Returns:
        dict: A dictionary containing notes and their generated links.
    """
    n1 = make_note(db_session, title="Node 1")
    n2 = make_note(db_session, title="Node 2")
    n3 = make_note(db_session, title="Node 3")
    n4 = make_note(db_session, title="Node 4 (Isolated)")

    type_relates = make_link_type(db_session, name="relates to")
    type_refs = make_link_type(db_session, name="references")

    links = {
        "l1": make_link(db_session, source=n1, target=n2, link_type=type_relates, origin="manual"),
        "l2": make_link(db_session, source=n2, target=n3, link_type=type_refs, origin="ai"),
        "l3": make_link(db_session, source=n1, target=n3, link_type=type_relates, origin="ai"),
    }

    return {"notes": {"n1": n1, "n2": n2, "n3": n3, "n4": n4}, "links": links}