def create_note(client, **overrides):
    payload = {"title": "Test", "content": "Ein Testinhalt", "note_type_name": "idea", "tag_names": []}
    payload.update(overrides)
    return client.post("/notes/", json=payload)



# CREATE NOTE
def test_create_note_success(client):
    response = create_note(client)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test"
    assert data["note_type"]["name"] == "idea"
    assert data["content"] == "Ein Testinhalt"
    assert data["tags"] == []

def test_create_note_with_empty_type_fails(client):
    response = client.post("/notes/", json={
        "title": "Test",
        "content": "Ein Testinhalt",
        "note_type_name": "",
        "tag_names": [],
    })

    assert response.status_code == 400

def test_create_note_reuses_existing_type(client):
    response1 = client.post("/notes/", json={
        "title": "Test1",
        "content": "Ein Testinhalt",
        "note_type_name": "idea",
        "tag_names": [],
    })
    response2 = client.post("/notes/", json={
        "title": "Test2",
        "content": "Ein Testinhalt",
        "note_type_name": "idea",
        "tag_names": [],
    })

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json()["note_type"]["id"] == response2.json()["note_type"]["id"]



# GET NOTE
def test_get_note_success(client):
    create_response = create_note(client)
    note_id = create_response.json()["id"]

    get_response = client.get(f"/notes/{note_id}")
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Test"

def test_get_note_not_found(client):
    get_response = client.get(f"/notes/123")
    assert get_response.status_code == 404



# UPDATE NOTE
def test_update_note_not_found(client):
    update_response = client.put(f"/notes/123", json={
        "title": "New Title",
    })
    assert update_response.status_code == 404


def test_update_note_partial_success(client):
    create_response = create_note(client)
    note_id = create_response.json()["id"]
    client.put(f"/notes/{note_id}", json={
        "title": "New Title",
    })

    get_response = client.get(f"/notes/{note_id}")

    assert get_response.status_code == 200
    assert get_response.json()["title"] == "New Title"

def test_update_note_partial_keeps_type(client):
    note = create_note(client, note_type_name="idea")
    note_id = note.json()['id']
    client.put(f"/notes/{note_id}", json={"title": "New Title"})

    get_response = client.get(f"/notes/{note_id}")
    assert get_response.json()["note_type"]["name"] == "idea"


# DELETE NOTE
def test_delete_note_not_found(client):
    get_response = client.delete(f"/notes/123")
    assert get_response.status_code == 404

def test_delete_note_success(client):
    create_response = create_note(client)
    note_id = create_response.json()["id"]

    delete_response = client.delete(f"/notes/{note_id}")
    get_response = client.get(f"/notes/{note_id}")

    assert delete_response.status_code == 200
    assert get_response.status_code == 404



# FILTER NOTES
def test_filter_notes_by_type(client):
    client.post("/notes/", json={"title": "A", "content": "...", "note_type_name": "idea", "tag_names": []})
    client.post("/notes/", json={"title": "B", "content": "...", "note_type_name": "question", "tag_names": []})

    response = client.get("/notes/?note_type_name=idea")

    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "A"

def test_filter_notes_by_tag(client):
    client.post("/notes/", json={"title": "A", "content": "...", "note_type_name": "idea", "tag_names": ["abc"]})
    client.post("/notes/", json={"title": "B", "content": "...", "note_type_name": "question", "tag_names": ["def"]})

    response = client.get("/notes/?tag=abc")

    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "A"

def test_filter_notes_no_match_returns_empty_list(client):
    create_note(client)

    response = client.get("/notes/?tag=abc")

    assert len(response.json()) == 0
