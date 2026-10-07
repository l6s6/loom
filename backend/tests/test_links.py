from domains.links.constants import DEFAULT_LINK_TYPE_NAME
from domains.links.models import LinkType, Link
from domains.notes.models import Note
from tests.helpers import assert_link_response
import pytest
from tests.factories import make_note, make_link


# --- GET /links ---
def test_get_links_returns_links(client, db_session):
    link1 = make_link(db_session)
    link2 = make_link(db_session)
    response = client.get("/links")
    body = response.json()
    print(body)

    assert response.status_code == 200
    assert len(body) == 2
    assert_link_response(actual=body[0], expected=link1)
    assert_link_response(actual=body[1], expected=link2)


@pytest.mark.parametrize(
    "param_builder, expected_link_keys",
    [
        # --- No Filters ---
        (lambda n: "", ["l1", "l2", "l3"]),

        # --- note_id (Undirected: Source OR Target) ---
        (lambda n: f"?note_id={n['n1'].id}", ["l1", "l3"]),
        (lambda n: f"?note_id={n['n2'].id}", ["l1", "l2"]),
        (lambda n: f"?note_id={n['n3'].id}", ["l2", "l3"]),
        (lambda n: f"?note_id={n['n4'].id}", []),

        # --- source_id (Directed: only outgoing) ---
        (lambda n: f"?source_id={n['n1'].id}", ["l1", "l3"]),
        (lambda n: f"?source_id={n['n2'].id}", ["l2"]),
        (lambda n: f"?source_id={n['n3'].id}", []),

        # --- target_id (Directed: only incoming) ---
        (lambda n: f"?target_id={n['n3'].id}", ["l2", "l3"]),
        (lambda n: f"?target_id={n['n2'].id}", ["l1"]),
        (lambda n: f"?target_id={n['n1'].id}", []),

        # --- origin ---
        (lambda n: "?origin=manual", ["l1"]),
        (lambda n: "?origin=auto", ["l2", "l3"]),
        (lambda n: "?origin=unknown", []),

        # --- link_type ---
        (lambda n: "?type=relates to", ["l1", "l3"]),
        (lambda n: "?type=references", ["l2"]),
        (lambda n: "?type=non_existent", []),

        # --- Combined Filters ---
        (lambda n: f"?note_id={n['n1'].id}&origin=manual", ["l1"]),
        (lambda n: f"?source_id={n['n1'].id}&type=relates to", ["l1", "l3"]),
        (lambda n: f"?target_id={n['n3'].id}&type=references", ["l2"]),
        (lambda n: f"?source_id={n['n1'].id}&origin=non_matching", []),
    ],
    ids=[
        "all_links",
        "note_id_n1_both_roles",
        "note_id_n2_mixed_roles",
        "note_id_n3_incoming_only",
        "note_id_n4_isolated",
        "source_id_n1",
        "source_id_n2",
        "source_id_n3_none",
        "target_id_n3",
        "target_id_n2",
        "target_id_n1_none",
        "origin_manual",
        "origin_auto",
        "origin_empty",
        "type_relates",
        "type_references",
        "type_empty",
        "combo_note_and_origin",
        "combo_source_and_type",
        "combo_target_and_type",
        "combo_empty_intersection",
    ],
)
def test_get_links_filter_matrix(client, seeded_links, param_builder, expected_link_keys):
    notes = seeded_links["notes"]
    links = seeded_links["links"]

    query_str = param_builder(notes)
    response = client.get(f"/links{query_str}")
    assert response.status_code == 200

    body = response.json()
    actual_ids = {item["id"] for item in body}
    expected_ids = {links[key].id for key in expected_link_keys}

    assert actual_ids == expected_ids, (
        f"Filter '{query_str}' failed: "
        f"expected={expected_link_keys} ({expected_ids}), actual={actual_ids}"
    )




# --- POST /links ---
def test_create_link(client, db_session):
    note1 = make_note(db_session)
    note2 = make_note(db_session)
    link_type_name="LinkType"
    payload = {"source_id":note1.id,
               "target_id":note2.id,
               "origin":"manual",
               "link_type_name":link_type_name
               }
    response = client.post("/links",json=payload)
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




# --- POST /links ---
def test_create_link_invalid_note(client, db_session):
    note1 = make_note(db_session)
    link_type_name="LinkType"
    payload = {"source_id":note1.id,
               "target_id":123,
               "origin":"manual",
               "link_type_name":link_type_name
               }
    response = client.post("/links",json=payload)

    assert response.status_code == 404




# --- PUT /links/{id} ---
def test_update_link_no_changes(client, db_session):
    link = make_link(db_session)

    response = client.put(f"/links/{link.id}", json={})
    body = response.json()

    assert response.status_code == 200
    assert_link_response(body, link)


def test_update_link_create_new_link_type(client, db_session):
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
    link = make_link(db_session)
    response = client.put(f"/links/{link.id}", json={"link_type_name": ""})
    body = response.json()

    assert response.status_code == 200

    db_session.refresh(link)
    assert db_session.get(LinkType, link.link_type_id) is not None
    assert link.link_type.name == DEFAULT_LINK_TYPE_NAME
    assert_link_response(body, link)




# --- DELETE /links/{id} ---
def test_delete_link(client, db_session):
    link = make_link(db=db_session)

    response = client.delete(f"/links/{link.id}")

    assert response.status_code == 204
    assert db_session.get(Link, link.id) is None


def test_delete_link_by_deleting_note(client, db_session):
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
    response = client.delete(f"/links/1")
    assert response.status_code == 404