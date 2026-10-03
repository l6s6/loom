import { useState } from "react";
import { createLink, deleteLink } from "@/api/noteLinks.ts";
import type { CreateNoteLink } from "@/types/noteLink.ts";

export function useCreateLink() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const create = async (link: CreateNoteLink) => {
    try {
      return await createLink(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { createNote: create, loading, error };
}

export function useDeleteLink() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const remove = async (linkId: number) => {
    try {
      return await deleteLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { deleteNote: remove, loading, error };
}
