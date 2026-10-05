import NoteConnections from "@/features/links/components/NoteConnections.tsx";
import { useMemo } from "react";
import {
  useGetNoteTypes,
  useGetTags,
  useNoteEditorLogic,
} from "@/features/notes/hooks.ts";
import type { Note } from "@/features/notes/types.ts";
import { AlignLeft } from "lucide-react";
import NoteMetaBar from "@/features/notes/components/NoteMetaBar.tsx";

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
        {/* Note Title Input */}
        <input
          type="text"
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight"
        />
        <NoteMetaBar
          initialNote={initialNote}
          onStatusChange={editor.handleStatusChange}
          types={types}
          onTypeChange={editor.handleTypeChange}
          availableTags={availableTags}
          onAddTag={editor.handleAddTag}
          onRemoveTag={editor.handleRemoveTag}
        />
        {/* Note Content Editor */}
        <div className="relative group mt-8">
          <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <AlignLeft
              size={20}
              className="text-slate-300 hover:text-slate-500"
            />
          </div>
          <textarea
            value={editor.content}
            onChange={(e) => editor.setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 p-0 text-lg min-h-100 resize-none leading-relaxed"
          />
        </div>
      </div>
      <NoteConnections noteId={initialNote.id} />
    </div>
  );
};

export default NoteEditorCore;
