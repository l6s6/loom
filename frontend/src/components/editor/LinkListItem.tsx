import type { Note } from "@/types/note.ts";
import { getStringPreview } from "@/lib/utils.ts";

const LinkListItem = ({ note }: { note: Note }) => {
  return (
    <div className="w-full rounded-md px-2">
      <h1 className="font-bold">
        {getStringPreview(25, note.title, "Untitled")}
      </h1>
      <span className="text-content-muted text-sm">
        {getStringPreview(35, note.content, "No content yet...")}
      </span>
    </div>
  );
};

export default LinkListItem;
