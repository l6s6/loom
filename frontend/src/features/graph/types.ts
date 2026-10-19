export const VertexType = {
  note: "note",
  tag: "tag",
  note_type: "note_type",
} as const;
export type VertexType = (typeof VertexType)[keyof typeof VertexType];

export const VERTEX_COLORS: Record<string, string> = {
  [VertexType.note]: "#ef4444",
  [VertexType.tag]: "#3b82f6",
  [VertexType.note_type]: "#10b981",
};

export interface Vertex {
  id: string;
  name: string;
  type: VertexType;
  val: number;
}

export interface Edge {
  source_id: string;
  target_id: string;
  type: string;
}

export interface Graph {
  vertices: Vertex[];
  edges: Edge[];
}

export const GRAPH_DEFAULT_OPTIONS: Record<string, boolean> = {
  show_notes: true,
  show_tags: true,
  show_note_types: true,
  show_links: true,
  show_tag_links: false,
  show_note_type_links: false,
};
