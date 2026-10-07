from tests.factories import make_note
from domains.notes.models import Note, NoteType
from tests.helpers import assert_note_response


def test_get_notes_returns_notes(client, db_session):
    note1 = make_note(db_session, title="Title1")
    note2 = make_note(db_session, title="Title2")

    response = client.get("/notes")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 2

    notes_by_id = {item["id"]: item for item in body}
    assert_note_response(notes_by_id[note1.id], note1)
    assert_note_response(notes_by_id[note2.id], note2)


def test_get_note_returns_note(client, db_session):
    note = make_note(db_session, title="Title1")
    make_note(db_session, title="Title2")

    response = client.get(f"/notes/{note.id}")
    body = response.json()

    assert response.status_code == 200
    assert_note_response(body, note)


def test_create_note(client, db_session):
    response = client.post("/notes")
    body = response.json()

    assert response.status_code == 201
    assert body["title"] == "Untitled"
    assert body["content"] == ""
    assert body["status"] == "none"
    assert body["is_archived"] is False
    assert body["is_pinned"] is False
    assert body["is_private"] is False
    assert body["tags"] == []

    note = db_session.get(Note, body["id"])
    assert note is not None
    note_type = db_session.get(NoteType, note.note_type_id)
    assert note_type is not None
    assert note_type.name == "None"

def test_update_title_only(client, db_session):
    note = make_note(db_session)
    new_title = "New Title"

    response = client.put(f"/notes/{note.id}", json={"title": new_title})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(note)
    assert note.title == new_title
    assert_note_response(body, note)
