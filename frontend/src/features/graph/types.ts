/**
 * Supported node categories within the graph.
 */
export const VertexType = {
  note: "note",
  tag: "tag",
  note_type: "note_type",
} as const;

export type VertexType = (typeof VertexType)[keyof typeof VertexType];

/**
 * Visual colors associated with each vertex category in the graph UI.
 */
export const VERTEX_COLORS: Record<string, string> = {
  [VertexType.note]: "#ef4444",
  [VertexType.tag]: "#3b82f6",
  [VertexType.note_type]: "#10b981",
};

/**
 * Represents a graph node, such as a note, tag, or note type.
 */
export interface Vertex {
  id: string;
  name: string;
  type: VertexType;
  val: number;
}

/**
 * Represents a relationship between two graph vertices.
 */
export interface Edge {
  source_id: string;
  target_id: string;
  type: string;
}

/**
 * Entire graph payload returned by the backend.
 */
export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

/**
 * Default visibility options for graph layers and relationship overlays.
 */
export const GRAPH_DEFAULT_OPTIONS: Record<string, boolean> = {
  show_notes: true,
  show_tags: true,
  show_note_types: true,
  show_links: true,
  show_tag_links: false,
  show_note_type_links: false,
};
