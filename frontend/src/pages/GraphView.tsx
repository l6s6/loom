import { useGetGraph } from "@/features/graph/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import Graph from "@/features/graph/components/Graph.tsx";
import GraphLegend from "@/features/graph/components/GraphLegend.tsx";
import { useMemo, useState } from "react";
import { buildQueryString } from "@/lib/utils.ts";

const GraphView = () => {
  const [showLinks, setShowLinks] = useState(true);
  const [showTagLinks, setShowTagLinks] = useState(false);
  const [showNoteTypeLinks, setShowNoteTypeLinks] = useState(false);

  const queryString = useMemo(() => {
    const filters = {
      show_links: showLinks.toString(),
      show_tag_links: showTagLinks.toString(),
      show_note_type_links: showNoteTypeLinks.toString(),
    };
    return buildQueryString(filters);
  }, [showLinks, showTagLinks, showNoteTypeLinks]);

  const { graph, isLoading, error } = useGetGraph(queryString);

  const formattedGraphData = {
    nodes: graph.vertices.map((v) => ({
      id: v.id,
      name: v.name,
      val: v.val,
      group: v.type,
    })),
    links: graph.edges.map((e) => ({
      source: e.source_id,
      target: e.target_id,
      type: e.type,
    })),
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <div className="flex flex-row w-full h-full p-8">
      <GraphLegend
        showLinks={showLinks}
        setShowLinks={setShowLinks}
        showTagLinks={showTagLinks}
        setShowTagLinks={setShowTagLinks}
        showNoteTypeLinks={showNoteTypeLinks}
        setShowNoteTypeLinks={setShowNoteTypeLinks}
      />
      <Graph graphData={formattedGraphData} />
    </div>
  );
};

export default GraphView;
