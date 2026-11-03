"""Tests for graph API payload construction and relationship coverage."""

from domains.graph.schemas import VertexType


# --- GET /graph ---
def test_returns_empty_graph_when_no_entities_exist(client):
    """GET /graph should return empty collections when the database has no graph entities."""
    response = client.get("/graph")
    body = response.json()

    assert response.status_code == 200
    assert body == {"vertices": [], "edges": []}


def test_returns_expected_vertices_and_edges_for_seeded_notes(client, seeded_notes):
    """GET /graph should include note, tag, note-type vertices and all relationship edges."""
    response = client.get("/graph")
    body = response.json()

    assert response.status_code == 200

    vertices = body["vertices"]
    edges = body["edges"]

    assert len(vertices) == 9
    assert len(edges) == 9

    vertices_by_type = {
        vertex_type.value: [vertex for vertex in vertices if vertex["type"] == vertex_type.value]
        for vertex_type in VertexType
    }

    assert len(vertices_by_type[VertexType.note.value]) == 4
    assert len(vertices_by_type[VertexType.tag.value]) == 3
    assert len(vertices_by_type[VertexType.note_type.value]) == 2

    note_ids = {seeded_notes[key].id for key in seeded_notes}
    returned_note_ids = {vertex["id"] for vertex in vertices_by_type[VertexType.note.value]}
    assert returned_note_ids == note_ids

    for vertex in vertices:
        assert isinstance(vertex["id"], str)
        assert isinstance(vertex["name"], str)
        assert vertex["type"] in {item.value for item in VertexType}
        assert vertex["val"] == 1

    edge_tuples = {(edge["source_id"], edge["target_id"], edge["type"]) for edge in edges}
    assert (seeded_notes["a"].id, seeded_notes["b"].id, "Relates To") in edge_tuples
    assert (seeded_notes["a"].id, seeded_notes["a"].note_type_id, "Note Type") in edge_tuples
    assert (seeded_notes["b"].id, seeded_notes["b"].note_type_id, "Note Type") in edge_tuples


def test_returns_link_type_edges_and_excludes_tag_edges_when_no_tags_exist(client, seeded_links):
    """GET /graph should include link-type edges and omit Tag edges when notes have no tags."""
    response = client.get("/graph")
    body = response.json()

    assert response.status_code == 200

    vertices = body["vertices"]
    edges = body["edges"]

    assert len(vertices) == 5
    assert len(edges) == 7

    edge_types = {edge["type"] for edge in edges}
    assert "relates to" in edge_types
    assert "references" in edge_types
    assert "Tag" not in edge_types

    note_type_edges = [edge for edge in edges if edge["type"] == "Note Type"]
    assert len(note_type_edges) == 4

    returned_note_ids = {
        vertex["id"]
        for vertex in vertices
        if vertex["type"] == VertexType.note.value
    }
    expected_note_ids = {note.id for note in seeded_links["notes"].values()}
    assert returned_note_ids == expected_note_ids


def test_keeps_all_edge_endpoints_within_returned_vertex_ids(client, seeded_notes):
    """GET /graph should only emit edges that point to vertices included in the same payload."""
    response = client.get("/graph")
    body = response.json()

    assert response.status_code == 200

    vertex_ids = {vertex["id"] for vertex in body["vertices"]}

    for edge in body["edges"]:
        assert edge["source_id"] in vertex_ids
        assert edge["target_id"] in vertex_ids