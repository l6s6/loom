import { apiClient } from "@/api/apiClient.ts";
import type { CreateLink, LinkType, Link } from "@/features/links/types.ts";

// GET Links
export const getLinks = () => apiClient<Link[]>("/links");

// GET Link by Note ID
export const getLinksByNoteId = (noteId: number) =>
  apiClient<Link[]>(`/links?note_id=${noteId}`);

// GET Link Types
export const getLinkTypes = () => apiClient<LinkType[]>("/links/types");

// POST Create Note
export const createLink = (link: CreateLink) =>
  apiClient<Link>(`/links`, {
    method: "POST",
    body: JSON.stringify(link),
  });

// DELETE Link by ID
export const deleteLink = (linkId: number) =>
  apiClient<void>(`/links/${linkId}`, { method: "DELETE" });
