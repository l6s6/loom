import { useQuery } from "@tanstack/react-query";
import { getGraph } from "@/features/graph/api.ts";

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
