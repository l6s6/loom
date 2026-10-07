from domains.links.models import Link, LinkType
from domains.notes.models import Note, NoteType, Tag


def assert_type_or_tag_response(actual: dict, expected: NoteType | LinkType | Tag):
    assert actual["id"] == expected.id
    assert actual["name"] == expected.name


def assert_link_response(actual: dict, expected: Link):
    assert actual["id"] == expected.id
    assert actual["origin"] == expected.origin
    assert actual["source"]["id"] == expected.source_id
    assert actual["target"]["id"] == expected.target_id
    assert actual["link_type"]["id"] == expected.link_type.id
    assert actual["link_type"]["name"] == expected.link_type.name


def assert_note_response(actual: dict, expected: Note):
    assert actual["id"] == expected.id
    assert actual["title"] == expected.title
    assert actual["content"] == expected.content
    assert actual["status"] == expected.status
    assert actual["is_archived"] == expected.is_archived
    assert actual["is_pinned"] == expected.is_pinned
    assert actual["is_private"] == expected.is_private

    assert actual["note_type"]["id"] == expected.note_type_id
    if expected.note_type:
        assert actual["note_type"]["name"] == expected.note_type.name

    actual_tag_ids = {t["id"] for t in actual.get("tags", [])}
    expected_tag_ids = {t.id for t in expected.tags}
    assert actual_tag_ids == expected_tag_ids