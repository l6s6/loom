import { Link, useMatch, useNavigate } from "react-router-dom";
import { useCreateNote } from "../../hooks/useNotes.ts";
import { BookOpen, Settings, SquarePen } from "lucide-react";
import { useNotesContext } from "@/context/NotesContext.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  mainNavItems,
  smartViewsConfig,
} from "@/components/sidebar/SidebarNavigation.ts";
import SidebarBlock from "@/components/sidebar/SidebarBlock.tsx";

const Sidebar = () => {
  const navigate = useNavigate();
  //const match = useMatch("/n/:noteId");

  //const urlNoteId = match?.params.noteId;

  const { notes, refetchNotes } = useNotesContext();
  const { createNote } = useCreateNote();

  // Copy notes to prevent modifying it
  // const filteredNotes = [...notes].sort((a, b) =>
  //   a.title.localeCompare(b.title),
  // );

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
      <div className="border-t border-border-subtle pt-2">
        <div
          className="px-4 py-2 rounded-md cursor-pointer transition-all bg-transparent hover:bg-slate-200/50"
          onClick={handleCreateNote}
        >
          <div className="flex flex-row h-full items-center gap-4 mb-1">
            <SquarePen size={20} className="text-content-muted font-medium" />
            <h3 className="text-sm truncate pr-2 text-content-muted font-medium">
              Create Note
            </h3>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
