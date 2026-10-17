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
def get_graph(db: Session = Depends(get_db)):
    vertices = []
    edges = []
    links = db.query(Link).all()
    note_types = get_note_types(db)
    tags = get_tags(db)
    notes = db.query(Note).all()

    # Vertices
    for note in notes:
        incoming_count = sum(1 for l in links if l.target_id == note.id)
        outgoing_count = sum(1 for l in links if l.source_id == note.id)
        vertices.append(Vertex(
            id=str(note.id),
            name=str(note.title),
            type=VertexType.note,
            val=max(1, incoming_count+outgoing_count)
        ))

    for tag in tags:
        vertices.append(Vertex(
            id=tag.id,
            name=tag.name,
            type=VertexType.tag,
            val=max(1, tag.note_count)
        ))

    for note_type in note_types:
        vertices.append(Vertex(
            id=note_type.id,
            name=note_type.name,
            type=VertexType.note_type,
            val=max(1, note_type.note_count)
        ))


    # Edges
    for link in links:
        edges.append(Edge(
            source_id=link.source.id,
            target_id=link.target.id,
            type=link.link_type.name
        ))

    return Graph(vertices=vertices, edges=edges)