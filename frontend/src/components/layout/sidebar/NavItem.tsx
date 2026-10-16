import { Link, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface SidebarElementProps {
  icon: LucideIcon;
  label: string;
  route: string;
}

const NavItem = ({ icon, label, route }: SidebarElementProps) => {
  const location = useLocation();
  const Icon = icon;
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
