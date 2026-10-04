import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { NoteLink } from "@/types/noteLink.ts";
import LinkListItem from "@/components/editor/LinkListItem.tsx";

interface EditorLinksProps {
  links: NoteLink[];
  icon: LucideIcon;
  label: string;
}

const EditorLinks = ({ links, icon, label }: EditorLinksProps) => {
  const Icon = icon;
  return (
    <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
      <div className="flex flex-row items-center gap-2  mb-4">
        <Icon className="text-content-muted" size={12} />
        <span className="text-sm text-content-muted">{label}</span>
      </div>
      {links.map((link) => (
        <Link key={link.id} to={`/n/${link.source.id}`}>
          <div className="border border-border-subtle rounded-md px-2 py-1">
            <LinkListItem key={link.id} note={link.source} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EditorLinks;
