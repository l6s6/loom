"""Graph API endpoints for building a visualization of notes, tags, note types, and links.

This module exposes a single endpoint that constructs a graph payload for the
frontend, including vertices and edges derived from database records.

The graph is intended to drive the frontend's visual graph renderer, allowing
users to explore notes, tags, note types, and the relationships between them in
a single connected network.
"""

from fastapi import APIRouter, Depends
from pygments.lexers import verifpal
from sqlalchemy.orm import Session

from core.database import get_db
from domains.graph.schemas import Graph, VertexType, Vertex, Edge
from domains.links.models import Link
from domains.notes.models import Note
from domains.notes.routers import get_tags, get_note_types

router = APIRouter(prefix="/graph", tags=["graph"])
"""FastAPI router for graph-related API endpoints.

This router groups all API routes used to prepare graph visualization data for
the frontend.
"""

@router.get("", response_model=Graph)
def get_graph(db: Session = Depends(get_db)):
    """Build and return the graph payload used by the frontend visualization.

    This endpoint reads all notes, tags, note types, and links from the database
    and converts them into a graph model containing vertices and edges.

    Returns:
        Graph: A graph payload with all note, tag, and note-type vertices, plus
        all relationship edges between them.

    Notes:
        - Notes become vertices of type `VertexType.note`.
        - Tags become vertices of type `VertexType.tag`.
        - Note types become vertices of type `VertexType.note_type`.
        - Links between notes become edges.
        - Tag relationships and note-type assignments are added as explicit edges
          so the frontend can visualize those relationships as well.
    """
    # Query all relationships from the database.
    links = db.query(Link).all()

    # Retrieve helper datasets used to build the graph.
    note_types = get_note_types(db)
    tags = get_tags(db)
    notes = db.query(Note).all()

    # Create the vertex list for all note, tag, and note-type entities.
    vertices = [
        Vertex(id=str(n.id), name=str(n.title), type=VertexType.note)
        for n in notes
    ]
    vertices.extend([
        Vertex(id=str(t.id), name=t.name, type=VertexType.tag)
        for t in tags
    ])
    vertices.extend([
        Vertex(id=str(nt.id), name=nt.name, type=VertexType.note_type)
        for nt in note_types
    ])

    # Create the initial edge list from note-to-note links in the database.
    edges = [
        Edge(
            source_id=str(l.source_id),
            target_id=str(l.target_id),
            type=l.link_type.name,
        )
        for l in links
    ]

    # Add tag membership edges and note-type edges to make those relationships
    # visible in the graph.
    for n in notes:
        for t in n.tags:
            edges.append(
                Edge(
                    source_id=str(n.id),
                    target_id=str(t.id),
                    type="Tag",
                )
            )
        if n.note_type_id:
            edges.append(
                Edge(
                    source_id=str(n.id),
                    target_id=str(n.note_type_id),
                    type="Note Type",
                )
            )

    # Return a normalized graph payload that matches the frontend contract.
    return Graph(vertices=vertices, edges=edges)