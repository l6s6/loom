import ForceGraph3D from "react-force-graph-3d";
import { VertexType } from "@/features/graph/types.ts";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

type GNode = { id: string; name: string; val: number; group: VertexType };
type GLink = { source: string; target: string; type: string };

const COLORS: Record<string, string> = {
  [VertexType.note]: "#2e5497",
  [VertexType.tag]: "#2a8f70",
  [VertexType.note_type]: "#8f3030",
};
const FALLBACK_COLOR = "#94a3b8";
const ACCENT = "#4f46e5";

const GROUP_LABEL: Record<string, string> = {
  [VertexType.note]: "notes",
  [VertexType.tag]: "tags",
  [VertexType.note_type]: "types",
};
// Row order in the hover card: type and tags first, then linked notes
const GROUP_ORDER: string[] = [
  VertexType.note_type,
  VertexType.tag,
  VertexType.note,
];

const LINK_BASE = "rgba(120,130,145,0.25)";
const LINK_DIM = "rgba(120,130,145,0.04)";
const LINK_HOT = "rgba(79,70,229,0.7)";

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const idOf = (x: any): string => (typeof x === "object" ? x.id : x);

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
    nodes: GNode[];
    links: GLink[];
  };
}) => {
  const navigate = useNavigate();
  const fgRef = useRef<any>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Neighbor sets and node lookup (idOf is needed because the library turns source/target into objects)
  const { neighbors, byId } = useMemo(() => {
    const neighbors = new Map<string, Set<string>>();
    const byId = new Map<string, GNode>();
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
    const by = new Map<string, GNode[]>();
    (neighbors.get(hoverId) ?? new Set<string>()).forEach((id) => {
      const n = byId.get(id);
      if (!n) return;
      by.set(n.group, [...(by.get(n.group) ?? []), n]);
    });
    return [...by.entries()]
      .sort((a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]))
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
          const base = COLORS[node.group] ?? FALLBACK_COLOR;
          if (!hoverId)
            return rgba(base, node.group === VertexType.note ? 0.8 : 0.95);
          if (node.id === hoverId) return rgba(ACCENT, 1);
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
          isHot(l) ? LINK_HOT : hoverId ? LINK_DIM : LINK_BASE
        }
        linkDirectionalArrowColor={(l: any) =>
          isHot(l) ? LINK_HOT : hoverId ? LINK_DIM : LINK_BASE
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

      {/* Hover card: shows the groups of the node under the cursor */}
      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 flex w-64 max-w-[calc(100%-1.5rem)] flex-col gap-2.5 rounded-lg border border-slate-200 bg-white/95 p-3 text-sm shadow-sm">
          <div>
            <div className="truncate font-medium text-slate-900">
              {hovered.name}
            </div>
            <div className="text-xs text-slate-500">
              {GROUP_LABEL[hovered.group] ?? "Knoten"} ·{" "}
              {neighbors.get(hovered.id)?.size ?? 0} Verbindungen
            </div>
          </div>
          {hoverGroups.map(({ group, nodes }) => (
            <div key={group} className="flex flex-col gap-1">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {GROUP_LABEL[group] ?? "Sonstige"}
                {nodes.length > 1 ? ` · ${nodes.length}` : ""}
              </div>
              <div className="flex flex-wrap gap-1">
                {nodes.slice(0, 8).map((n) => (
                  <span
                    key={n.id}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 px-1.5 py-0.5 text-xs text-slate-700"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: COLORS[n.group] ?? FALLBACK_COLOR }}
                    />
                    <span className="truncate">{n.name}</span>
                  </span>
                ))}
                {nodes.length > 8 && (
                  <span className="px-1 py-0.5 text-xs text-slate-400">
                    +{nodes.length - 8}
                  </span>
                )}
              </div>
            </div>
          ))}
          {hoverGroups.length === 0 && (
            <div className="text-xs text-slate-400">Keine Verbindungen</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Graph;
