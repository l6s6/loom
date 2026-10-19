from fastapi import APIRouter, Depends
from pygments.lexers import verifpal
from sqlalchemy.orm import Session

from core.database import get_db
from domains.graph.schemas import Graph, VertexType, Vertex, Edge
from domains.links.models import Link
from domains.notes.models import Note
from domains.notes.routers import get_tags, get_note_types

router = APIRouter(prefix="/graph", tags=["graph"])


@router.get("", response_model=Graph)
def get_graph(db: Session = Depends(get_db),
              show_notes:  bool | None = True,
              show_tags:  bool | None = True,
              show_note_types:  bool | None = True,
              show_links:  bool | None = True,
              show_tag_links:  bool | None = False,
              show_note_type_links:  bool | None = False,
              ):
    vertices = []
    edges = []
    links = db.query(Link).all()
    note_types = get_note_types(db)
    tags = get_tags(db)
    notes = db.query(Note).all()


    # Vertices
    if show_notes:
        for note in notes:
            incoming_count = sum(1 for l in links if l.target_id == note.id)
            outgoing_count = sum(1 for l in links if l.source_id == note.id)

            # Adjust node size based on the types of links that are shown
            note_link_count = (incoming_count + outgoing_count) if show_links else 0
            tag_link_count = len(note.tags) if show_tag_links else 0
            type_link_count = 1 if show_note_type_links else 0
            count_sum = note_link_count + tag_link_count + type_link_count

            vertices.append(Vertex(
                id=str(note.id),
                name=str(note.title),
                type=VertexType.note,
                val=max(1, count_sum)
            ))

    if show_tags:
        for tag in tags:
            vertices.append(Vertex(
                id=tag.id,
                name=tag.name,
                type=VertexType.tag,
                val=max(1, tag.note_count if show_tag_links else 0)
            ))

    if show_note_types:
        for note_type in note_types:
            vertices.append(Vertex(
                id=note_type.id,
                name=note_type.name,
                type=VertexType.note_type,
                val=max(1, note_type.note_count if show_note_type_links else 0)
            ))


    # Edges
    if show_links and show_notes:
        for link in links:
            edges.append(Edge(
                source_id=link.source_id,
                target_id=link.target_id,
                type=link.link_type.name
            ))


    if show_tag_links and show_tags:
        for note in notes:
            for tag in note.tags:
                edges.append(Edge(
                    source_id=note.id,
                    target_id=tag.id,
                    type="Tag"
                ))



    if show_note_type_links and show_note_types:
        for note in notes:
            edges.append(Edge(
                source_id=note.id,
                target_id=note.note_type_id,
                type="Note Type"
            ))

    return Graph(vertices=vertices, edges=edges)