import {
  Home,
  Network,
  HelpCircle,
  Unlink,
  Quote,
  Hash,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItemConfig {
  label: string;
  icon: LucideIcon;
  path: string;
}

export const mainNavItems: SidebarItemConfig[] = [
  { label: "Notes", icon: Home, path: "/" },
  { label: "Graph", icon: Network, path: "/graph" },
  { label: "Tags", icon: Hash, path: "/tags" },
  { label: "Note Types", icon: Tag, path: "/note-types" },
];

export const smartViewsConfig: SidebarItemConfig[] = [
  { label: "Open Questions", icon: HelpCircle, path: "/?status=open" },
  { label: "Loose Ends", icon: Unlink, path: "/?is_loose_end=true" },
  { label: "Raw Quotes (TODO)", icon: Quote, path: "/todo?raw-quotes" },
];
