import type { NoteTag } from "./noteTag.ts";

export const NoteStatus = {
  None: "none",
  Open: "open",
  Ongoing: "ongoing",
  Closed: "closed",
} as const;

export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus];

export const NOTE_STATUS_CONFIG: Record<
  string,
  { label: string; bgColor: string; dotColor: string; textColor: string }
> = {
  none: {
    label: "None",
    bgColor: "bg-zinc-100 hover:bg-zinc-200",
    dotColor: "bg-zinc-700",
    textColor: "text-zinc-700",
  },
  open: {
    label: "Open",
    bgColor: "bg-green-100 hover:bg-green-200",
    dotColor: "bg-green-700",
    textColor: "text-green-700",
  },
  ongoing: {
    label: "Ongoing",
    bgColor: "bg-amber-100 hover:bg-amber-200",
    dotColor: "bg-amber-700",
    textColor: "text-amber-700",
  },
  closed: {
    label: "Closed",
    bgColor: "bg-primary-bg hover:bg-primary-bg-hover",
    dotColor: "bg-primary",
    textColor: "text-primary",
  },
};

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
