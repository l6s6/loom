import {
  Home,
  Network,
  HelpCircle,
  Unlink,
  Quote,
  Clock,
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
  { label: "Graph", icon: Network, path: "/todo?graph" },
  { label: "Tags", icon: Hash, path: "/tags" },
  { label: "Note Types", icon: Tag, path: "/note-types" },
];

export const smartViewsConfig: SidebarItemConfig[] = [
  { label: "Open Questions", icon: HelpCircle, path: "/?status=open" },
  { label: "Loose Ends (TODO)", icon: Unlink, path: "/todo?loose-ends" },
  { label: "Raw Quotes (TODO)", icon: Quote, path: "/todo?raw-quotes" },
  { label: "Time Capsule (TODO)", icon: Clock, path: "/todo?time-capsule" },
];
