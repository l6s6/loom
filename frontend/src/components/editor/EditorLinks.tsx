import { type LucideIcon, Unlink } from "lucide-react";
import { Link } from "react-router-dom";
import type { NoteLink } from "@/types/noteLink.ts";
import LinkListItem from "@/components/editor/LinkListItem.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useDeleteLink } from "@/hooks/useLinks.ts";

interface EditorLinksProps {
  links: NoteLink[];
  refetch: () => Promise<void>;
  icon: LucideIcon;
  type: "incoming" | "outgoing";
}

const EditorLinks = ({ links, refetch, icon, type }: EditorLinksProps) => {
  const { deleteLink } = useDeleteLink();
  const Icon = icon;
  const isIncoming = type === "incoming";
  const label = isIncoming ? "Incoming Links" : "Outgoing Links";

  const handleDeleteLink = async (linkId: number) => {
    await deleteLink(linkId);
    await refetch();
  };

  return (
    <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
      <div className="flex flex-row items-center gap-2  mb-4">
        <Icon className="text-content-muted" size={12} />
        <span className="text-sm text-content-muted">{label}</span>
      </div>
      {links.map((link) => {
        const otherNote = isIncoming ? link.source : link.target;
        return (
          <div className="flex flex-row items-center justify-between border border-border-subtle rounded-md px-2 py-1 hover:bg-bg-editor">
            <Link key={link.id} to={`/n/${otherNote.id}`} className="w-full">
              <LinkListItem key={link.id} note={otherNote} />
            </Link>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteLink(link.id)}
            >
              <Unlink />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorLinks;
