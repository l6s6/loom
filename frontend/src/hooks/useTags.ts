import { useEffect, useState } from "react";
import type { NoteTag } from "../types/noteTag.ts";
import { getNoteTags } from "../api/noteTags.ts";

export function useGetTags() {
  const [tags, setTags] = useState<NoteTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTags(await getNoteTags());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchTags: load, tags, loading: isLoading, error };
}
