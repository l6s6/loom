import { useEffect, useState } from "react";
import { createLink, deleteLink } from "@/api/noteLinks.ts";
import type { CreateNoteLink, NoteLink } from "@/types/noteLink.ts";
import { getLinks } from "@/api/noteLinks.ts";

export function useGetLink() {
  const [links, setLinks] = useState<NoteLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLinks(await getLinks());
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
  return { createLink: create, loading, error };
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
  return { deleteLink: remove, loading, error };
}
