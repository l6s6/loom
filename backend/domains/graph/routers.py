from fastapi import APIRouter, Depends
from pygments.lexers import verifpal
from sqlalchemy.orm import Session

from core.database import get_db
from domains.graph.schemas import Graph, VertexType
from domains.links.models import Link
from domains.links.routers import get_links
from domains.notes.models import Note, Tag, NoteType
from domains.notes.routers import get_notes

router = APIRouter(prefix="/graph", tags=["graph"])


@router.get("", response_model=Graph)
def get_graph(db: Session = Depends(get_db)):
    vertices = []
    edges = []

    # Vertices
    notes = db.query(Note).all()
    for note in notes:
        vertices.append({
            "id": note.id,
            "name": note.title,
            "type": VertexType.note.name,
            "val": 1
        })

    tags = db.query(Tag).all()
    for tag in tags:
        vertices.append({
            "id": tag.id,
            "name": tag.name,
            "type": VertexType.tag.name,
            "val": 1
        })

    note_types = db.query(NoteType).all()
    for note_type in note_types:
        vertices.append({
            "id": note_type.id,
            "name": note_type.name,
            "type": VertexType.note_type.name,
            "val": 1
        })


    # Edges
    links = db.query(Link).all()
    for link in links:
        edges.append({
            "source_id": link.source_id,
            "target_id": link.target_id,
            "type": link.link_type.name
        })

    return {"vertices": vertices, "edges": edges}