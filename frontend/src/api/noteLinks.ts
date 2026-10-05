import type { CreateNoteLink, NoteLink } from "@/types/noteLink.ts";
import { apiClient } from "@/api/client.ts";

// GET Links
export const getLinks = () => apiClient<NoteLink[]>("/links");

// GET Link by Note ID
export const getLinksByNoteId = (noteId: number) =>
  apiClient<NoteLink>(`/notes?note_id=${noteId}`);

// POST Create Note
export const createLink = (link: CreateNoteLink) =>
  apiClient<NoteLink>(`/links`, {
    method: "POST",
    body: JSON.stringify(link),
  });

// DELETE Link by ID
export const deleteLink = (linkId: number) =>
  apiClient<void>(`/links/${linkId}`, { method: "DELETE" });
