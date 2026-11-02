import { useQuery } from "@tanstack/react-query";
import { getGraph } from "@/features/graph/api.ts";

/**
 * React hook for fetching and exposing graph data for the current query state.
 *
 * @param queryString - URL query string used to request a specific graph subset.
 * @returns An object containing the graph data, loading state, and a human-readable error message.
 */
export function useGetGraph(queryString: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["graph", queryString],
    queryFn: () => getGraph(queryString),
  });

  return {
    graph: data || { vertices: [], edges: [] },
    isLoading,
    error: error ? error.message : null,
  };
}
