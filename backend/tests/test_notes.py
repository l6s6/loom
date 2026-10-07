from time import sleep

import pytest

from domains.notes.constants import DEFAULT_NOTE_TYPE_NAME
from tests.factories import make_note, make_note_type, make_tag
from domains.notes.models import Note, NoteType, Tag
from tests.helpers import assert_note_response, assert_type_or_tag_response

# --- GET /notes ---
def test_get_notes_empty(client, db_session):
    response = client.get("/notes")
    body = response.json()

    assert response.status_code == 200
    assert len(body) ==0


def test_get_notes_returns_notes(client, db_session):
    note1 = make_note(db_session)
    note2 = make_note(db_session)

    response = client.get("/notes")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 2

    notes_by_id = {item["id"]: item for item in body}
    assert_note_response(notes_by_id[note1.id], note1)
    assert_note_response(notes_by_id[note2.id], note2)


@pytest.mark.parametrize(
    "query_params, expected_keys",
    [
        # --- No filter ---
        ("", ["a", "b", "c", "d"]),

        # --- Type Filter ---
        ("?type=Idea", ["a", "c"]),
        ("?type=Task", ["b", "d"]),
        ("?type=NonExistent", []),

        # --- Tag Filter ---
        ("?tag=work", ["a", "d"]),
        ("?tag=home", ["b"]),
        ("?tag=urgent", ["d"]),
        ("?tag=unused_tag", []),

        # --- Status Filter ---
        ("?status=open", ["a", "d"]),
        ("?status=closed", ["b"]),
        ("?status=none", ["c"]),

        # --- Boolean Filters ---
        ("?is_pinned=true", ["a", "d"]),
        ("?is_pinned=false", ["b", "c"]),
        ("?is_archived=true", ["b"]),
        ("?is_archived=false", ["a", "c", "d"]),
        ("?is_private=true", ["c", "d"]),
        ("?is_private=false", ["a", "b"]),

        # --- Search Filter ---
        ("?search=Meeting", ["a"]),
        ("?search=eggs", ["b"]),
        ("?search=backend", ["a"]),
        ("?search=meeting", ["a"]),
        ("?search=Flow", ["d"]),
        ("?search=NotExistingWord123", []),

        # --- Combined Filters ---
        ("?type=Idea&status=open", ["a"]),
        ("?tag=work&is_pinned=true", ["a", "d"]),
        ("?tag=work&is_private=true", ["d"]),
        ("?type=Task&status=open&tag=urgent", ["d"]),
        ("?type=Idea&status=closed", []),
    ],
    ids=[
        "no_filter",
        "type_idea",
        "type_task",
        "type_not_found",
        "tag_work",
        "tag_home",
        "tag_urgent",
        "tag_not_found",
        "status_open",
        "status_closed",
        "status_none",
        "pinned_true",
        "pinned_false",
        "archived_true",
        "archived_false",
        "private_true",
        "private_false",
        "search_title",
        "search_content",
        "search_content_keyword",
        "search_case_insensitive_lower",
        "search_case_insensitive_upper",
        "search_empty_result",
        "combo_type_and_status",
        "combo_tag_and_pinned",
        "combo_tag_and_private",
        "combo_triple_criteria",
        "combo_contradictory",
    ],
)
def test_get_notes_filter_matrix(client, seeded_notes, query_params, expected_keys):
    response = client.get(f"/notes{query_params}")
    assert response.status_code == 200

    body = response.json()
    actual_ids = {item["id"] for item in body}
    expected_ids = {seeded_notes[k].id for k in expected_keys}

    assert actual_ids == expected_ids, (
        f"Filter '{query_params}' failed: "
        f"expected={expected_keys} ({expected_ids}), actual={actual_ids}"
    )


def test_get_notes_invalid_status_returns_422(client):
    response = client.get("/notes?status=invalid_status_value")
    assert response.status_code == 422




# --- GET /notes/types ---
def test_get_note_types_empty(client, db_session):
    response = client.get("/notes/types")
    body = response.json()

    assert response.status_code == 200
    assert len(body) ==0


