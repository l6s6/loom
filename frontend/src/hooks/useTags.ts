import { getNoteTags } from "../api/noteTags.ts";
import { useQuery } from "@tanstack/react-query";

export function useGetTags() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note-tags"],
    queryFn: getNoteTags,
  });

  return {
    tags: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}
