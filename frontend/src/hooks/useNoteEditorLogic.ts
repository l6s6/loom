import { useEffect, useState } from "react";
import { useUpdateNote } from "@/hooks/useNotes.ts";
import type { Note } from "@/types/note.ts";

export function useNoteEditorLogic(note: Note) {
  const { updateNote } = useUpdateNote();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Auto-Save Debounce
  useEffect(() => {
    if (title === note.title && content === note.content) return;

    const timer = setTimeout(() => {
      updateNote({ id: note.id, title, content });
    }, 500);
    return () => clearTimeout(timer);
  }, [title, content, note.id, note.title, note.content, updateNote]);

  const handleStatusChange = (newStatus: string) => {
    updateNote({ id: note.id, status: newStatus });
  };

  const handleTypeChange = (newType: string) => {
    updateNote({ id: note.id, note_type_name: newType });
  };

  const handleAddTag = (name: string) => {
    const newTags = [...note.tags.map((t) => t.name), name];
    updateNote({ id: note.id, tag_names: newTags });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = note.tags
      .filter((t) => t.name !== tagToRemove)
      .map((t) => t.name);

    updateNote({ id: note.id, tag_names: newTags });
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    handleStatusChange,
    handleTypeChange,
    handleAddTag,
    handleRemoveTag,
  };
}
