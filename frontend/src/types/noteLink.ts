import type { Note } from "@/types/note.ts";
import type { LinkType } from "@/types/linkType.ts";

export interface NoteLink {
  id: number;
  origin: string;
  source: Note;
  target: Note;
  link_type: LinkType;
}

export interface CreateNoteLink {
  origin: string;
  source_id: number;
  target_id: number;
  link_type_name: string;
}
