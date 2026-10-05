import type { Note, UpdateNote } from "../types/note.ts";
import { apiClient } from "@/api/client.ts";

// GET Notes
export const getNotes = () => apiClient<Note[]>("/notes");

// GET Note by ID
export const getNoteById = (noteId: number) =>
  apiClient<Note>(`/notes/${noteId}`);

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
