import { getNoteTypes } from "../api/noteTypes.ts";
import { useQuery } from "@tanstack/react-query";

export function useGetNoteTypes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note-types"],
    queryFn: getNoteTypes,
  });

  return {
    types: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}
