import TitleInput from "@/features/notes/components/TitleInput.tsx";
import StatusSelector from "@/features/notes/components/StatusSelector.tsx";
import NoteTypeSelector from "@/features/notes/components/NoteTypeSelector.tsx";
import TagSelector from "@/features/notes/components/TagSelector.tsx";
import ContentArea from "@/features/notes/components/ContentArea.tsx";
import EditorFooter from "@/features/notes/components/EditorFooter.tsx";
import { useMemo } from "react";
import {
  useGetNoteTypes,
  useGetTags,
  useNoteEditorLogic,
} from "@/features/notes/hooks.ts";
import type { Note } from "@/features/notes/types.ts";

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
