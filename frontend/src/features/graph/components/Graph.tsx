import ForceGraph3D from "react-force-graph-3d";
import { VertexType } from "@/features/graph/types.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

/**
 * 3D graph view for note/tag/type relationships.
 *
 * @param props - Graph data containing nodes and links to visualize.
 * @param props.graphData - The node/link structure to render in the force graph.
 * @returns A ForceGraph3D component configured for the application’s knowledge graph.
 */
const Graph = ({
  graphData,
}: {
  graphData: {
    nodes: {
      id: string;
      name: string;
      val: number;
      group: VertexType;
    }[];
    links: {
      source: string;
      target: string;
      type: string;
    }[];
  };
}) => {
  const navigate = useNavigate();
  const fgRef = useRef<any>(null);

  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;

    // LINK DISTANCE: spreads clusters apart so dense areas remain readable.
    // Default is 30; a longer distance reduces visual crowding.
    fg.d3Force("link").distance(() => {
      // Different link types could potentially use different lengths in the future.
      return 80;
    });

    // CHARGE (Repulsion): prevents clumping while keeping disconnected nodes closer.
    // Default charge is roughly -30; stronger repulsion is proportional to connectivity.
    fg.d3Force("charge").strength((node: any) => {
      const linkCount = node.val || 1;
      return 0 - linkCount * 10; // Orphans have 0; more connected nodes repel more strongly.
    });

    fg.d3ReheatSimulation();
  }, [graphData]);

  return (
    <div className="flex-1 overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.1}
        backgroundColor="white"
        showNavInfo={true}
        nodeLabel="name"
        nodeOpacity={0.9}
        nodeResolution={20}
        nodeColor={(node) => {
          switch (node.group) {
            case "note":
              return "red";
            case "tag":
              return "blue";
            case "note_type":
              return "green";
            default:
              return "black";
          }
        }}
        linkLabel="type"
        linkOpacity={0.2}
        linkDirectionalArrowResolution={20}
        linkCurvature={0.25}
        linkColor={() => "#787"}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        linkHoverPrecision={5}
        onNodeClick={(node) => {
          if (node.group === VertexType.note) {
            navigate(`/n/${node.id}`);
          } else if (node.group == VertexType.tag) {
            navigate(`/?tag=${node.name}`);
          } else if (node.group == VertexType.note_type) {
            navigate(`/?type=${node.name}`);
          }
        }}
      />
    </div>
  );
};

export default Graph;
