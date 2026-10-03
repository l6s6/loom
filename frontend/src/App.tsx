import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import { Search } from "lucide-react";
import NoteGridItem from "@/components/NoteGridItem.tsx";
import { useNotesContext } from "@/context/NotesContext.tsx";
import { useState } from "react";

export function App() {
  const { notes } = useNotesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredNotes = [...notes]
    .sort((a, b) => a.title.localeCompare(b.modified_at))
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Your Notes
      </h1>
      <div className="relative group mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-content-muted" />
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search..."
          className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none ransition-all placeholder:text-content-muted focus:shadow-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {filteredNotes.map((note) => (
          <NoteGridItem note={note} key={note.id} />
        ))}
      </div>
    </CenterContainer>
  );
}
