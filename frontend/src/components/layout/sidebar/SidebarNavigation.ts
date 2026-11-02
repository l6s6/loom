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

/**
 * Represents a single item in the sidebar navigation.
 */
export interface SidebarItemConfig {
  label: string;
  icon: LucideIcon;
  path: string;
}

/**
 * Primary navigation items displayed in the main sidebar.
 * These route to the core application views.
 */
export const mainNavItems: SidebarItemConfig[] = [
  { label: "Notes", icon: Home, path: "/" },
  { label: "Graph", icon: Network, path: "/graph" },
  { label: "Tags", icon: Hash, path: "/tags" },
  { label: "Note Types", icon: Tag, path: "/note-types" },
];

/**
 * Preset "smart view" shortcuts shown in the sidebar for common filtered note sets.
 * These are route-based filters that quickly surface specific note collections.
 */
export const smartViewsConfig: SidebarItemConfig[] = [
  { label: "Open Questions", icon: HelpCircle, path: "/?status=open" },
  { label: "Loose Ends", icon: Unlink, path: "/?is_loose_end=true" },
  { label: "Raw Quotes (TODO)", icon: Quote, path: "/todo?raw-quotes" },
];
