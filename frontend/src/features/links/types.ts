import type { Note } from "@/features/notes/types.ts";

export interface Link {
  id: number;
  origin: string;
  source: Note;
  target: Note;
  link_type: LinkType;
}

export interface CreateLink {
  origin: string;
  source_id: number;
  target_id: number;
  link_type_name: string;
}

export interface LinkType {
  id: number;
  name: string;
}
