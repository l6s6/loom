import type { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";

/**
 * Props for the main application layout.
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Top-level application layout with a fixed sidebar and scrollable content area.
 *
 * @param props - Layout props containing the page content.
 * @returns A full-height screen layout with a sidebar and main content section.
 */
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-bg-editor overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
