import { useQuery } from "@tanstack/react-query";
import { getGraph } from "@/features/graph/api.ts";

/**
 * React hook for fetching and exposing the graph data used by the graph view.
 *
 * This hook wraps TanStack Query's `useQuery` to request the graph payload once
 * and provide a consistent loading/error state to consumers.
 *
 * @returns {{
 *   graph: { vertices: Array<any>; edges: Array<any> };
 *   isLoading: boolean;
 *   error: string | null;
 * }} An object containing the graph payload, loading state, and an error message.
 */
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
