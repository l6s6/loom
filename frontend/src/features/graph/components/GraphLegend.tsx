import { VERTEX_COLORS } from "@/features/graph/types.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { type Dispatch, type SetStateAction } from "react";

interface GraphLegendProps {
  showLinks: boolean;
  setShowLinks: Dispatch<SetStateAction<boolean>>;
  showTagLinks: boolean;
  setShowTagLinks: Dispatch<SetStateAction<boolean>>;
  showNoteTypeLinks: boolean;
  setShowNoteTypeLinks: Dispatch<SetStateAction<boolean>>;
}

const GraphLegend = ({
  showLinks,
  setShowLinks,
  showTagLinks,
  setShowTagLinks,
  showNoteTypeLinks,
  setShowNoteTypeLinks,
}: GraphLegendProps) => {
  return (
    <div className="absolute h-full w-96 left-sidebar top-0 bottom-0 z-1 py-8 mx-8">
      <Card className="w-full bg-bg-sidebar backdrop-filter backdrop-blur-sm bg-opacity-30 bg-clip-padding">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">Graph View</CardTitle>
        </CardHeader>

        <CardContent className="mt-4">
          <p className="text-base text-text-muted leading-relaxed">
            Move freely in 3D space.{" "}
            <strong className="text-text-main">Click on the nodes</strong>, to
            navigate directly to the respective notes, tags, or note types.
          </p>

          <div className="flex flex-col mt-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle pb-2">
              Legend
            </h3>

            <div className="flex flex-col p-4">
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
          <div className="flex flex-col mt-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle pb-2">
              Options
            </h3>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-row justify-between items-center">
                <span className="text-base font-medium">
                  Show Links between Notes
                </span>
                <Switch checked={showLinks} onCheckedChange={setShowLinks} />
              </div>
              <div className="flex flex-row justify-between items-center">
                <span className="text-base font-medium">
                  Show Links to Tags
                </span>
                <Switch
                  checked={showTagLinks}
                  onCheckedChange={setShowTagLinks}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <span className="text-base font-medium">
                  Show Links to Note Types
                </span>
                <Switch
                  checked={showNoteTypeLinks}
                  onCheckedChange={setShowNoteTypeLinks}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphLegend;
