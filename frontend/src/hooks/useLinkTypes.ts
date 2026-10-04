import { useEffect, useState } from "react";
import type { LinkType } from "../types/linkType.ts";
import { getLinkTypes } from "@/api/linkTypes.ts";

export function useGetLinkTypes() {
  const [types, setTypes] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setTypes(await getLinkTypes());
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
