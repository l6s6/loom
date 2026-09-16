import { useEffect, useState } from "react";
import type { Tag } from "../types/tag.ts";
import { getNoteTags } from "../api/noteTags.ts";

export function useGetTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setTags(await getNoteTags());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchTags: load, tags, loading, error };
}
