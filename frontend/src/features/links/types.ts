import type { Note } from "@/features/notes/types.ts";

/**
 * Represents a link between two notes in the application.
 */
export interface Link {
  id: string;
  origin: string;
  source: Note;
  target: Note;
  link_type: LinkType;
}

/**
 * Payload used to create a new link between two notes.
 */
export interface LinkCreate {
  origin: string;
  source_id: string;
  target_id: string;
  link_type_name: string;
}

/**
 * Describes a reusable relationship type such as "relates to" or "references".
 */
export interface LinkType {
  id: string;
  name: string;
}
