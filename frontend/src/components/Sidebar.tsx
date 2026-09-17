import { Link } from "react-router-dom";
import NoteListItem from "./NoteListItem.tsx";
import { useGetNotes } from "../hooks/useNotes.ts";
import Button from "./Button.tsx";
import { SquarePen } from "lucide-react";

const Sidebar = () => {
  const { notes } = useGetNotes();

  const filteredNotes = notes.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <aside className="bg-bg-sidebar transition-all duration-300 w-sidebar flex flex-col h-full border-r border-border-subtle p-4">
      <div className="p-4 h-16 items-center border-gray-300 flex flex-row justify-between">
        <span className="text-2xl font-bold">Notes</span>
        <Button variant="ghost" onClick={() => {}}>
          <SquarePen className="size-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note) => (
          <Link to={`/n/${note.id}`} key={note.id}>
            <NoteListItem note={note} key={note.id} />
          </Link>
        ))}

        {filteredNotes.length === 0 && (
          <p className="text-content-muted text-center mt-4">No notes found.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
