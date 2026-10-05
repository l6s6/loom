import { useEffect, useState } from "react";
import { createLink, deleteLink } from "@/api/noteLinks.ts";
import type { CreateNoteLink, NoteLink } from "@/types/noteLink.ts";
import { getLinks } from "@/api/noteLinks.ts";

export function useGetLinks(note_id?: number) {
  const [links, setLinks] = useState<NoteLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setLinks(await getLinks(note_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchLinks: load, links, loading: isLoading, error, setLinks };
}

export function useCreateLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (link: CreateNoteLink) => {
    setIsLoading(true);
    setError(null);
    try {
      return await createLink(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { createLink: create, loading: isLoading, error };
}

export function useDeleteLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (linkId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      return await deleteLink(linkId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteLink: remove, loading: isLoading, error };
}
