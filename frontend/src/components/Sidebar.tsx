import { Link } from "react-router-dom";
import NoteListItem from "./NoteListItem.tsx";
import { useCreateNote, useGetNotes } from "../hooks/useNotes.ts";
import { SquarePen } from "lucide-react";

const Sidebar = () => {
  const { notes } = useGetNotes();
  const { createNote } = useCreateNote();

  const filteredNotes = notes.sort((a, b) => a.title.localeCompare(b.title));

  const createNewNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      window.location.href = `/n/${newNote.id}`;
    }
  };

  return (
    <aside className="bg-bg-sidebar transition-all duration-300 w-sidebar flex flex-col h-full border-r border-border-subtle p-4">
      <div className="pl-4 h-16 items-center border-gray-300 flex flex-row justify-between">
        <span className="text-2xl font-bold">Notes</span>
        <SquarePen
          onClick={createNewNote}
          className="size-5 m-2 hover:cursor-pointer"
        />
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
