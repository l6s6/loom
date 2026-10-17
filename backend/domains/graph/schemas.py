from enum import Enum
from pydantic import BaseModel


class VertexType(str, Enum):
    note = "note"
    tag = "tag"
    note_type = "note_type"


class Vertex(BaseModel):
    id: str
    name: str
    type: VertexType
    val: int

class Edge(BaseModel):
    source_id: str
    target_id: str
    type: str


class Graph(BaseModel):
    vertices: list[Vertex]
    edges: list[Edge]

