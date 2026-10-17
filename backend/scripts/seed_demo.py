import sys
import os
from textwrap import dedent

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import SessionLocal
from domains.notes.models import Note, NoteType, note_has_tags, Tag
from domains.links.models import Link, LinkType


def seed_demo_data():
    db = SessionLocal()
    try:
        print("Cleaning up old data...")
        # Empty data
        db.query(note_has_tags).delete()
        db.query(Link).delete()
        db.query(Note).delete()
        db.query(Tag).delete()
        db.query(LinkType).delete()
        db.query(NoteType).delete()
        db.commit()

        print("Creating Note Types, Link Types and Tags...")
        # 1. Create Types
        type_concept = NoteType(name="Concept")
        type_resource = NoteType(name="Resource")
        type_moc = NoteType(name="Map of Content (MoC)")
        type_snippet = NoteType(name="Snippet")
        db.add_all([type_concept, type_resource, type_moc, type_snippet])
        db.flush()

        # 2. Create Link Types
        link_relates = LinkType(name="Relates To")
        link_parent = LinkType(name="Is Parent Of")
        link_implements = LinkType(name="Implements")
        db.add_all([link_relates, link_parent, link_implements])
        db.flush()

        # 3. Create Tags
        tag_db = Tag(name="Database")
        tag_arch = Tag(name="Architecture")
        tag_frontend = Tag(name="Frontend")
        tag_backend = Tag(name="Backend")
        tag_devops = Tag(name="DevOps")
        tag_theory = Tag(name="Theory")
        tag_react = Tag(name="React")
        db.add_all([tag_db, tag_arch, tag_frontend, tag_backend, tag_devops, tag_theory, tag_react])
        db.flush()

        print("Generating Notes...")
        # 4. Create Example Notes
        # --- HUB: Architecture ---
        n_arch = Note(
            title="Loom Architecture MoC",
            content=dedent("""\
                # Loom Architecture
                Loom is a full-stack personal knowledge base system. 
                This note acts as the central Map of Content (MoC) for the entire project.

                ## Core Pillars
                - Backend: FastAPI & Python
                - Frontend: React & TypeScript
                - Infrastructure: Docker

                Focus on blazing-fast load times and seamless Markdown editing.
            """),
            note_type=type_moc,
            tags=[tag_arch],
            status="ongoing"
        )

        # --- BACKEND CLUSTER ---
        n_pg_search = Note(
            title="PostgreSQL Full-Text Search",
            content=dedent("""\
                Instead of using Elasticsearch, we leverage the native vector indexing features of Postgres.

                ```sql
                ALTER TABLE notes ADD COLUMN search_index tsvector;
                UPDATE notes SET search_index = to_tsvector('english', title || ' ' || content);
                ```
                This enables sub-millisecond queries natively in SQLAlchemy.
            """),
            note_type=type_resource,
            tags=[tag_backend, tag_db],
            status="closed"
        )

        n_fastapi_auth = Note(
            title="FastAPI JWT Authentication",
            content=dedent("""\
                We use OAuth2 with Password Flow and JWT tokens.
                The `Depends(get_current_user)` dependency is injected into all protected routes.
                Remember to set the `SECRET_KEY` in the `.env` file before deploying!
            """),
            note_type=type_snippet,
            tags=[tag_backend],
            status="open"
        )

        # --- FRONTEND CLUSTER ---
        n_frontend_moc = Note(
            title="Frontend Stack MoC",
            content=dedent("""\
                The frontend is a Single Page Application (SPA) built for extreme reactivity.
                - Routing: React Router v6
                - Styling: Tailwind CSS
                - State: Zustand + React Query
                - Visuals: Force Graph 3D
            """),
            note_type=type_moc,
            tags=[tag_frontend, tag_react],
            status="ongoing"
        )

        n_graph_3d = Note(
            title="Force Graph 3D Implementation",
            content=dedent("""\
                We render the Zettelkasten network in 3D using `react-force-graph-3d`.

                ### Critical Fixes
                - Use `ResizeObserver` to prevent CSS layout conflicts.
                - Delay `zoomToFit()` in the `onEngineStop` event to avoid race conditions.
            """),
            note_type=type_resource,
            tags=[tag_frontend, tag_react],
            status="closed"
        )

        n_d3_physics = Note(
            title="D3.js Physics Engine",
            content=dedent("""\
                The underlying engine of the Force Graph. 
                Nodes repel each other (Charge), while links pull them together (Spring).
                Adjust `d3VelocityDecay` to make the graph stop jiggling faster.
            """),
            note_type=type_concept,
            tags=[tag_frontend, tag_theory],
            status="closed"
        )

        # --- THEORY CLUSTER ---
        n_zettelkasten = Note(
            title="Zettelkasten Method",
            content=dedent("""\
                A methodology for knowledge management developed by Niklas Luhmann.
                Nodes represent *atomic thoughts*; edges define the semantic relationships.

                Rule 1: One idea per note.
                Rule 2: Always link new notes to existing ones.
            """),
            note_type=type_concept,
            tags=[tag_theory],
            status="closed"
        )

        n_degree_centrality = Note(
            title="Degree Centrality in Graphs",
            content=dedent("""\
                In graph theory, degree centrality is defined as the number of links incident upon a node.
                We use this metric in Loom to determine the visual radius (`val`) of a note in the 3D view.
                Highly connected notes act as visual gravity wells.
            """),
            note_type=type_concept,
            tags=[tag_theory, tag_arch],
            status="closed"
        )

        # --- DEVOPS CLUSTER ---
        n_docker = Note(
            title="Docker Compose Setup",
            content=dedent("""\
                Our local dev environment is fully containerized.
                Volume mounts ensure database persistence and live-reloading for FastAPI/React.

                Make sure the `init.sql` is placed in `/docker-entrypoint-initdb.d/` to auto-create the `loom_test_db`.
            """),
            note_type=type_resource,
            tags=[tag_devops],
            status="closed"
        )

        # --- ORPHANS (No Links - to test graph isolation) ---
        n_orphan_1 = Note(
            title="Book: The Pragmatic Programmer",
            content="Great book. Need to summarize the chapter on DRY principles soon.",
            note_type=type_resource,
            tags=[],
            status="open"
        )

        n_orphan_2 = Note(
            title="Groceries list",
            content="- Coffee\n- Oat milk\n- Apples",
            note_type=type_snippet,
            tags=[],
            status="open"
        )

        db.add_all([
            n_arch, n_pg_search, n_fastapi_auth,
            n_frontend_moc, n_graph_3d, n_d3_physics,
            n_zettelkasten, n_degree_centrality,
            n_docker, n_orphan_1, n_orphan_2
        ])
        db.flush()  # Flush to get the IDs for linking

        print("Linking the Notes...")
        # 5. Create Links (Building the Graph Structure)
        links = [
            # Architecture Hub links
            Link(source_id=n_arch.id, target_id=n_pg_search.id, link_type_id=link_parent.id),
            Link(source_id=n_arch.id, target_id=n_fastapi_auth.id, link_type_id=link_parent.id),
            Link(source_id=n_arch.id, target_id=n_frontend_moc.id, link_type_id=link_parent.id),
            Link(source_id=n_arch.id, target_id=n_docker.id, link_type_id=link_parent.id),

            # Frontend Hub links
            Link(source_id=n_frontend_moc.id, target_id=n_graph_3d.id, link_type_id=link_parent.id),

            # Graph & Theory relationships
            Link(source_id=n_graph_3d.id, target_id=n_d3_physics.id, link_type_id=link_relates.id),
            Link(source_id=n_graph_3d.id, target_id=n_degree_centrality.id, link_type_id=link_implements.id),
            Link(source_id=n_degree_centrality.id, target_id=n_zettelkasten.id, link_type_id=link_relates.id),

            # Backend relationships
            Link(source_id=n_fastapi_auth.id, target_id=n_pg_search.id, link_type_id=link_relates.id),

            # Infrastructure
            Link(source_id=n_docker.id, target_id=n_pg_search.id, link_type_id=link_relates.id),
        ]

        db.add_all(links)
        db.commit()

        print(f"Demo-DB created successfully. Generated {len(links)} links between 11 notes.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding Demo-Data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()