import ForceGraph3D from "react-force-graph-3d";
import { VertexType } from "@/features/graph/types.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

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

    // LINK DISTANCE: Spreads the cluster apart
    // Default is 30. We increase it so that densely connected nodes have some breathing room.
    fg.d3Force("link").distance(() => {
      // Possible return different lengths here depending on the link type
      return 80;
    });

    // CHARGE (Repulsion): Prevents clumping and brings orphans closer
    // The default is around -30.
    fg.d3Force("charge").strength((node: any) => {
      const linkCount = node.val || 1;
      return 0 - linkCount * 10; // Orphans have 0; the more connections the more repulsion
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
          }
        }}
      />
    </div>
  );
};

export default Graph;
