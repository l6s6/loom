import ForceGraph3D from "react-force-graph-3d";
import { useRef } from "react";
import { useGetGraph } from "@/features/graph/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";

const GraphView = () => {
  const fgRef = useRef<any>(null);
  const { graph, isLoading, error } = useGetGraph();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

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

  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={formattedGraphData}
        d3VelocityDecay={0.4}

        nodeLabel="name"
        nodeColor={() => "#000"}
        nodeRelSize={5}
        backgroundColor="white"

        linkColor={() => "#4b5563"}
        linkWidth={1.5}
        linkDirectionalArrowLength={10}
        linkDirectionalArrowRelPos={1}

        onNodeClick={(node) => {
          if (node.group === "note") {
            //TOOO: navigate to note
          }
        }}
      />
    </div>
  );
};

export default GraphView;
