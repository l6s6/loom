import { useNotes } from "./hooks/useNotes.ts";
import NoteList from "./components/NoteList.tsx";
import NoteForm from "./components/NoteForm.tsx";

export function App() {
  const { notes, loading, error, refetch } = useNotes();

  return (
    <div>
      <NoteForm onSubmitted={refetch} mode="update" />
      <NoteList notes={notes} loading={loading} error={error} />
    </div>
  );
}
