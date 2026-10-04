import type { CreateNoteLink, NoteLink } from "@/types/noteLink.ts";

export const getLinks = async (): Promise<NoteLink[]> => {
  const response = await fetch("http://localhost:8000/links");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteLink[];
};

export const createLink = async (link: CreateNoteLink): Promise<NoteLink> => {
  const response = await fetch("http://localhost:8000/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(link),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteLink;
};

export const deleteLink = async (linkId: number): Promise<NoteLink> => {
  const response = await fetch(
    "http://localhost:8000/notes/" + linkId.toString(),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return (await response.json()) as NoteLink;
};
