import { getLinkTypes } from "@/api/linkTypes.ts";
import { useQuery } from "@tanstack/react-query";

export function useGetLinkTypes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["link-types"],
    queryFn: getLinkTypes,
  });

  return {
    types: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}
