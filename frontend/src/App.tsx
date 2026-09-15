import {useNotes} from "./hooks/useNotes.ts";

export default function App() {
  const { notes, loading, error } = useNotes();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {notes.map(note => <li key={note.id}>{note.title}</li>)}
    </ul>
  );
}