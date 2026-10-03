import { Link, useNavigate } from "react-router-dom";
import { useCreateNote } from "@/hooks/useNotes.ts";
import { BookOpen, Search } from "lucide-react";
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
        <SidebarBlock label="workbench" configObject={mainNavItems} />
        <SidebarBlock label="smart views" configObject={smartViewsConfig} />
      </div>
      <div className="flex gap-2  flex-row border-t border-border-subtle pt-4 w-full">
        <Button onClick={handleCreateNote} className="flex-1" size="xl">
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-sm truncate text-white font-medium">
              Capture Thought
            </h3>
          </div>
        </Button>
        <Link to="/">
          <Button variant="outline" className="flex" size="icon-xl">
            <Search />
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
