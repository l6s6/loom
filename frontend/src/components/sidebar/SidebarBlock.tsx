import type { SidebarItemConfig } from "@/components/sidebar/SidebarNavigation.ts";
import NavItem from "@/components/sidebar/NavItem.tsx";

interface SidebarBlockProps {
  label: string;
  configObject: SidebarItemConfig[];
}

const SidebarBlock = ({ label, configObject }: SidebarBlockProps) => {
  return (
    <div className="flex flex-col mb-8">
      <h3 className="text-xs text-content-muted font-bold tracking-wider mb-2">
        {label.toUpperCase()}
      </h3>
      {configObject.map(({ icon, label, path }: SidebarItemConfig, index) => (
        <NavItem label={label} icon={icon} key={index} route={path} />
      ))}
    </div>
  );
};

export default SidebarBlock;
