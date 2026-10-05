import {
  Home,
  Network,
  HelpCircle,
  Unlink,
  Quote,
  Clock,
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
];

export const smartViewsConfig: SidebarItemConfig[] = [
  { label: "Open Questions", icon: HelpCircle, path: "/questions" },
  { label: "Loose Ends", icon: Unlink, path: "/loose-ends" },
  { label: "Raw Quotes", icon: Quote, path: "/quotes" },
  { label: "Time Capsule", icon: Clock, path: "/time-capsule" },
];
