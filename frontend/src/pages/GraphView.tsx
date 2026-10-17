import ForceGraph3D from "react-force-graph-3d";
import { useRef } from "react";

function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
}

const GraphView = () => {
  const fgRef = useRef<any>(null);
  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={genRandomTree()}
        d3VelocityDecay={0.4}

        nodeLabel="name"
        nodeColor={() => "#000"}
        nodeRelSize={6}
        backgroundColor="white"

        linkColor={() => "#4b5563"}
        linkWidth={1.5}

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
