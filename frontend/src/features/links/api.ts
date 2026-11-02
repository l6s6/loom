import { apiClient } from "@/api/apiClient.ts";
import type { LinkCreate, LinkType, Link } from "@/features/links/types.ts";

/**
 * Fetch all links from the backend.
 *
 * @returns A promise resolving to the full list of links.
 */
export const getLinks = () => apiClient<Link[]>("/links");

/**
 * Fetch all links linked to a specific note, either as source or target.
 *
 * @param noteId - The note identifier used in the filter.
 * @returns A promise resolving to the matching list of links.
 */
export const getLinksByNoteId = (noteId: string) =>
  apiClient<Link[]>(`/links?note_id=${noteId}`);

/**
 * Fetch all available link type definitions from the backend.
 *
 * @returns A promise resolving to the list of link types.
 */
export const getLinkTypes = () => apiClient<LinkType[]>("/links/types");

/**
 * Create a new note-to-note link.
 *
 * @param link - The link payload to send to the server.
 * @returns A promise resolving to the created link record.
 */
export const createLink = (link: LinkCreate) =>
  apiClient<Link>(`/links`, {
    method: "POST",
    body: JSON.stringify(link),
  });

/**
 * Delete a link by its identifier.
 *
 * @param linkId - The ID of the link to remove.
 * @returns A promise resolving to the empty response for a 204 No Content result.
 */
export const deleteLink = (linkId: string) =>
  apiClient<void>(`/links/${linkId}`, { method: "DELETE" });
