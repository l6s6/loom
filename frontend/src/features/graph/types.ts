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

export type GraphNode = {
  id: string;
  name: string;
  val: number;
  group: VertexType;
};
export type GraphLink = { source: string; target: string; type: string };

export const VERTEX_COLORS: Record<string, string> = {
  [VertexType.note]: "#2e5497",
  [VertexType.tag]: "#2a8f70",
  [VertexType.note_type]: "#8f3030",
};
export const GRAPH_FALLBACK_COLOR = "#94a3b8";
export const GRAPH_ACCENT_COLOR = "#4f46e5";

export const GRAPH_GROUP_LABEL: Record<string, string> = {
  [VertexType.note]: "notes",
  [VertexType.tag]: "tags",
  [VertexType.note_type]: "types",
};
// Row order in the hover card: type and tags first, then linked notes
export const GRAPH_GROUP_ORDER: string[] = [
  VertexType.note_type,
  VertexType.tag,
  VertexType.note,
];

export const GRAPH_LINK_BASE = "rgba(120,130,145,0.25)";
export const GRAPH_LINK_DIM = "rgba(120,130,145,0.04)";
export const GRAPH_LINK_HOT = "rgba(79,70,229,0.7)";
