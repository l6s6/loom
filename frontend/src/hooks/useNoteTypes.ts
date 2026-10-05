import { useEffect, useState } from "react";
import type { NoteType } from "../types/noteType.ts";
import { getNoteTypes } from "../api/noteTypes.ts";

export function useGetNoteTypes() {
  const [types, setTypes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTypes(await getNoteTypes());
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

  return { refetchTypes: load, types, loading: isLoading, error };
}
