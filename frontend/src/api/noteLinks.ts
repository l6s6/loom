import type { CreateNoteLink, NoteLink } from "@/types/noteLink.ts";
import { apiClient } from "@/api/client.ts";

// GET Links
export const getLinks = (note_id?: number) => {
  const params = new URLSearchParams();
  if (note_id !== undefined) params.append("note_id", note_id.toString());

  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiClient<NoteLink[]>(`/links${queryString}`);
};

// POST Create Note
export const createLink = (link: CreateNoteLink) =>
  apiClient<NoteLink>(`/links`, {
    method: "POST",
    body: JSON.stringify(link),
  });

// DELETE Link by Id
export const deleteLink = (linkId: number) =>
  apiClient<void>(`/links/${linkId}`, { method: "DELETE" });
