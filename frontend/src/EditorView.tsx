import { useParams } from "react-router-dom";
import { useGetNoteById } from "@/hooks/useNotes.ts";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import NoteEditorCore from "@/components/editor/NoteEditorCore.tsx";
import EditorTopBar from "@/components/editor/EditorTopBar.tsx";

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
      <NoteEditorCore initialNote={note} />
    </CenterContainer>
  );
}
