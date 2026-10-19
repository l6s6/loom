import { apiClient } from "@/api/apiClient.ts";
import type { Graph } from "@/features/graph/types.ts";

// GET Graph
export const getGraph = (queryString: string) =>
  apiClient<Graph>(`/graph?${queryString}`);
