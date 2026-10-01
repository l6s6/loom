import { useParams } from "react-router-dom";
import { useNoteEditor } from "@/hooks/useNoteEditor.ts";
import TitleInput from "@/components/editor/TitleInput.tsx";
import StatusSelector from "@/components/editor/StatusSelector.tsx";
import TypeSelector from "@/components/editor/TypeSelector.tsx";
import TagSelector from "@/components/editor/TagSelector.tsx";
import ContentArea from "@/components/editor/ContentArea.tsx";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";

export default function EditorView() {
  const { noteId } = useParams();
  const editor = useNoteEditor(noteId ? parseInt(noteId) : NaN);

  if (editor.isLoading) return <p>Loading</p>;
  if (editor.error) return <p>{editor.error}</p>;
  if (!editor.note) return <p>Note not found.</p>;

  return (
    <CenterContainer>
      <TitleInput title={editor.title} onChange={editor.setTitle} />
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <StatusSelector
          status={editor.status}
          onChange={editor.handleStatusChange}
        />
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
        <TypeSelector
          typeName={editor.typeName}
          types={editor.types}
          onChange={editor.handleTypeChange}
        />
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
        <TagSelector
          tags={editor.note.tags}
          availableTags={editor.availableTags}
          onAdd={editor.handleAddTag}
          onRemove={editor.handleRemoveTag}
        />
      </div>
      <ContentArea value={editor.content} onChange={editor.setContent} />
      <div className="w-[1px] h-6 bg-slate-200 mx-1" />
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {/* 3. TAGS (Popover + Command + Multi Select Pills) */}
      </div>
    </CenterContainer>
  );
}
