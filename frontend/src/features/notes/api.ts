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

/**
 * Fetch all notes, optionally filtered via a query string.
 *
 * @param queryString - Optional URL query string for filtering notes.
 * @returns A promise resolving to the list of notes.
 */
export const getNotes = (queryString?: string) => {
  const url = queryString ? `/notes?${queryString}` : "/notes";
  return apiClient<Note[]>(url);
};

/**
 * Fetch a single note by its ID.
 *
 * @param noteId - The note identifier.
 * @returns A promise resolving to the requested note.
 */
export const getNoteById = (noteId: string) =>
  apiClient<Note>(`/notes/${noteId}`);

/**
 * Fetch all tags associated with notes.
 *
 * @returns A promise resolving to the list of tags.
 */
export const getTags = () => apiClient<Tag[]>("/notes/tags");

/**
 * Fetch all available note types.
 *
 * @returns A promise resolving to the list of note types.
 */
export const getNoteTypes = () => apiClient<NoteType[]>("/notes/types");

/**
 * Create a new note.
 *
 * @returns A promise resolving to the newly created note.
 */
export const createNote = () => apiClient<Note>(`/notes`, { method: "POST" });

/**
 * Create a new tag.
 *
 * @param tag - Tag payload to send to the API.
 * @returns A promise resolving to the created tag.
 */
export const createTag = (tag: TagCreate) =>
  apiClient<Note>(`/notes/tags`, {
    method: "POST",
    body: JSON.stringify(tag),
  });

/**
 * Create a new note type.
 *
 * @param type - Note type payload to send to the API.
 * @returns A promise resolving to the created note type.
 */
export const createNoteType = (type: NoteTypeCreate) =>
  apiClient<Note>(`/notes/types`, {
    method: "POST",
    body: JSON.stringify(type),
  });

/**
 * Update a note by passing the note fields to update.
 *
 * @param note - The note update payload.
 * @returns A promise resolving to the updated note.
 */
export const updateNote = (note: NoteUpdate) =>
  apiClient<Note>(`/notes/${note.id}`, {
    method: "PUT",
    body: JSON.stringify(note),
  });

/**
 * Update an existing tag.
 *
 * @param tag - The tag update payload.
 * @returns A promise resolving to the updated tag.
 */
export const updateTag = (tag: TagUpdate) =>
  apiClient<Note>(`/notes/tags/${tag.id}`, {
    method: "PUT",
    body: JSON.stringify(tag),
  });

/**
 * Update an existing note type.
 *
 * @param type - The note type update payload.
 * @returns A promise resolving to the updated note type.
 */
export const updateNoteType = (type: NoteTypeUpdate) =>
  apiClient<Note>(`/notes/types/${type.id}`, {
    method: "PUT",
    body: JSON.stringify(type),
  });

/**
 * Delete a note by ID.
 *
 * @param noteId - The note identifier to remove.
 * @returns A promise resolving to the empty response for a 204 No Content result.
 */
export const deleteNote = (noteId: string) =>
  apiClient<void>(`/notes/${noteId}`, { method: "DELETE" });

/**
 * Delete a tag by ID.
 *
 * @param tagId - The tag identifier to remove.
 * @returns A promise resolving to the empty response for a 204 No Content result.
 */
export const deleteTag = (tagId: string) =>
  apiClient<void>(`/notes/tags/${tagId}`, { method: "DELETE" });

/**
 * Delete a note type by ID.
 *
 * @param typeId - The note type identifier to remove.
 * @returns A promise resolving to the empty response for a 204 No Content result.
 */
export const deleteNoteType = (typeId: string) =>
  apiClient<void>(`/notes/types/${typeId}`, { method: "DELETE" });
