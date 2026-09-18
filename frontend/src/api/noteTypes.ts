import type { NoteType } from "../types/noteType.ts";

export const getNoteTypes = async (): Promise<NoteType[]> => {
  const response = await fetch("http://localhost:8000/notes/types");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteType[];
};
