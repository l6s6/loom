"""Graph schema models for representing a directed graph in Loom.

This module defines the data structures used to serialize graph data between the
backend and clients. Each graph is composed of vertices and the edges connecting
them, with typed vertex categories and validation provided by Pydantic models.
"""

from enum import Enum
from typing import Optional

from pydantic import BaseModel


class VertexType(str, Enum):
    """Enumeration of valid vertex categories in the graph.

    These values identify the semantic type of a node so the frontend can render
    the graph with the correct visual treatment and behavior.
    """

    note = "note"
    tag = "tag"
    note_type = "note_type"


class Vertex(BaseModel):
    """Represents a single graph node.

    Attributes:
        id: Unique identifier for the vertex within the graph.
        name: Human-readable label shown to users in the graph UI.
        type: Category of the vertex; determines its meaning and styling.
        val: Numeric value associated with the vertex, such as weight or score.
    """

    id: str
    name: str
    type: VertexType
    val: Optional[int] = 1


class Edge(BaseModel):
    """Represents a directed relationship between two vertices.

    Attributes:
        source_id: Identifier of the source vertex.
        target_id: Identifier of the target vertex.
        type: String describing the semantic relationship between the two vertices.
    """

    source_id: str
    target_id: str
    type: str


class Graph(BaseModel):
    """Represents a complete graph as a collection of vertices and edges.

    This model is used to transmit graph data in a single payload, allowing the
    client to render or analyze the structure as a connected network.
    """

    vertices: list[Vertex]
    edges: list[Edge]