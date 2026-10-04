import type { Note } from "@/types/note.ts";
import { getStringPreview } from "@/lib/utils.ts";
import type { NoteLink } from "@/types/noteLink.ts";
import { Link } from "react-router-dom";
import { useDeleteLink } from "@/hooks/useLinks.ts";
import { Button } from "@/components/ui/button.tsx";
import { Unlink } from "lucide-react";

const LinkListItem = ({
  note,
  link,
  refetch,
}: {
  note: Note;
  link: NoteLink;
  refetch: () => Promise<void>;
}) => {
  const { deleteLink } = useDeleteLink();

  const handleDeleteLink = async (linkId: number) => {
    await deleteLink(linkId);
    await refetch();
  };

  return (
    <div className="w-full rounded-md group">
      <div
        key={link.id}
        className="flex flex-row items-center justify-between border border-border-subtle rounded-md px-2 py-1 hover:bg-bg-editor"
      >
        <Link
          key={link.id}
          to={`/n/${note.id}`}
          className="w-full flex flex-col"
        >
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-bold text-base/6">
              {getStringPreview(25, note.title, "Untitled")}
            </h1>

            <div className="px-2 py-0.5 rounded-sm flex bg-primary-bg">
              <span className="text-xs text-primary">
                {link.link_type.name}
              </span>
            </div>
          </div>
          <span className="text-content-muted text-sm">
            {getStringPreview(35, note.content, "No content yet...")}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 hover:text-destructive"
          onClick={() => handleDeleteLink(link.id)}
        >
          <Unlink size={10} />
        </Button>
      </div>
    </div>
  );
};

export default LinkListItem;
