import { useParams } from "react-router-dom";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import NoteEditorCore from "@/features/notes/components/NoteEditorCore.tsx";
import EditorTopBar from "@/features/notes/components/EditorTopBar.tsx";
import { useGetNoteById } from "@/features/notes/hooks.ts";

export default function EditorView() {
  const { noteId } = useParams();
  const id = noteId ? parseInt(noteId) : NaN;

  const { note, isLoading, error } = useGetNoteById(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <CenterContainer
      className="flex flex-col justify-between"
      navbar={<EditorTopBar noteId={note.id} />}
    >
      {/* Render editor only if note is already loaded */}
      <NoteEditorCore key={note.id} initialNote={note} />
    </CenterContainer>
  );
}
