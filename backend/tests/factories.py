from domains.notes.models import Note, NoteType, Tag

def _get_or_create_tag(db, tag_name):
    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if tag is None:
        tag = Tag(name=tag_name)
        db.add(tag)
        db.commit()
        db.refresh(tag)
    return tag

def _get_or_create_note_type(db, note_type_name):
    note_type = db.query(NoteType).filter(NoteType.name == note_type_name).first()
    if note_type is None:
        note_type = NoteType(name=note_type_name)
        db.add(note_type)
        db.commit()
        db.refresh(note_type)
    return note_type


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
