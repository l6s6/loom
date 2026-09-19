import { useEffect, useMemo, useState } from "react";
import { useGetNoteById, useUpdateNote } from "@/hooks/useNotes.ts";
import { useGetTypes } from "@/hooks/useTypes.ts";
import { useGetTags } from "@/hooks/useTags.ts";

export function useNoteEditor(noteId: number) {
  const { updateNote } = useUpdateNote();
  const { note, error, refetchNote } = useGetNoteById(noteId);
  const { types, refetchTypes } = useGetTypes();
  const { tags, refetchTags } = useGetTags();

  const [isLoading, setIsLoading] = useState(true);
  // Note State
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState("open");
  const [typeName, setTypeName] = useState("");

  const availableTags = useMemo(
    () =>
      tags
        .filter((t) => !note?.tags.some((selected) => selected.id === t.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [tags, note],
  );

  // Update Note fields when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setStatus(note.status);
      setTypeName(note.note_type.name);
      setIsLoading(false);
    }
  }, [note]);

  // Debouncing to avoid too many db updates
  useEffect(() => {
    const titleChanged = note && title !== note.title;
    const contentChanged = note && content !== note.content;

    if (!titleChanged && !contentChanged) return;
    const timerId = setTimeout(() => {
      updateNote({
        id: noteId,
        title: title,
        content: content,
      });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [title, content, note, noteId, updateNote]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateNote({
      id: noteId,
      status: newStatus,
    });
  };

  const handleTypeChange = async (newType: string) => {
    setTypeName(newType);
    await updateNote({
      id: noteId,
      note_type_name: newType,
    });
    await refetchTypes();
  };

  const handleAddTag = async (name: string) => {
    if (!note) {
      return;
    }
    const newTagArr = [...note.tags.map((tag) => tag.name), name];
    await updateNote({
      id: noteId,
      tag_names: newTagArr,
    });
    await refetchNote(noteId);
    await refetchTags();
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!note) {
      return;
    }
    const newTagArr = note.tags
      .filter((tag) => tag.name !== tagToRemove)
      .map((tag) => tag.name);
    await updateNote({
      id: noteId,
      tag_names: newTagArr,
    });
    await refetchNote(noteId);
    await refetchTags();
  };

  return {
    note,
    title,
    setTitle,
    content,
    setContent,
    typeName,
    setTypeName,
    status,
    setStatus,
    tags,
    types,
    isLoading,
    error,
    availableTags,
    handleAddTag,
    handleRemoveTag,
    handleStatusChange,
    handleTypeChange,
  };
}
