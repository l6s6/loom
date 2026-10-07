from tests.factories import make_note, make_link
from domains.links.models import LinkType, Link
from tests.helpers import assert_link_response


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


def test_get_link_by_note_id_returns_link(client, db_session):
    link = make_link(db_session)
    make_link(db_session)
    response = client.get(f"/links?note_id={link.source_id}")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 1
    assert_link_response(actual=body[0], expected=link)


def test_create_link(client, db_session):
    note1 = make_note(db_session, title="Title1")
    note2 = make_note(db_session, title="Title2")
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
