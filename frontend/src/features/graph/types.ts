export const VertexType = {
  note: "note",
  tag: "tag",
  note_type: "note_type",
} as const;
export type VertexType = (typeof VertexType)[keyof typeof VertexType];

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
