/**
 * Available note lifecycle states used throughout the app.
 */
export const NoteStatus = {
  None: "none",
  Open: "open",
  Ongoing: "ongoing",
  Closed: "closed",
} as const;

export type NoteStatus = (typeof NoteStatus)[keyof typeof NoteStatus];

/**
 * Styling metadata for each note status.
 */
export interface NoteStatusConfigProps {
  label: string;
  bgColor: string;
  hoverColor: string;
  dotColor: string;
  textColor: string;
}

/**
 * Visual configuration applied to note status pills and selectors.
 */
export const NOTE_STATUS_CONFIG: Record<NoteStatus, NoteStatusConfigProps> = {
  none: {
    label: "None",
    bgColor: "bg-zinc-100",
    hoverColor: "hover:bg-zinc-200",
    dotColor: "bg-zinc-700",
    textColor: "text-zinc-700",
  },
  open: {
    label: "Open",
    bgColor: "bg-green-100",
    hoverColor: "hover:bg-green-200",
    dotColor: "bg-green-700",
    textColor: "text-green-700",
  },
  ongoing: {
    label: "Ongoing",
    bgColor: "bg-amber-100",
    hoverColor: "hover:bg-amber-200",
    dotColor: "bg-amber-700",
    textColor: "text-amber-700",
  },
  closed: {
    label: "Closed",
    bgColor: "bg-sky-100",
    hoverColor: "hover:bg-sky-200",
    dotColor: "bg-sky-700",
    textColor: "text-sky-700",
  },
};

/**
 * Represents a single note entity with metadata and relationships.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  status: NoteStatus;
  note_type: NoteType;
  tags: Tag[];
  created_at: string;
  modified_at: string;
}

/**
 * Payload used to update an existing note.
 */
export interface NoteUpdate {
  id: string;
  title?: string;
  content?: string;
  status?: NoteStatus;
  note_type_name?: string;
  tag_names?: string[];
}

/**
 * Base shape for entities that expose a name and note count.
 */
export interface BaseEntity {
  id: string;
  name: string;
  note_count: number;
}

/**
 * Payload used to create a named entity.
 */
export interface BaseEntityCreate {
  name: string;
}

/**
 * Payload used to update a named entity.
 */
export interface BaseEntityUpdate {
  id: string;
  name?: string;
}

export interface Tag extends BaseEntity {}
export interface TagCreate extends BaseEntityCreate {}
export interface TagUpdate extends BaseEntityUpdate {}

export interface NoteType extends BaseEntity {}
export interface NoteTypeCreate extends BaseEntityCreate {}
export interface NoteTypeUpdate extends BaseEntityUpdate {}
