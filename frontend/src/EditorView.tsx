import { useParams } from "react-router-dom";
import { useNoteEditor } from "@/hooks/useNoteEditor.ts";
import TitleInput from "@/components/editor/TitleInput.tsx";
import StatusSelector from "@/components/editor/StatusSelector.tsx";
import TypeSelector from "@/components/editor/TypeSelector.tsx";
import TagSelector from "@/components/editor/TagSelector.tsx";
import ContentArea from "@/components/editor/ContentArea.tsx";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import EditorTopBar from "@/components/editor/EditorTopBar.tsx";
import EditorFooter from "@/components/editor/EditorFooter.tsx";

export default function EditorView() {
  const { noteId } = useParams();
  const editor = useNoteEditor(noteId ? parseInt(noteId) : NaN);

  if (editor.isLoading) return <></>;
  if (editor.error) return <p>{editor.error}</p>;
  if (!editor.note) return <p>Note not found.</p>;

  return (
    <CenterContainer
      navbar={<EditorTopBar noteId={editor.note.id} />}
      className="flex flex-col justify-between"
    >
      <div>
        <TitleInput title={editor.title} onChange={editor.setTitle} />
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <StatusSelector
            status={editor.status}
            onChange={editor.handleStatusChange}
          />
          <TypeSelector
            typeName={editor.typeName}
            types={editor.types}
            onChange={editor.handleTypeChange}
          />
          <TagSelector
            tags={editor.note.tags}
            availableTags={editor.availableTags}
            onAdd={editor.handleAddTag}
            onRemove={editor.handleRemoveTag}
          />
        </div>
        <ContentArea value={editor.content} onChange={editor.setContent} />
      </div>
      <EditorFooter noteId={editor.note.id} />
    </CenterContainer>
  );
}
