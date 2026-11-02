import type { SidebarItemConfig } from "@/components/layout/sidebar/SidebarNavigation.ts";
import NavItem from "@/components/layout/sidebar/NavItem.tsx";

/**
 * Props for a sidebar section.
 */
interface SidebarBlockProps {
  label: string;
  configObject: SidebarItemConfig[];
}

/**
 * Renders a labeled group of navigation items inside the sidebar.
 *
 * @param props - The section label and the list of navigation entries to render.
 * @returns A grouped sidebar block with a title and mapped NavItem entries.
 */
const SidebarBlock = ({ label, configObject }: SidebarBlockProps) => {
  return (
    <div className="flex flex-col mb-8">
      <h3 className="text-xs text-content-muted font-bold tracking-wider mb-2">
        {label.toUpperCase()}
      </h3>
      <div className="flex flex-col gap-1">
        {configObject.map(({ icon, label, path }: SidebarItemConfig, index) => (
          <NavItem label={label} icon={icon} key={index} route={path} />
        ))}
      </div>
    </div>
  );
};

export default SidebarBlock;
