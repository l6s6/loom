import type { NoteTag } from "./noteTag.ts";

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
  tags: NoteTag[];
  created_at: string;
  modified_at: string;
}

export interface CreateNote {
  title: string;
  content: string;
  status: string;
  note_type_name: string;
  tag_names: string[];
}

export interface UpdateNote {
  id: number;
  title?: string;
  content?: string;
  status?: string;
  note_type_name?: string;
  tag_names?: string[];
}
