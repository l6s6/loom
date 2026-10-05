import { apiClient } from "@/api/apiClient.ts";
import type {
  CreateNoteLink,
  LinkType,
  NoteLink,
} from "@/features/links/types.ts";

// GET Links
export const getLinks = () => apiClient<NoteLink[]>("/links");

// GET Link by Note ID
export const getLinksByNoteId = (noteId: number) =>
  apiClient<NoteLink[]>(`/links?note_id=${noteId}`);

// GET Link Types
export const getLinkTypes = () => apiClient<LinkType[]>("/links/types");

// POST Create Note
export const createLink = (link: CreateNoteLink) =>
  apiClient<NoteLink>(`/links`, {
    method: "POST",
    body: JSON.stringify(link),
  });

// DELETE Link by ID
export const deleteLink = (linkId: number) =>
  apiClient<void>(`/links/${linkId}`, { method: "DELETE" });
