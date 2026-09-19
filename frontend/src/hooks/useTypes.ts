import { useEffect, useState } from "react";
import type { NoteType } from "../types/noteType.ts";
import { getNoteTypes } from "../api/noteTypes.ts";

export function useGetTypes() {
  const [types, setTypes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setTypes(await getNoteTypes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchTypes: load, types, loading: isLoading, error };
}