def test_get_note_types_returns_note_types(client, db_session):
    note_type1 = make_note_type(db=db_session)
    note_type2 = make_note_type(db=db_session)

    response = client.get("/notes/types")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 2

    types_by_id = {item["id"]: item for item in body}
    assert_type_or_tag_response(types_by_id[note_type1.id], note_type1)
    assert_type_or_tag_response(types_by_id[note_type2.id], note_type2)




# --- GET /notes/tags ---
def test_get_tags_empty(client, db_session):
    response = client.get("/notes/tags")
    body = response.json()

    assert response.status_code == 200
    assert len(body) ==0


def test_get_tags_returns_tags(client, db_session):
    tag1 = make_tag(db=db_session)
    tag2 = make_tag(db=db_session)

    response = client.get("/notes/tags")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 2

    tags_by_id = {item["id"]: item for item in body}
    assert_type_or_tag_response(tags_by_id[tag1.id], tag1)
    assert_type_or_tag_response(tags_by_id[tag2.id], tag2)



# --- GET /notes/{id} ---
def test_get_note_returns_note(client, db_session):
    note = make_note(db_session)
    make_note(db_session)

    response = client.get(f"/notes/{note.id}")
    body = response.json()

    assert response.status_code == 200
    assert_note_response(body, note)


def test_get_note_not_existing(client):
    response = client.get(f"/notes/1")

    assert response.status_code == 404




# --- POST /notes ---
def test_create_note(client, db_session):
    response = client.post("/notes")
    body = response.json()

    note = db_session.get(Note, body["id"])
    assert note is not None

    assert_note_response(body, note)

    assert note.title == "Untitled"
    assert note.content == ""
    assert note.status == "none"
    assert note.tags == []
    assert note.note_type.name == "None"




# --- PUT /notes/{id} ---
def test_update_note_title_only(client, db_session):
    note = make_note(db_session)
    new_title = "New Title"
    original = note.modified_at
    sleep(1)

    response = client.put(f"/notes/{note.id}", json={"title": new_title})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(note)
    assert note.title == new_title
    assert_note_response(body, note)
    assert note.modified_at > original


def test_update_note_no_changes(client, db_session):
    note = make_note(db_session)

    response = client.put(f"/notes/{note.id}", json={})
    body = response.json()

    assert response.status_code == 200
    assert_note_response(body, note)


def test_update_note_create_new_note_type(client, db_session):
    note = make_note(db_session)
    new_note_type_name = "NewNoteType"
    response = client.put(f"/notes/{note.id}", json={"note_type_name": new_note_type_name})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(note)
    assert db_session.get(NoteType, note.note_type_id) is not None
    assert note.note_type.name == new_note_type_name
    assert_note_response(body, note)


def test_update_note_empty_note_type(client, db_session):
    note = make_note(db_session)
    response = client.put(f"/notes/{note.id}", json={"note_type_name": ""})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(note)
    assert db_session.get(NoteType, note.note_type_id) is not None
    assert note.note_type.name == DEFAULT_NOTE_TYPE_NAME
    assert_note_response(body, note)


def test_update_note_create_new_tag(client, db_session):
    note = make_note(db_session)
    new_tag_name = "newTag"
    response = client.put(f"/notes/{note.id}", json={"tag_names": [new_tag_name]})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(note)
    assert db_session.get(Tag, note.tags[0].id) is not None
    assert note.tags[0].name == new_tag_name
    assert_note_response(body, note)


def test_update_note_invalid_status(client, db_session):
    note = make_note(db_session)

    response = client.put(f"/notes/{note.id}", json={})
    body = response.json()

    assert response.status_code == 200
    assert_note_response(body, note)



# --- DELETE /notes/{id}
def test_delete_note(client, db_session):
    note = make_note(db_session)

    response = client.delete(f"/notes/{note.id}")

    assert response.status_code == 204
    assert db_session.get(Note, note.id) is None


def test_delete_note_not_existing(client):
    response = client.get(f"/notes/1")

    assert response.status_code == 404