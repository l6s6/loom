import type { NoteTag } from "../types/noteTag.ts";

export const getNoteTags = async (): Promise<NoteTag[]> => {
  const response = await fetch("http://localhost:8000/notes/tags");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteTag[];
};
