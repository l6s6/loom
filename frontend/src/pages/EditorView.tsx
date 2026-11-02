import { useNavigate, useParams } from "react-router-dom";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import NoteEditorCore from "@/features/notes/components/editor/NoteEditorCore.tsx";
import EditorTopBar from "@/features/notes/components/editor/EditorTopBar.tsx";
import { useGetNoteById } from "@/features/notes/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";

/**
 * Page view for editing a single note.
 *
 * It resolves the current note ID from the route, loads the note data, and
 * renders the editor with a top bar for navigation and deletion actions.
 *
 * @returns A page or loading/error state depending on the note fetch result.
 */
export default function EditorView() {
  const { noteId } = useParams();
  const navigate = useNavigate();

  let id: string = "";
  if (!noteId) {
    navigate("/");
  } else {
    id = noteId;
  }

  const { note, isLoading, error } = useGetNoteById(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;
  if (!note) return <ErrorView error="Error: Note not found." />;

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
