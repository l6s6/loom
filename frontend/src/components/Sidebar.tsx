import { useState } from "react";
import { Link } from "react-router-dom";
import NoteListItem from "./NoteListItem.tsx";
import { useGetNotes } from "../hooks/useNotes.ts";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { notes } = useGetNotes();

  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <aside className="bg-white transition-all duration-300 w-96 flex flex-col h-full border-r border-gray-200 p-4 ">
      <div className="mb-4">
        <span className="text-xl font-bold">Notes</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="mt-2 block w-full rounded-md border border-gray-300 sm:text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto pt-0">
        {filteredNotes.map((note) => (
          <Link to={`/n/${note.id}`} key={note.id}>
            <NoteListItem note={note} key={note.id} />
          </Link>
        ))}

        {filteredNotes.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">
            No notes found.
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
