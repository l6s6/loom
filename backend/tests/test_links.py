"""Tests for the link API endpoints and link-related business rules.

This module verifies the behavior of the /links endpoints, including:
- listing and filtering links
- creating links between notes
- updating link types
- deleting links
- cascading deletion when a linked note is removed
"""

from domains.links.constants import DEFAULT_LINK_TYPE_NAME
from domains.links.models import LinkType, Link
from domains.notes.models import Note
from tests.helpers import assert_link_response
from tests.factories import make_note, make_link


# --- GET /links ---
def test_get_links_returns_links(client, db_session):
    """Ensure GET /links returns all persisted links in the database."""
    link1 = make_link(db_session)
    link2 = make_link(db_session)
    response = client.get("/links")
    body = response.json()
    print(body)

    assert response.status_code == 200
    assert len(body) == 2
    assert_link_response(actual=body[0], expected=link1)
    assert_link_response(actual=body[1], expected=link2)


def test_returns_empty_list_when_no_links_exist(client):
    """Return an empty list when the database contains no links."""
    response = client.get("/links")
    assert response.status_code == 200
    assert response.json() == []


# --- POST /links ---
def test_create_link(client, db_session):
    """Ensure POST /links creates a new link with the supplied relationship metadata."""
    note1 = make_note(db_session)
    note2 = make_note(db_session)
    link_type_name = "LinkType"
    payload = {
        "source_id": note1.id,
        "target_id": note2.id,
        "origin": "manual",
        "link_type_name": link_type_name,
    }
    response = client.post("/links", json=payload)
    body = response.json()

    assert response.status_code == 201
    assert body["origin"] == payload["origin"]
    assert body["link_type"]["name"] == payload["link_type_name"]
    assert body["source"]["id"] == note1.id
    assert body["target"]["id"] == note2.id

    link = db_session.get(Link, body["id"])
    assert link is not None
    link_type = db_session.get(LinkType, link.link_type_id)
    assert link_type is not None
    assert link.link_type == link_type
    assert link_type.name == link_type_name


def test_create_link_invalid_note(client, db_session):
    """Ensure POST /links fails when either source or target note does not exist."""
    note1 = make_note(db_session)
    link_type_name = "LinkType"
    payload = {
        "source_id": note1.id,
        "target_id": "abc",
        "origin": "manual",
        "link_type_name": link_type_name,
    }
    response = client.post("/links", json=payload)

    assert response.status_code == 404


def test_creates_default_link_type_when_link_type_name_is_blank(client, db_session):
    """Use the default link type when the payload provides a blank type name."""
    note1 = make_note(db_session)
    note2 = make_note(db_session)
    payload = {
        "source_id": note1.id,
        "target_id": note2.id,
        "origin": "manual",
        "link_type_name": "",
    }

    response = client.post("/links", json=payload)
    body = response.json()

    assert response.status_code == 201
    assert body["link_type"]["name"] == DEFAULT_LINK_TYPE_NAME


# --- PUT /links/{id} ---
def test_update_link_no_changes(client, db_session):
    """Updating with an empty payload should leave the link unchanged."""
    link = make_link(db_session)

    response = client.put(f"/links/{link.id}", json={})
    body = response.json()

    assert response.status_code == 200
    assert_link_response(body, link)


def test_update_link_create_new_link_type(client, db_session):
    """Updating the link type should create a new type when needed."""
    link = make_link(db_session)
    new_link_type_name = "NewLinkType"
    response = client.put(f"/links/{link.id}", json={"link_type_name": new_link_type_name})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(link)
    assert db_session.get(LinkType, link.link_type_id) is not None
    assert link.link_type.name == new_link_type_name
    assert_link_response(body, link)


def test_update_link_empty_link_type(client, db_session):
    """Empty link type names should fall back to the default relationship type."""
    link = make_link(db_session)
    response = client.put(f"/links/{link.id}", json={"link_type_name": ""})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(link)
    assert db_session.get(LinkType, link.link_type_id) is not None
    assert link.link_type.name == DEFAULT_LINK_TYPE_NAME
    assert_link_response(body, link)


def test_returns_404_when_updating_missing_link(client):
    """Reject updates for links that do not exist."""
    response = client.put("/links/999999", json={"link_type_name": "UpdatedType"})
    assert response.status_code == 404


# --- DELETE /links/{id} ---
def test_delete_link(client, db_session):
    """Ensure DELETE /links/{id} removes the target link from the database."""
    link = make_link(db=db_session)

    response = client.delete(f"/links/{link.id}")

    assert response.status_code == 204
    assert db_session.get(Link, link.id) is None


def test_delete_link_by_deleting_note(client, db_session):
    """Deleting a connected note should cascade and remove the related links."""
    link = make_link(db=db_session)
    source_id = link.source_id
    target_id = link.target_id
    link_id = link.id

    response = client.delete(f"/notes/{link.source.id}")

    assert response.status_code == 204
    assert db_session.get(Note, source_id) is None
    assert db_session.get(Link, link_id) is None
    assert db_session.get(Note, target_id) is not None


def test_delete_link_not_existing(client):
    """DELETE /links/{id} should return 404 when the link is missing."""
    response = client.delete("/links/1")
    assert response.status_code == 404