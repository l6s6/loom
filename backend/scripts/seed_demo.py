import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from domains.notes.models import Note, NoteType
from domains.links.models import Link, LinkType


def seed_demo_data():
    db = SessionLocal()
    try:
        # Empty data
        db.query(Link).delete()
        db.query(Note).delete()
        db.query(LinkType).delete()
        db.query(NoteType).delete()
        db.commit()

        # Create Basic Types
        type_concept = NoteType(name="Concept")
        type_resource = NoteType(name="Resource")
        db.add_all([type_concept, type_resource])
        db.flush()

        link_relates = LinkType(name="relates_to")
        db.add(link_relates)
        db.flush()

        # Create Example Notes
        note_1 = Note(
            title="Loom Architecture Overview",
            content="Fullstack personal knowledge base built with FastAPI, PostgreSQL, and React.",
            note_type_id=type_concept.id,
        )
        note_2 = Note(
            title="PostgreSQL Full-Text Search",
            content="Using native Postgres vector indexing for sub-millisecond retrieval.",
            note_type_id=type_resource.id,
        )
        note_3 = Note(
            title="Bi-directional Graph Linking",
            content="Nodes represent atomic thoughts; edges define semantic relationships.",
            note_type_id=type_concept.id,
        )
        db.add_all([note_1, note_2, note_3])
        db.flush()

        # Create Example Links
        link_1 = Link(
            source_id=note_1.id,
            target_id=note_2.id,
            link_type_id=link_relates.id,
        )
        link_2 = Link(
            source_id=note_1.id,
            target_id=note_3.id,
            link_type_id=link_relates.id,
        )
        db.add_all([link_1, link_2])

        db.commit()
        print("Demo-DB created successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding Demo-Data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()