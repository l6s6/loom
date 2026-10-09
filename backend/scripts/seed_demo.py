import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from domains.notes.models import Note, NoteType
from domains.links.models import Link, LinkType
from textwrap import dedent


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
        md_loom_arch = dedent("""\
                    Loom is a full-stack personal knowledge base system. 

                    ## Tech Stack
                    - **Backend:** FastAPI (Python)
                    - **Database:** PostgreSQL (via SQLAlchemy)
                    - **Frontend:** React + Tailwind CSS

                    > The focus is on blazing-fast load times and seamless Markdown editing.
                """)

        md_postgres_search = dedent("""\
                    Instead of using Elasticsearch, we leverage the native vector indexing features of Postgres for lightning-fast search results.

                    ## Implementation Example

                    This is achieved using `tsvector` and `tsquery`:

                    ```sql
                    ALTER TABLE notes ADD COLUMN textsearchable_index_col tsvector;
                    UPDATE notes SET textsearchable_index_col = to_tsvector('english', title || ' ' || content);
                    ```

                    This enables true sub-millisecond queries.
                """)

        md_graph_links = dedent("""\
                    Nodes represent *atomic thoughts*; edges define the semantic relationships between them.

                    ### Why is this important?
                    1. Discoverability of past knowledge
                    2. Organic growth without rigid folder structures
                    3. Building a true **Zettelkasten**

                    See the architecture note for technical implementation details.
                """)

        note_1 = Note(
            title="Loom Architecture Overview",
            content=md_loom_arch,
            note_type_id=type_concept.id,
            status="ongoing"
        )
        note_2 = Note(
            title="PostgreSQL Full-Text Search",
            content=md_postgres_search,
            note_type_id=type_resource.id,
            status="open"
        )
        note_3 = Note(
            title="Bi-directional Graph Linking",
            content=md_graph_links,
            note_type_id=type_concept.id,
            status="closed"
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