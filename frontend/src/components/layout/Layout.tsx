import type { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar/Sidebar.tsx";

interface LayoutProps {
  children: ReactNode;
}

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
