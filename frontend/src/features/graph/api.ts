import { apiClient } from "@/api/apiClient.ts";
import type { Graph } from "@/features/graph/types.ts";

/**
 * Fetches graph data from the backend for the current query parameters.
 *
 * @param queryString - The URL query string used to filter the graph view.
 * @returns A promise resolving to the Graph payload returned by the API.
 */
export const getGraph = (queryString: string) =>
  apiClient<Graph>(`/graph?${queryString}`);
