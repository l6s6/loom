import { useGetGraph } from "@/features/graph/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import Graph from "@/features/graph/components/Graph.tsx";
import GraphLegend from "@/features/graph/components/GraphLegend.tsx";

const GraphView = () => {
  const { graph, isLoading, error } = useGetGraph();

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
      <GraphLegend />
      <Graph graphData={formattedGraphData} />
    </div>
  );
};

export default GraphView;
