import { useNotes } from "./hooks/useNotes.ts";
import NoteList from "./components/NoteList.tsx";
import CreateNoteForm from "./components/forms/CreateNoteForm.tsx";
import UpdateNoteForm from "./components/forms/UpdateNoteForm.tsx";
import DeleteNoteForm from "./components/forms/DeleteNoteForm.tsx";

export function App() {
  const { notes, loading, error, refetch } = useNotes();

  return (
    <div>
      <div className="flex flex-row mx-20 my-20 gap-12">
        <div className="flex w-full">
          <CreateNoteForm onSubmitted={refetch} />
        </div>
        <div className="flex w-full">
          <UpdateNoteForm onSubmitted={refetch} />
        </div>
        <div className="flex w-full">
          <DeleteNoteForm onSubmitted={refetch} />
        </div>
      </div>
      <NoteList notes={notes} loading={loading} error={error} />
    </div>
  );
}
