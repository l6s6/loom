import TitleInput from "@/components/editor/TitleInput.tsx";
import StatusSelector from "@/components/editor/StatusSelector.tsx";
import NoteTypeSelector from "@/components/editor/NoteTypeSelector.tsx";
import TagSelector from "@/components/editor/TagSelector.tsx";
import ContentArea from "@/components/editor/ContentArea.tsx";
import EditorFooter from "@/components/editor/EditorFooter.tsx";
import type { Note } from "@/types/note.ts";
import { useNoteEditorLogic } from "@/hooks/useNoteEditorLogic.ts";
import { useGetNoteTypes } from "@/hooks/useNoteTypes.ts";
import { useGetTags } from "@/hooks/useTags.ts";
import { useMemo } from "react";

const NoteEditorCore = ({ initialNote }: { initialNote: Note }) => {
  const editor = useNoteEditorLogic(initialNote);
  const { types } = useGetNoteTypes();
  const { tags } = useGetTags();

  const availableTags = useMemo(() => {
    return tags
      .filter((t) => !initialNote.tags.some((selected) => selected.id === t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tags, initialNote.tags]);

  return (
    <div>
      <div>
        <TitleInput title={editor.title} onChange={editor.setTitle} />
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <StatusSelector
            status={initialNote.status}
            onChange={editor.handleStatusChange}
          />
          <NoteTypeSelector
            typeName={initialNote.note_type.name}
            types={types}
            onChange={editor.handleTypeChange}
          />
          <TagSelector
            tags={initialNote.tags}
            availableTags={availableTags}
            onAdd={editor.handleAddTag}
            onRemove={editor.handleRemoveTag}
          />
        </div>
        <ContentArea value={editor.content} onChange={editor.setContent} />
      </div>
      <EditorFooter noteId={initialNote.id} />
    </div>
  );
};

export default NoteEditorCore;
