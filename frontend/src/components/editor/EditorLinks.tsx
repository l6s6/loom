import { type LucideIcon } from "lucide-react";
import type { NoteLink } from "@/types/noteLink.ts";
import LinkListItem from "@/components/editor/LinkListItem.tsx";
interface EditorLinksProps {
  links: NoteLink[];
  icon: LucideIcon;
  type: "incoming" | "outgoing";
}

const EditorLinks = ({ links, icon, type }: EditorLinksProps) => {
  const Icon = icon;
  const isIncoming = type === "incoming";
  const label = isIncoming ? "Incoming Links" : "Outgoing Links";

  return (
    <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
      <div className="flex flex-row items-center gap-2 mb-4">
        <Icon className="text-content-muted" size={12} />
        <span className="text-sm text-content-muted">{label}</span>
      </div>
      {links.map((link) => {
        const otherNote = isIncoming ? link.source : link.target;
        return <LinkListItem key={link.id} note={otherNote} link={link} />;
      })}
    </div>
  );
};

export default EditorLinks;
