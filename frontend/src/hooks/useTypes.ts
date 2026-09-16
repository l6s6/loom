import { useEffect, useState } from "react";
import type { Type } from "../types/type.ts";
import { getNoteTypes } from "../api/noteTypes.ts";

export function useGetTypes() {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setTypes(await getNoteTypes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchTypes: load, types, loading, error };
}
