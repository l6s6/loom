import NoteConnections from "@/features/links/components/NoteConnections.tsx";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import {
  useGetNoteTypes,
  useGetTags,
  useNoteEditorLogic,
} from "@/features/notes/hooks.ts";
import type { Note } from "@/features/notes/types.ts";
import NoteMetaBar from "@/features/notes/components/editor/NoteMetaBar.tsx";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

/**
 * Main editor container for a single note.
 *
 * It combines the title field, metadata controls, markdown editor, and link
 * management panel in one cohesive interface.
 *
 * @param props - Component props.
 * @param props.initialNote - The note data to initialize the editor with.
 */
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
        <ContentEditor content={editor.content} onChange={editor.setContent} />
        <NoteConnections noteId={initialNote.id} />
      </div>
    </div>
  );
};

export default NoteEditorCore;

interface ContentEditorProps {
  content: string;
  onChange: Dispatch<SetStateAction<string>>;
}

/**
 * Rich text editor for writing note markdown content.
 *
 * It uses Tiptap with the Markdown extension so the content is stored as Markdown
 * while still supporting a WYSIWYG editing experience.
 *
 * @param props - Editor props.
 * @param props.content - Current markdown content.
 * @param props.onChange - Callback used to persist updated markdown content.
 */
export function ContentEditor({ content, onChange }: ContentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "w-full outline-none text-lg min-h-[400px] leading-relaxed focus:outline-none prose prose-slate max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const md = (editor.storage as any).markdown.getMarkdown();
      onChange(md);
    },
  });

  return <EditorContent editor={editor} />;
}
