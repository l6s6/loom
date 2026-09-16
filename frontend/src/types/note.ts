import type { Tag } from "./tag.ts";

export const NoteStatus = {
  None: "none",
  Open: "open",
  Ongoing: "ongoing",
  Closed: "closed",
} as const;

export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus];

export interface Note {
  id: number;
  title: string;
  content: string;
  status: string;
  note_type: {
    id: number;
    name: string;
  };
  tags: Tag[];
  created_at: Date;
  modified_at: Date;
}

export interface CreateNote {
  title: string;
  content: string;
  status: string;
  note_type_name: string;
  tag_names: string[];
}

export interface DeleteNote {
  id: number;
}

export interface UpdateNote {
  id: number;
  title?: string;
  content?: string;
  status?: string;
  note_type_name?: string;
  tag_names?: string[];
}
