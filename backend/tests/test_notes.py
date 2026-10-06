from tests.factories import make_note
from domains.notes.models import Note, NoteType


def test_get_notes_returns_notes(client, db_session):
    note1 = make_note(db_session, title="Title1")
    note2 = make_note(db_session, title="Title2")
    response = client.get("/notes")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 2
    assert body[0]["title"] == note1.title
    assert body[1]["title"] == note2.title
    assert body[0]["tags"] == body[1]["tags"]
    assert body[0]["note_type"] == body[1]["note_type"]


def test_get_note_returns_note(client, db_session):
    note = make_note(db_session, title="Title1")
    make_note(db_session, title="Title2")
    response = client.get(f"/notes/{note.id}")
    body = response.json()
    print(body)

    assert response.status_code == 200
    assert body["title"] == note.title
    assert body["content"] == note.content
    assert body["status"] == note.status
    assert body["is_archived"] == note.is_archived
    assert body["is_pinned"] == note.is_pinned
    assert body["is_private"] == note.is_private
    assert body["tags"][0]["id"] == note.tags[0].id
    assert body["note_type"]["id"] == note.note_type.id


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
    note_type = db_session.get(NoteType, body["id"])
    assert note is not None
    assert note_type is not None
    assert note.note_type_id == note_type.id
    assert note_type.name == "None"

def test_update_title_only(client, db_session):
    note = make_note(db_session)
    new_title = "New Title"
    response = client.put(f"/notes/{note.id}", json={"title": new_title})
    body = response.json()

    assert response.status_code == 200
    assert body["title"] == new_title
    assert body["content"] == note.content
    assert body["status"] == note.status
    assert body["is_archived"] == note.is_archived
    assert body["is_pinned"] == note.is_pinned
    assert body["is_private"] == note.is_private
    assert body["tags"][0]["id"] == note.tags[0].id
    assert body["note_type"]["id"] == note.note_type_id
