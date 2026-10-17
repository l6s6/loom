import type { Note } from "@/features/notes/types.ts";

export interface Link {
  id: string;
  origin: string;
  source: Note;
  target: Note;
  link_type: LinkType;
}

export interface LinkCreate {
  origin: string;
  source_id: string;
  target_id: string;
  link_type_name: string;
}

export interface LinkType {
  id: string;
  name: string;
}
