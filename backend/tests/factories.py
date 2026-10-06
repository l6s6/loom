from domains.links.models import LinkType, Link
from domains.notes.models import Note, NoteType, Tag


def _get_or_create_tag(db, tag_name):
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if tag is None:
        tag = Tag(name=tag_name)
        db.add(tag)
        db.commit()
        db.refresh(tag)
    return tag

def _get_or_create_note_type(db, name):
    note_type = db.query(NoteType).filter(NoteType.name == name).first()
    if note_type is None:
        note_type = NoteType(name=name)
        db.add(note_type)
        db.commit()
        db.refresh(note_type)
    return note_type

def _get_or_create_link_type(db, name):
    link_type = db.query(LinkType).filter(LinkType.name == name).first()
    if link_type is None:
        link_type = LinkType(name=name)
        db.add(link_type)
        db.commit()
        db.refresh(link_type)
    return link_type


def make_note(db, **overrides):
    note_type = _get_or_create_note_type(db, "NoteType")
    defaults = {"title": "This is the Title",
                "content": "Hello World",
                "status": "ongoing",
                "is_archived": False,
                "is_pinned": True,
                "is_private": False,
                "note_type_id": note_type.id,
                "tags": [_get_or_create_tag(db, "NoteTag")]
                }
    note = Note(**{**defaults, **overrides})
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

def make_link(db, **overrides):
    note1 = make_note(db, title="Note1")
    note2 = make_note(db, title="Note2")
    link_type = _get_or_create_link_type(db, "LinkType")
    defaults = {"source_id": note1.id,
                "target_id": note2.id,
                "origin": "manual",
                "link_type_id": link_type.id,
                }
    link = Link(**{**defaults, **overrides})
    db.add(link)
    db.commit()
    db.refresh(link)
    return link
