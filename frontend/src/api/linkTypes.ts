import type { NoteType } from "../types/noteType.ts";

export const getLinkTypes = async (): Promise<NoteType[]> => {
  const response = await fetch("http://localhost:8000/links/types");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteType[];
};
