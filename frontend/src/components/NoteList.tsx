import type { Note } from "../types/note.ts";
import NoteListItem from "./NoteListItem.tsx";

interface NoteListProps {
  notes: Note[];
  loading?: boolean;
  error?: string | null;
}

const NoteList = ({ notes, loading, error }: NoteListProps) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} />
      ))}
    </ul>
  );
};

export default NoteList;
