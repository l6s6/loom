import { useNavigate } from "react-router-dom";
import { useCreateNote } from "../../hooks/useNotes.ts";
import { BookOpen, Search, SquarePen } from "lucide-react";
import { useNotesContext } from "@/context/NotesContext.tsx";
import {
  mainNavItems,
  smartViewsConfig,
} from "@/components/sidebar/SidebarNavigation.ts";
import SidebarBlock from "@/components/sidebar/SidebarBlock.tsx";
import { Button } from "@/components/ui/button.tsx";

const Sidebar = () => {
  const navigate = useNavigate();

  const { refetchNotes } = useNotesContext();
  const { createNote } = useCreateNote();

  const handleCreateNote = async () => {
    const newNote = await createNote();
    await refetchNotes();
    if (newNote) {
      navigate(`/n/${newNote.id}`);
    }
  };

  return (
    <aside className="bg-bg-sidebar transition-all duration-300 w-sidebar flex flex-col h-full border-r border-border-subtle p-4">
      <div className="items-center flex flex-row justify-between pb-2 border-b border-border-subtle">
        <div
          className="flex flex-row items-center gap-2 text-2xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}
        >
          <BookOpen />
          Loom
        </div>
      </div>
      <div className="py-4 flex-1">
        <div className="relative group mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-content-muted" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none ransition-all placeholder:text-content-muted focus:shadow-sm"
          />
        </div>
        <SidebarBlock label="workbench" configObject={mainNavItems} />
        <SidebarBlock label="smart views" configObject={smartViewsConfig} />
      </div>
      <div className="border-t border-border-subtle pt-4 w-full">
        <Button onClick={handleCreateNote} className="w-full" size="lg">
          <div className="flex flex-row items-center gap-4">
            <SquarePen size={20} className="text-white font-medium" />
            <h3 className="text-sm truncate text-white font-medium">
              Capture Thought
            </h3>
          </div>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
