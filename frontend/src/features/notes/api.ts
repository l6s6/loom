import { apiClient } from "@/api/apiClient.ts";
import type {
  Tag,
  Note,
  NoteUpdate,
  NoteType,
  TagCreate,
  TagUpdate,
  NoteTypeCreate,
  NoteTypeUpdate,
} from "@/features/notes/types.ts";

// GET Notes
export const getNotes = (queryString?: string) => {
  const url = queryString ? `/notes?${queryString}` : "/notes";
  return apiClient<Note[]>(url);
};

// GET Note by ID
export const getNoteById = (noteId: number) =>
  apiClient<Note>(`/notes/${noteId}`);

// GET Note Tags
export const getTags = () => apiClient<Tag[]>("/notes/tags");

// GET Note Types
export const getNoteTypes = () => apiClient<NoteType[]>("/notes/types");

// POST Create Note
export const createNote = () => apiClient<Note>(`/notes`, { method: "POST" });

// POST Create Tag
export const createTag = (tag: TagCreate) =>
  apiClient<Note>(`/notes/tags`, {
    method: "POST",
    body: JSON.stringify(tag),
  });

// POST Create NoteType
export const createNoteType = (type: NoteTypeCreate) =>
  apiClient<Note>(`/notes/types`, {
    method: "POST",
    body: JSON.stringify(type),
  });

// PUT Update Note
export const updateNote = (note: NoteUpdate) =>
  apiClient<Note>(`/notes/${note.id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });

// PUT Update Tag
export const updateTag = (tag: TagUpdate) =>
  apiClient<Note>(`/notes/tags/${tag.id}`, {
    method: "PUT",
    body: JSON.stringify(tag),
  });

// PUT Update NoteType
export const updateNoteType = (type: NoteTypeUpdate) =>
  apiClient<Note>(`/notes/types/${type.id}`, {
    method: "PUT",
    body: JSON.stringify(type),
  });

// DELETE Note by ID
export const deleteNote = (noteId: number) =>
  apiClient<void>(`/notes/${noteId}`, { method: "DELETE" });

// DELETE Tag by ID
export const deleteTag = (tagId: number) =>
  apiClient<void>(`/notes/tags/${tagId}`, { method: "DELETE" });

// DELETE NoteType by ID
export const deleteNoteType = (typeId: number) =>
  apiClient<void>(`/notes/types/${typeId}`, { method: "DELETE" });
