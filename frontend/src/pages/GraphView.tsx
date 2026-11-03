import { useGetGraph } from "@/features/graph/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import Graph from "@/features/graph/components/Graph.tsx";
import GraphLegend from "@/features/graph/components/GraphLegend.tsx";
import { useSearchParams } from "react-router-dom";
import {
  GRAPH_DEFAULT_OPTIONS,
  type GraphLink,
  type GraphNode,
  VertexType,
} from "@/features/graph/types.ts";
import { idOf } from "@/lib/utils.ts";
import { useMemo } from "react";

/**
 * Graph view page for visualizing the relationship network.
 *
 * This page reads filter state from the current URL, loads the graph payload from
 * the backend, applies visibility rules, and renders the result using the 3D
 * graph component plus the legend.
 *
 * The page is responsible for turning a backend graph payload into the exact
 * shape expected by the visualization engine while honoring user-selected
 * filters for notes, tags, types, and link overlays.
 */
const GraphView = () => {
  const [searchParams] = useSearchParams();
  const { graph, isLoading, error } = useGetGraph();

  /**
   * Reads a boolean filter from the query string.
   *
   * If the parameter is absent, the default value from GRAPH_DEFAULT_OPTIONS is
   * used instead.
   *
   * @param {keyof typeof GRAPH_DEFAULT_OPTIONS} key - The graph option key to check.
   * @returns {boolean} The resolved visibility state.
   */
  const getFilter = (key: keyof typeof GRAPH_DEFAULT_OPTIONS): boolean => {
    const param = searchParams.get(key);
    return param !== null ? param === "true" : GRAPH_DEFAULT_OPTIONS[key];
  };

  const showNotes = getFilter("show_notes");
  const showTags = getFilter("show_tags");
  const showNoteTypes = getFilter("show_note_types");
  const showLinks = getFilter("show_links");
  const showTagLinks = getFilter("show_tag_links");
  const showNoteTypeLinks = getFilter("show_note_type_links");

  /**
   * Produces the node/link payload actually passed to the 3D graph renderer.
   *
   * This memoized transformation:
   * - includes only the enabled node categories
   * - filters out links whose endpoints are hidden
   * - respects the configured link-type toggles (tags, note types, standard links)
   *
   * @returns {{ nodes: GraphNode[]; links: GraphLink[] }} Filtered graph data.
   */
  const filteredGraphData = useMemo(() => {
    if (!graph?.vertices) return { nodes: [], links: [] };

    // Set of currently allowed vertex types
    const allowedTypes = new Set<string>();
    if (showNotes) allowedTypes.add(VertexType.note);
    if (showTags) allowedTypes.add(VertexType.tag);
    if (showNoteTypes) allowedTypes.add(VertexType.note_type);

    // Filter nodes and collect visible IDs for link validation
    const visibleNodes: GraphNode[] = [];
    const visibleNodeIds = new Set<string>();

    graph.vertices.forEach((v) => {
      if (allowedTypes.has(v.type)) {
        visibleNodes.push({
          id: String(v.id),
          name: v.name,
          val: v.val,
          group: v.type,
        });
        visibleNodeIds.add(String(v.id));
      }
    });

    // Filter links: both ends must be visible and link type option must be enabled
    const visibleLinks: GraphLink[] = [];

    graph.edges.forEach((e) => {
      const sourceId = String(idOf(e.source_id ?? (e as any).source));
      const targetId = String(idOf(e.target_id ?? (e as any).target));

      if (!visibleNodeIds.has(sourceId) || !visibleNodeIds.has(targetId)) {
        return;
      }

      const edgeType = e.type?.toLowerCase();

      // Check link type flags
      if (edgeType === "tag" && !showTagLinks) return;
      if (edgeType === "note type" && !showNoteTypeLinks) return;
      if (edgeType !== "tag" && edgeType !== "note type" && !showLinks) return;

      visibleLinks.push({
        source: sourceId,
        target: targetId,
        type: e.type,
      });
    });

    return {
      nodes: visibleNodes,
      links: visibleLinks,
    };
  }, [
    graph,
    showNotes,
    showTags,
    showNoteTypes,
    showLinks,
    showTagLinks,
    showNoteTypeLinks,
  ]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <div className="flex flex-row w-full h-full p-8">
      <GraphLegend />
      <Graph graphData={filteredGraphData} />
    </div>
  );
};

export default GraphView;
