import { apiClient } from "@/api/apiClient.ts";
import type { Graph } from "@/features/graph/types.ts";

/**
 * Fetches the graph payload from the backend.
 *
 * This helper calls the `/graph` endpoint and deserializes the response into the
 * `Graph` type defined in the graph domain. It is used by the frontend to fetch
 * the nodes and edges required for the visualization layer.
 *
 * @returns {Promise<Graph>} A promise resolving to the graph data returned by the API.
 *
 * @example
 * const graph = await getGraph();
 * console.log(graph.vertices.length);
 */
export const getGraph = () => apiClient<Graph>(`/graph`);
