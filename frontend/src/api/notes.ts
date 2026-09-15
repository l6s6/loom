import type {
  CreateNote,
  DeleteNote,
  Note,
  UpdateNote,
} from "../types/note.ts";

export const fetchGetNotes = async (): Promise<Note[]> => {
  const response = await fetch("http://localhost:8000/notes");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as Note[];
};

export const fetchCreateNote = async (note: CreateNote): Promise<Note> => {
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

export const fetchUpdateNote = async (note: UpdateNote): Promise<Note> => {
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

export const fetchDeleteNote = async (note: DeleteNote): Promise<Note> => {
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
