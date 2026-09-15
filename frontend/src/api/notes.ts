import type Note from "../types/note.ts";

export const fetchNotes = async (): Promise<Note[]> => {
    const response = await fetch('http://localhost:8000/notes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Note[];
};