from tests.factories import make_note, make_link
from domains.links.models import LinkType, Link

def test_get_links_returns_links(client, db_session):
    link1 = make_link(db_session)
    link2 = make_link(db_session)
    response = client.get("/links")
    body = response.json()
    print(body)

    assert response.status_code == 200
    assert len(body) == 2
    assert body[0]["source"]["id"] == link1.source_id
    assert body[0]["target"]["id"] == link1.target_id
    assert body[0]["link_type"]["id"] == link1.link_type.id
    assert body[0]["origin"] == link1.origin
    assert body[1]["source"]["id"] == link2.source_id
    assert body[1]["target"]["id"] == link2.target_id
    assert body[1]["link_type"]["id"] == link2.link_type.id
    assert body[1]["origin"] == link2.origin


def test_get_link_by_note_id_returns_link(client, db_session):
    link = make_link(db_session)
    make_link(db_session)
    response = client.get(f"/links?note_id={link.source_id}")
    body = response.json()

    assert response.status_code == 200
    assert len(body) == 1
    assert body[0]["source"]["id"] == link.source_id
    assert body[0]["target"]["id"] == link.target_id
    assert body[0]["link_type"]["id"] == link.link_type.id
    assert body[0]["origin"] == link.origin



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
    link_type = db_session.get(LinkType, body["id"])
    assert link is not None
    assert link_type is not None
    assert link.link_type == link_type
    assert link_type.name == link_type_name
