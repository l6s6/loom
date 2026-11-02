import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

/**
 * Props for a sidebar navigation item.
 */
interface SidebarElementProps {
  icon: LucideIcon;
  label: string;
  route: string;
}

/**
 * Renders a single navigation item in the sidebar and highlights it when the
 * current route matches the target path.
 *
 * @param props - The navigation item configuration.
 * @returns A React element representing the sidebar link.
 */
const NavItem = ({ icon, label, route }: SidebarElementProps) => {
  const location = useLocation();
  const Icon = icon;

  // Resolve the route against the current origin so path and query matching can
  // be compared consistently with the router's `location`.
  const target = new URL(route, window.location.origin);
  const isActive =
    location.pathname === target.pathname && location.search === target.search;

  return (
    <Link
      to={route}
      className={`px-4 py-2 rounded-md cursor-pointer transition-all border ${
        isActive
          ? "bg-white border-border-subtle"
          : "bg-transparent border-transparent hover:bg-slate-200/50"
      }`}
    >
      <div className="flex flex-row h-full items-center gap-4 mb-1">
        <Icon
          size={20}
          className={`${isActive ? "text-indigo-700 font-bold" : "text-content-muted font-medium"}`}
        />
        <h3
          className={`text-sm truncate pr-2 ${isActive ? "text-indigo-700 font-bold" : "text-content-muted font-medium"}`}
        >
          {label}
        </h3>
      </div>
    </Link>
  );
};

export default NavItem;
