import { apiClient } from "@/api/apiClient.ts";
import type {
  Tag,
  Note,
  UpdateNote,
  NoteType,
} from "@/features/notes/types.ts";

// GET Notes
export const getNotes = () => apiClient<Note[]>("/notes");

// GET Note by ID
export const getNoteById = (noteId: number) =>
  apiClient<Note>(`/notes/${noteId}`);

// GET Note Tags
export const getTags = () => apiClient<Tag[]>("/notes/tags");

// GET Note Types
export const getNoteTypes = () => apiClient<NoteType[]>("/notes/types");

// POST Create Note
export const createNote = () =>
  apiClient<Note>(`/notes`, {
    method: "POST",
  });

// PUT Update Note
export const updateNote = (note: UpdateNote) =>
  apiClient<Note>(`/notes/${note.id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });

// DELETE Note by ID
export const deleteNote = (noteId: number) =>
  apiClient<void>(`/notes/${noteId}`, { method: "DELETE" });
