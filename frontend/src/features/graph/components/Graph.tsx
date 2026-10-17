import ForceGraph3D from "react-force-graph-3d";
import { VertexType } from "@/features/graph/types.ts";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

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
  return (
    <div className="flex-1 overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        d3VelocityDecay={0.7}
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
        linkOpacity={0.9}
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
