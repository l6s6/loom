import ForceGraph3D from "react-force-graph-3d";
import {
  GRAPH_ACCENT_COLOR,
  VERTEX_COLORS,
  GRAPH_FALLBACK_COLOR,
  GRAPH_GROUP_ORDER,
  GRAPH_LINK_BASE,
  GRAPH_LINK_DIM,
  GRAPH_LINK_HOT,
  type GraphLink,
  type GraphNode,
  VertexType,
} from "@/features/graph/types.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import GraphNodeInfo from "@/features/graph/components/GraphNodeInfo.tsx";
import { idOf } from "@/lib/utils.ts";

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/**
 * 3D graph view for note/tag/type relationships.
 *
 * While hovering a node, it and its connections stay visible and everything
 * else fades back. A card lists its groups (type, tags, linked notes).
 *
 * @param props - Graph data containing nodes and links to visualize.
 * @param props.graphData - The node/link structure to render in the force graph.
 * @returns A ForceGraph3D component configured for the application’s knowledge graph.
 */
const Graph = ({
  graphData,
}: {
  graphData: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
}) => {
  const navigate = useNavigate();
  const fgRef = useRef<any>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Neighbor sets and node lookup (idOf is needed because the library turns source/target into objects)
  const { neighbors, byId } = useMemo(() => {
    const neighbors = new Map<string, Set<string>>();
    const byId = new Map<string, GraphNode>();
    graphData.nodes.forEach((n) => {
      neighbors.set(n.id, new Set());
      byId.set(n.id, n);
    });
    graphData.links.forEach((l) => {
      neighbors.get(idOf(l.source))?.add(idOf(l.target));
      neighbors.get(idOf(l.target))?.add(idOf(l.source));
    });
    return { neighbors, byId };
  }, [graphData]);

  const related = useMemo(
    () => (hoverId ? (neighbors.get(hoverId) ?? new Set<string>()) : null),
    [hoverId, neighbors],
  );
  const hovered = hoverId ? byId.get(hoverId) : undefined;

  // Groups of the hovered node, sorted by type
  const hoverGroups = useMemo(() => {
    if (!hoverId) return [];
    const by = new Map<string, GraphNode[]>();
    (neighbors.get(hoverId) ?? new Set<string>()).forEach((id) => {
      const n = byId.get(id);
      if (!n) return;
      by.set(n.group, [...(by.get(n.group) ?? []), n]);
    });
    return [...by.entries()]
      .sort(
        (a, b) =>
          GRAPH_GROUP_ORDER.indexOf(a[0]) - GRAPH_GROUP_ORDER.indexOf(b[0]),
      )
      .map(([group, nodes]) => ({
        group,
        nodes: nodes.sort((a, b) => (b.val || 1) - (a.val || 1)),
      }));
  }, [hoverId, neighbors, byId]);

  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;

    fg.d3Force("link").distance(() => 60);

    // CHARGE (Repulsion): a base value so nodes without links also keep their distance;
    // more connected nodes repel more strongly.
    fg.d3Force("charge").strength((node: any) => {
      const linkCount = node.val || 1;
      return -(20 + linkCount * 10);
    });

    fg.d3ReheatSimulation();

    console.log(graphData);
  }, [graphData]);

  const isHot = (l: any) =>
    !!hoverId && (idOf(l.source) === hoverId || idOf(l.target) === hoverId);

  return (
    <div className="relative flex-1 overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        d3VelocityDecay={0.3}
        d3AlphaDecay={0.05}
        backgroundColor="#fcfcfd"
        showNavInfo={false}
        nodeLabel="name"
        nodeOpacity={1}
        nodeResolution={20}
        nodeColor={(node: any) => {
          const base = VERTEX_COLORS[node.group] ?? GRAPH_FALLBACK_COLOR;
          if (!hoverId)
            return rgba(base, node.group === VertexType.note ? 0.8 : 0.95);
          if (node.id === hoverId) return rgba(GRAPH_ACCENT_COLOR, 1);
          if (related?.has(node.id)) return rgba(base, 1); // type, tags and linked notes
          return rgba(base, 0.1);
        }}
        onNodeHover={(node: any) => setHoverId(node ? node.id : null)}
        linkLabel="type"
        linkOpacity={1}
        linkDirectionalArrowResolution={20}
        linkCurvature={0.25}
        linkWidth={(l: any) => (isHot(l) ? 1.5 : 0)}
        linkColor={(l: any) =>
          isHot(l) ? GRAPH_LINK_HOT : hoverId ? GRAPH_LINK_DIM : GRAPH_LINK_BASE
        }
        linkDirectionalArrowColor={(l: any) =>
          isHot(l) ? GRAPH_LINK_HOT : hoverId ? GRAPH_LINK_DIM : GRAPH_LINK_BASE
        }
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
      {hovered && (
        <GraphNodeInfo
          hovered={hovered}
          neighbors={neighbors}
          hoverGroups={hoverGroups}
        />
      )}
    </div>
  );
};

export default Graph;
