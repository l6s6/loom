import { useQuery } from "@tanstack/react-query";
import { getGraph } from "@/features/graph/api.ts";

export function useGetGraph() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["graph"],
    queryFn: getGraph,
  });

  return {
    graph: data || { vertices: [], edges: [] },
    isLoading,
    error: error ? error.message : null,
  };
}
