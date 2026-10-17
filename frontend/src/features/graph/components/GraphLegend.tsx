import { VERTEX_COLORS } from "@/features/graph/types.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

const GraphLegend = () => {
  return (
    <div className="absolute h-full w-96 left-sidebar top-0 bottom-0 z-1 py-8 mx-8">
      <Card className="w-full bg-bg-sidebar backdrop-filter backdrop-blur-sm bg-opacity-30 bg-clip-padding">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">Graph View</CardTitle>
        </CardHeader>

        <CardContent className="mt-4">
          <p className="text-base text-text-muted leading-relaxed mb-8">
            Move freely in 3D space.{" "}
            <strong className="text-text-main">Click on the nodes</strong>, to
            navigate directly to the respective notes, tags, or note types.
          </p>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle pb-2">
              Legend
            </h3>

            <div className="flex flex-col gap-3 mt-2">
              {Object.entries(VERTEX_COLORS).map(([type, color]) => (
                <div
                  key={type}
                  className="flex items-center gap-4 hover:bg-bg-hover p-2 -ml-2 rounded-md transition-colors cursor-default"
                >
                  <div
                    className="w-5 h-5 rounded-full shadow-md shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-base font-medium capitalize">
                    {type.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphLegend;
