import type {
  CreateNote,
  DeleteNote,
  Note,
  UpdateNote,
} from "../types/note.ts";

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch("http://localhost:8000/notes");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Note[];
};

export const createNote = async (note: CreateNote): Promise<Note> => {
  const response = await fetch("http://localhost:8000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Note;
};

export const updateNote = async (note: UpdateNote): Promise<Note> => {
  const response = await fetch(
    "http://localhost:8000/notes/" + note.id.toString(),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Note;
};

export const deleteNote = async (note: DeleteNote): Promise<Note> => {
  const response = await fetch(
    "http://localhost:8000/notes/" + note.id.toString(),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Note;
};
