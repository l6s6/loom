import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from tests.factories import make_note, make_note_type, make_tag

from fastapi.testclient import TestClient

from core.main import app
from core.database import Base, get_db

# Important: All models must be imported so that Base.metadata can recognize them


SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
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
    type_idea = make_note_type(db_session, name="Idea")
    type_task = make_note_type(db_session, name="Task")

    tag_work = make_tag(db_session, name="work")
    tag_home = make_tag(db_session, name="home")
    tag_urgent = make_tag(db_session, name="urgent")

    notes = {
        "a": make_note(
            db_session,
            title="Sprint Planning Meeting",
            content="Discuss backend architecture and roadmap",
            status="open",
            note_type=type_idea,
            tags=[tag_work],
            is_pinned=True,
            is_archived=False,
            is_private=False,
        ),
        "b": make_note(
            db_session,
            title="Grocery Shopping",
            content="Buy milk, eggs, and bread",
            status="closed",
            note_type=type_task,
            tags=[tag_home],
            is_pinned=False,
            is_archived=True,
            is_private=False,
        ),
        "c": make_note(
            db_session,
            title="Secret Project X",
            content="Brainstorming new algorithms",
            status="none",
            note_type=type_idea,
            tags=[],
            is_pinned=False,
            is_archived=False,
            is_private=True,
        ),
        "d": make_note(
            db_session,
            title="Fix Critical Bug",
            content="Urgent issue with login flow",
            status="open",
            note_type=type_task,
            tags=[tag_work, tag_urgent],
            is_pinned=True,
            is_archived=False,
            is_private=True,
        ),
    }
    return notes