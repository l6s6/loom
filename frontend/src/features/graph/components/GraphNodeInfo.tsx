import {
  VERTEX_COLORS,
  GRAPH_FALLBACK_COLOR,
  GRAPH_GROUP_LABEL,
  type GraphNode,
} from "@/features/graph/types.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

interface GraphNodeInfoProps {
  hovered: GraphNode;
  hoverGroups: { group: string; nodes: GraphNode[] }[];
  neighbors: Map<string, Set<string>>;
}
const GraphNodeInfo = ({
  hovered,
  hoverGroups,
  neighbors,
}: GraphNodeInfoProps) => {
  return (
    <div className="absolute h-full w-96 right-0 top-0 z-1 top-0 mt-1 right-4">
      <Card className="w-full bg-bg-sidebar backdrop-filter backdrop-blur-sm bg-opacity-30 bg-clip-padding">
        <CardHeader>
          <CardTitle className="font-extrabold">{hovered.name}</CardTitle>
          <CardDescription>
            {GRAPH_GROUP_LABEL[hovered.group] ?? "Nodes"} ·{" "}
            {neighbors.get(hovered.id)?.size ?? 0} Connections
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {hoverGroups.map(({ group, nodes }) => (
            <div key={group}>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {GRAPH_GROUP_LABEL[group] ?? "Others"}
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
                      style={{
                        background:
                          VERTEX_COLORS[n.group] ?? GRAPH_FALLBACK_COLOR,
                      }}
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
            <div className="text-xs text-slate-400">No Connections</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphNodeInfo;
